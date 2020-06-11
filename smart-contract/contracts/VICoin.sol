pragma solidity ^0.5.8;

/**
    @title An open source smart contract for a UBI token with demurrage that
        gives control of the currency to the community.
    @author The Value Instrument Team
    @notice In the current form, the contract does not use a decentralised
        approach to identification. It relies on the use of the key associated
        with the 'community' address as a special account that confirms the
        validity of a particular person. For example, a community like enkel
        would confirm that we know who "Bob Smith" is, and that he doesn't have
        an account already. The community handles the processes of verifying
        participants, and is responsible for any KYC process that may be
        required now or in the future. We don't know what laws apply to the
        deployment and use of this smart contract.
    @dev This contract was developed for solc 0.5.8
    @dev Contract prioritised readability and testability over performance and
        minimisation of gas. Performance tweaking can come later.
*/

import "./lib/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "./lib/openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "./lib/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "./lib/openzeppelin-solidity/contracts/math/Math.sol";
import "./FusedController.sol";


/// @notice One contract is deployed for each community
/// @dev Based on openzeppelin's burnable and mintable ERC20 tokens
contract VICoin is
    ERC20Mintable,
    ERC20Burnable,
    ERC20Detailed,
    FusedController
{
    using SafeMath for uint256;
    using SafeMath for int256;

    // 1. Limited lifetime (decayed tokens)

    uint256 public lifetime;
    // number of blocks until balance decays to zero
    mapping(address => uint256) public lastTransactionBlock;
    // last incoming transaction
    mapping(address => uint256) public lastGenerationBlock;
    // last generation received
    mapping(address => uint256) public zeroBlock;
    // current 0 balance block

    // 2. Generation (new tokens)

    mapping(address => bool) public accountApproved;
    // is the account approved to receive generation
    uint256 public generationPeriod;
    // blocks between each generation period
    uint256 public generationAmount;
    // tokens issued to each account at each generation period
    uint256 public initialBalance;
    // starting balance for a new account

    // 3. Fees and contribution
    uint256 public communityContribution;
    // contribution % taken from the transaction fee on every transfer
    uint256 public transactionFee;
    // transaction fee % taken from every transfer
    address public communityContributionAccount;
    // account that receives the contribution payments

    // Constants
    uint256 public constant multiplier = 10**6;
    // accuracy for floating point multiplication
    uint256 public constant contributionFeeDecimals = 2;
    // number of decimal places for contribution and fee %

    // Testing
    uint256 public blocksMined;
    // blocks mined manually (for testing)

    // Events:
    event TransferSummary(
        address indexed from,
        address indexed to,
        uint256 value,
        uint256 feesBurned,
        uint256 contribution,
        uint256 payoutSender,
        uint256 payoutRecipient
    );
    event IncomeReceived(address indexed _account, uint256 _income);
    event Decay(address indexed _account, uint256 _decay);
    event Mint(address indexed to, uint256 value);
    event VerifyAccount(address indexed _account);
    event Burn(address indexed to, uint256 value);
    event ApproveAccount(address indexed _account);
    event UnapproveAccount(address _account);
    event UpdateLifetime(uint256 _lifetime);
    event UpdateInitialBalance(uint256 _initialBalance);
    event UpdateGenerationAmount(uint256 _generationAmount);
    event UpdateGenerationPeriod(uint256 _generationPeriod);
    event UpdateCommunityContributionAccount(
        address _newCommunityContributionAccount
    );
    event UpdateTransactionFee(uint256 _transactionFee);
    event UpdateCommunityContribution(uint256 _communityContribution);
    event Mined(uint256 _block);
    event Log(string _name, uint256 _value);

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _lifetime,
        uint256 _generationAmount,
        uint256 _generationPeriod,
        uint256 _communityContribution,
        uint256 _transactionFee,
        uint256 _initialBalance,
        address _communityContributionAccount,
        address _controller
    )
        public
        ERC20Detailed(_name, _symbol, _decimals)
        FusedController(_controller)
    {
        lifetime = _lifetime;
        generationAmount = _generationAmount;
        generationPeriod = _generationPeriod;
        communityContribution = _communityContribution;
        transactionFee = _transactionFee;
        initialBalance = _initialBalance;
        communityContributionAccount = _communityContributionAccount;
        if (communityContributionAccount == address(0))
            communityContributionAccount = msg.sender;
    }

    function() external payable {
        require(1 == 2, "Do not send money to the contract");
    }

    /** @notice Calculate the number of generation periods since the last
            generation block
        @return The number of completed periods since last generation block*/
    function calcNumCompletedPeriods(
        uint256 _blockNumber,
        uint256 _lastGenerationBlock,
        uint256 _generationPeriod
    ) public pure returns (uint256) {
        uint256 blocksSinceLastGeneration = _blockNumber.sub(
            _lastGenerationBlock
        );
        return blocksSinceLastGeneration.div(_generationPeriod);
    }

    /// @notice Manually trigger an onchain update of the live balance
    function triggerOnchainBalanceUpdate(address _account) public returns (uint256) {
        // 1. Decay the balance
        uint256 decay = calcDecay(
            lastTransactionBlock[_account],
            _balances[_account],
            block.number,
            zeroBlock[_account]
        );
        uint256 decayedBalance;
        if (decay > 0) {
            decayedBalance = burnAt(_account, decay);
            emit Decay(_account, decay);
        } else {
            decayedBalance = _balances[_account];
        }

        // 2. Generate tokens
        uint256 generationAccrued;
        if (accountApproved[_account]) {
            // Calculate the accrued generation, taking into account decay
            generationAccrued = calcGeneration(
                block.number,
                lastGenerationBlock[_account],
                lifetime,
                generationAmount,
                generationPeriod
            );

            if (generationAccrued > 0) {
                // Issue the generated tokens
                _mint(_account, generationAccrued);
                emit IncomeReceived(_account, generationAccrued);

                // Record the last generation block
                lastGenerationBlock[_account] += calcNumCompletedPeriods(
                    block
                        .number,
                    lastGenerationBlock[_account],
                    generationPeriod
                )
                    .mul(generationPeriod);

                // Extend the zero block
                zeroBlock[_account] = calcZeroBlock(
                    generationAccrued,
                    decayedBalance,
                    block.number,
                    lifetime,
                    zeroBlock[_account]
                );
            }
        }
        // Record the last transaction block
        if (decay > 0 || generationAccrued > 0) {
            lastTransactionBlock[_account] = block.number;
        }
        return generationAccrued;
    }

    /** @notice Calculate the generation accrued since the last generation
            period
        @dev This function contains a for loop, so in theory may fail for
            accounts that have been inactive for an extremely long time. These
            accounts will have zero balance anyway. */
    function calcGeneration(
        uint256 _blockNumber,
        uint256 _lastGenerationBlock,
        uint256 _lifetime,
        uint256 _generationAmount,
        uint256 _generationPeriod
    ) public pure returns (uint256) {
        uint256 numCompletePeriods = calcNumCompletedPeriods(
            _blockNumber,
            _lastGenerationBlock,
            _generationPeriod
        );

        uint256 decayPerBlock = multiplier.div(_lifetime);
        uint256 decayPerGenerationPeriod = decayPerBlock.mul(_generationPeriod);
        uint256 remainingPerGenerationPeriod = multiplier.sub(
            decayPerGenerationPeriod
        );

        uint256 generation;
        for (uint256 i; i < numCompletePeriods; i++) {
            generation = generation
                .mul(remainingPerGenerationPeriod)
                .div(multiplier)
                .add(_generationAmount);
        }
        return generation;
    }

    /** @notice Return the real balance of the account, as of this block
        @return Latest balance */
    function liveBalanceOf(address _account) public view returns (uint256) {
        uint256 decay = calcDecay(
            lastTransactionBlock[_account],
            _balances[_account],
            block.number,
            zeroBlock[_account]
        );
        uint256 decayedBalance = _balances[_account].sub(decay);
        if (lastGenerationBlock[_account] == 0) {
            return (decayedBalance);
        }
        uint256 generationAccrued = calcGeneration(
            block.number,
            lastGenerationBlock[_account],
            lifetime,
            generationAmount,
            generationPeriod
        );
        return decayedBalance.add(generationAccrued);
    }

    /** @notice Return the balance including decay up to the current block,
                but ignoring any accrued generation
        @return Balance after decay */
    function getDecayedBalance(address _account) public view returns (uint256) {
        uint256 decay = calcDecay(
            lastTransactionBlock[_account],
            _balances[_account],
            block.number,
            zeroBlock[_account]
        );
        return _balances[_account].sub(decay);
    }

    /////////////////
    // Transfer
    /////////////////

    /** @notice Transfer the currency from one account to another,
                updating each account to reflect the time passed, and the
                effects of the transfer
        @return Success */
    function transfer(address _to, uint256 _value) public returns (bool) {
        uint256 feesBurned;
        uint256 contribution;
        // Process generation and decay for sender
        emit Log("Sender balance before update", balanceOf(msg.sender));
        uint256 generationAccruedSender = triggerOnchainBalanceUpdate(msg.sender);
        emit Log("Sender balance after update", balanceOf(msg.sender));

        // Process generation and decay for recipient
        emit Log("Recipient balance before update", balanceOf(_to));
        uint256 generationAccruedRecipient = triggerOnchainBalanceUpdate(_to);
        emit Log("Recipient balance after update", balanceOf(_to));

        require(
            _balances[msg.sender] >= _value,
            "Not enough balance to make transfer"
        );

        // Process fees and contribution
        (feesBurned, contribution) = processFeesAndContribution(
            _value,
            transactionFee,
            communityContribution
        );
        // uint feesAndContribution = processFeesAndContribution(
        //     _value,
        //     transactionFee,
        //     communityContribution
        // );
        uint256 valueAfterFees = _value.sub(feesBurned).sub(contribution);

        //Extend zero block based on transfer
        zeroBlock[_to] = calcZeroBlock(
            valueAfterFees,
            _balances[_to],
            block.number,
            lifetime,
            zeroBlock[_to]
        );

        /* If they haven't already been updated (during decay or generation),
            then update the lastTransactionBlock for both sender and recipient */
        if (lastTransactionBlock[_to] != block.number) {
            lastTransactionBlock[_to] = block.number;
        }
        if (lastTransactionBlock[msg.sender] != block.number) {
            lastTransactionBlock[msg.sender] = block.number;
        }

        super.transfer(_to, valueAfterFees);
        emit TransferSummary(
            msg.sender,
            _to,
            valueAfterFees,
            feesBurned,
            contribution,
            generationAccruedSender,
            generationAccruedRecipient
        );
        return true;
    }

    /// @notice transferFrom disabled
    function transferFrom(
        address,
        address,
        uint256
    ) public returns (bool) {
        revert("transferFrom disabled");
    }

    /////////////////
    // Contributiones and fees
    /////////////////

    /** @notice Calculate the contribution due. Contribution is a percentage taken from the fee
        @dev Percentage to x dp as defined by contributionFeeDecimals e.g.
            when contributionFeeDecimals is 2, 1200 is 12.00%
        @return Tokens to pay as contribution */
    function calcContribution(
        uint256 _value,
        uint256 _feeRate,
        uint256 _contributionRate
    ) public pure returns (uint256) {
        uint256 contributionFeeMultiplier = (100 *
            10**contributionFeeDecimals)**2;
        return
            _value.mul(_feeRate).mul(_contributionRate).div(
                contributionFeeMultiplier
            );
    }

    /** @notice Calculate fees to burn. This is the fee % minus the contribution due
        @dev Percentage to x dp as defined by contributionFeeDecimals e.g.
            when contributionFeeDecimals is 2, 1200 is 12.00%
        @return Tokens to burn as fees */
    function calcFeesToBurn(
        uint256 _value,
        uint256 _feeRate,
        uint256 _contributionRate
    ) public pure returns (uint256) {
        uint256 contributionFeeMultiplier = 100 * 10**contributionFeeDecimals;
        return
            _value.mul(_feeRate).div(contributionFeeMultiplier).sub(
                calcContribution(_value, _feeRate, _contributionRate)
            );
    }

    /** @notice Calculate the total amount allocated for both fees and contribution
            Contribution % is not relavent as contributiones are taken from the fee
        @dev Percentage to x dp as defined by contributionFeeDecimals e.g.
            when contributionFeeDecimals is 2, 1200 is 12.00%
        @return Tokens to cover fees, inclusive of contribution */
    function calcFeesIncContribution(uint256 _value, uint256 _feeRate)
        public
        pure
        returns (uint256)
    {
        uint256 contributionFeeMultiplier = 100 * 10**contributionFeeDecimals;
        return _value.mul(_feeRate).div(contributionFeeMultiplier);
    }

    /** @notice Calculate the fees and contribution, send contribution to the communtiy account,
            and burn the fees
        @dev Percentage to x dp as defined by contributionFeeDecimals e.g.
            when contributionFeeDecimals is 2, 1200 is 12.00%
        @return The total amount used for fees and contribution */
    function processFeesAndContribution(
        uint256 _value,
        uint256 _transactionFee,
        uint256 _communityContribution
    ) internal returns (uint256, uint256) {
        uint256 feesIncContribution = calcFeesIncContribution(
            _value,
            _transactionFee
        );
        uint256 contribution = calcContribution(
            _value,
            _transactionFee,
            _communityContribution
        );
        uint256 feesToBurn = calcFeesToBurn(
            _value,
            _transactionFee,
            _communityContribution
        );
        require(
            feesIncContribution == contribution.add(feesToBurn),
            "feesIncContribution should equal contribution + feesToBurn"
        );

        if (feesToBurn > 0) {
            burn(feesToBurn);
        }

        if (contribution > 0) {
            super.transfer(communityContributionAccount, contribution);
        }

        return (feesToBurn, contribution);
    }

    ///////////////////////
    // Decay
    ///////////////////////

    /// @notice Used only for debugging
    function getDetails(address _account)
        public
        view
        returns (
            uint256 _lastBlock,
            uint256 _balance,
            uint256 _zeroBlock
        )
    {
        _lastBlock = lastTransactionBlock[_account];
        _balance = _balances[_account];
        _zeroBlock = zeroBlock[_account];
    }

    /////////////////
    // Burn / Decay
    /////////////////

    /** @notice Calculate the block at which the balance for this account will
            be zero
        @return Block at which balance is 0 */
    function calcZeroBlock(
        uint256 _value,
        uint256 _balance,
        uint256 _blockNumber,
        uint256 _lifetime,
        uint256 _originalZeroBlock
    ) public pure returns (uint256) {
        if (_balance == 0 || _originalZeroBlock == 0) {
            // No other transaction to consider, so use the full lifetime
            return _blockNumber.add(_lifetime);
        }

        /* transactionWeight is the ratio of the transfer value to the total
            balance after the transfer */
        uint256 transactionWeight = _value.mul(multiplier).div(
            _balance.add(_value)
        );

        /* multiply the full lifetime by this ratio, and add
            the result to the original zero block */
        uint256 newZeroBlock = _originalZeroBlock.add(
            _lifetime.mul(transactionWeight).div(multiplier)
        );

        if (newZeroBlock > _blockNumber.add(_lifetime)) {
            newZeroBlock = _blockNumber.add(_lifetime);
        }
        return newZeroBlock;
    }

    /** @notice Burn balance at the specified address
        @return Balance after the burn */
    function burnAt(address _recipient, uint256 _value)
        internal
        returns (uint256)
    {
        require(_value <= _balances[_recipient]);
        _balances[_recipient] = _balances[_recipient].sub(_value);
        _totalSupply = _totalSupply.sub(_value);
        emit Burn(_recipient, _value);
        emit Transfer(_recipient, address(0), _value);
        return _balances[_recipient];
    }

    /** @notice Calculate the number of tokens decayed since the last transaction
        @return Number of tokens decayed since last transaction */
    function calcDecay(
        uint256 _lastTransactionBlock,
        uint256 _balance,
        uint256 _thisBlock,
        uint256 _zeroBlock
    ) public pure returns (uint256) {
        require(
            _thisBlock >= _lastTransactionBlock,
            "Current block must be >= last transaction block"
        );

        // If zero block has not been set, decay = 0
        if (_zeroBlock == 0) {
            return 0;
        }

        // If zero block passed, decay all
        if (_thisBlock >= _zeroBlock) {
            return _balance;
        }

        // If no blocks passed since last transfer, nothing to decay
        uint256 blocksSinceLast = _thisBlock.sub(_lastTransactionBlock);
        if (blocksSinceLast == 0) {
            return 0;
        }
        /* Otherwise linear burn based on 'distance' moved to zeroblock since
            last transaction */
        uint256 fullDistance = _zeroBlock.sub(_lastTransactionBlock);
        uint256 relativeMovementToZero = blocksSinceLast.mul(multiplier).div(
            fullDistance
        );
        return _balance.mul(relativeMovementToZero).div(multiplier);
    }

    /** @notice Return the current block number
        @return Current block number */
    function getBlockNumber() public view returns (uint256) {
        return block.number;
    }

    /// @dev Disable ability to finishMinting
    function finishMinting() public onlyMinter returns (bool) {
        revert("Function disabled");
    }

    /// @dev Disable ability to mint manually
    function mint() public onlyMinter returns (bool) {
        revert("Function disabled");
    }

    /////////////////
    // Approving / unapproving accounts
    /////////////////

    /// @notice Approve the specified account to receive generation
    function approveAccount(address _account) external onlyController fused(7) {
        accountApproved[_account] = true;
        lastGenerationBlock[_account] = block.number;
        emit ApproveAccount(_account);
    }

    /** @notice Unapprove the specified account so that it no longer receives
        generation */
    function unapproveAccount(address _account)
        external
        onlyController
        fused(6)
    {
        accountApproved[_account] = false;
        emit UnapproveAccount(_account);
    }

    /** @notice Create a new account with the specified role
        @dev New accounts can always be created.
            This function can't be disabled. */
    function verifyAccount(address _account) external onlyController {
        accountApproved[_account] = true;
        if (initialBalance > 0 && lastTransactionBlock[_account] == 0) {
            _mint(_account, initialBalance);
            emit Mint(_account, initialBalance);
            zeroBlock[_account] = block.number.add(lifetime);
        }
        lastGenerationBlock[_account] = block.number;
        lastTransactionBlock[_account] = block.number;
        emit VerifyAccount(_account);
    }

    /////////////////
    // Lockable constant updates
    /////////////////

    /// @notice Update the lifetime for this currency.
    /// (The number of blocks after which a balance decays to zero)
    function updateLifetime(uint256 _lifetime)
        external
        onlyController
        fused(5)
    {
        lifetime = _lifetime;
        emit UpdateLifetime(_lifetime);
    }

    /// @notice Update the balance issued to an account on creation
    function updateInitialBalance(uint256 _initialBalance)
        external
        onlyController
        fused(8)
    {
        initialBalance = _initialBalance;
        emit UpdateInitialBalance(_initialBalance);
    }

    /// @notice Update the number of blocks between each generation period
    function updateGenerationPeriod(uint256 _generationPeriod)
        external
        onlyController
        fused(4)
    {
        //TODO: delete/update lastGenerationBlock to prevent calculation errors
        require(1==2, "Currently not possible to change generation period after deploy.");
        generationPeriod = _generationPeriod;
        emit UpdateGenerationPeriod(_generationPeriod);
    }

    /** @notice Update the number of tokens issued to each account after each
            generation period */
    function updateGenerationAmount(uint256 _generationAmount)
        external
        onlyController
        fused(3)
    {
        generationAmount = _generationAmount;
        emit UpdateGenerationAmount(_generationAmount);
    }

    /////////////////
    // Getters
    /////////////////

    /** @notice Get the number of tokens issued to each account after each
            generation period
        @return Number of tokens issued during generation */
    function getGenerationAmount() public view returns (uint256) {
        return generationAmount;
    }

    /////////////////
    // For test purposes
    /////////////////

    /** @notice For testing purposes, manually mine a block to simulate the
        passing of time */
    function mine() public {
        blocksMined = blocksMined + 1;
        emit Mined(block.number);
    }

    /////////////////
    // Adjust contributiones
    /////////////////

    /// @notice Set the address that the contribution will be sent to
    function updateCommunityContributionAccount(
        address _newCommunityContributionAccount
    ) external onlyController fused(0) {
        communityContributionAccount = _newCommunityContributionAccount;
        emit UpdateCommunityContributionAccount(
            _newCommunityContributionAccount
        );
    }

    /// @notice Set the contribution percentage, to be taken from the fee %
    function updateCommunityContribution(uint256 _communityContribution)
        external
        onlyController
        fused(1)
    {
        communityContribution = _communityContribution;
        emit UpdateCommunityContribution(_communityContribution);
    }

    /// @notice Set the fee %, to be taken from every transaction
    function updateTransactionFee(uint256 _transactionFee)
        external
        onlyController
        fused(2)
    {
        transactionFee = _transactionFee;
        emit UpdateTransactionFee(_transactionFee);
    }

    /// @notice Delete the contract. Only use for testing.
    function terminateCurrency(bool _confirm, address payable _recoverFunds)
        external
        onlyController
        fused(8)
    {
        require(
            _confirm == true,
            "Please confirm you want to destroy this contract"
        );
        selfdestruct(_recoverFunds);
    }
}
