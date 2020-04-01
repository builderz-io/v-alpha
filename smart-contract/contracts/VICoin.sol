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

import './lib/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';
import './lib/openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol';
import './lib/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';
import './lib/openzeppelin-solidity/contracts/math/Math.sol';
import './FusedController.sol';

/// @notice One contract is deployed for each community
/// @dev Based on openzeppelin's burnable and mintable ERC20 tokens
contract VICoin is
    ERC20Mintable,
    ERC20Burnable,
    ERC20Detailed,
    FusedController
{

    using SafeMath for uint;
    using SafeMath for int;

    // 1. Limited lifetime (decayed tokens)

    uint public lifetime;
    // number of blocks until balance decays to zero
    mapping (address => uint) public lastTransactionBlock;
    // last incoming transaction
    mapping (address => uint) public lastGenerationBlock;
    // last generation received
    mapping (address => uint) public zeroBlock;
    // current 0 balance block

    // 2. Generation (new tokens)

    mapping (address => bool) public accountApproved;
    // is the account approved to receive generation
    uint public generationPeriod;
    // blocks between each generation period
    uint public generationAmount;
    // tokens issued to each account at each generation period
    uint public initialBalance;
    // starting balance for a new account

    // 3. Fees and tax
    uint public communityTax;
    // tax % taken from the transaction fee on every transfer
    uint public transactionFee;
    // transaction fee % taken from every transfer
    address public communityTaxAccount;
    // account that receives the tax payments

    // Constants
    uint constant public multiplier = 10 ** 6;
    // accuracy for floating point multiplication
    uint constant public taxFeeDecimals = 2;
    // number of decimal places for tax and fee %

    // Testing
    uint public blocksMined;
    // blocks mined manually (for testing)

    // Events:
    event IncomeReceived(address indexed _account, uint _income);
    event Decay(address indexed _account, uint _decay);
    event Mint(address indexed to, uint value);
    event NewAccount(address indexed _account);
    event Burn(address indexed to, uint value);
    event PaidTax(address indexed to, uint value);
    event BurnedFees(address indexed to, uint value);
    event ApproveAccount(address indexed _account);
    event UnapproveAccount(address _account);
    event UpdateLifetime(uint _lifetime);
    event UpdateInitialBalance(uint _initialBalance);
    event UpdateGenerationAmount(uint _generationAmount);
    event UpdateGenerationPeriod(uint _generationPeriod);
    event UpdateCommunityTaxAccount(address _newCommunityTaxAccount);
    event UpdateTransactionFee(uint _transactionFee);
    event UpdateCommunityTax(uint _communityTax);
    event Mined(uint _block);
    event Log(string _name, uint _value);

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint _lifetime,
        uint _generationAmount,
        uint _generationPeriod,
        uint _communityTax,
        uint _transactionFee,
        uint _initialBalance,
        address _communityTaxAccount,
        address _controller
    )
        ERC20Detailed(_name, _symbol, _decimals)
        FusedController(_controller)
        public
    {
        lifetime = _lifetime;
        generationAmount = _generationAmount;
        generationPeriod = _generationPeriod;
        communityTax = _communityTax;
        transactionFee = _transactionFee;
        initialBalance = _initialBalance;
        communityTaxAccount = _communityTaxAccount;
        if (communityTaxAccount == address(0)) communityTaxAccount = msg.sender;
    }

    function () external payable {
        require(1 == 2, "Do not send money to the contract");
    }

    /** @notice Calculate the number of generation periods since the last
            generation block
        @return The number of completed periods since last generation block*/
    function calcNumCompletedPeriods(
        uint _blockNumber,
        uint _lastGenerationBlock,
        uint _generationPeriod
    )
        public
        pure
        returns (uint)
    {
        uint blocksSinceLastGeneration = _blockNumber.sub(_lastGenerationBlock);
        return blocksSinceLastGeneration.div(_generationPeriod);
    }

    /// @notice Manually trigger an onchain update of the live balance
    function triggerOnchainBalanceUpdate(address _account) public {

        // 1. Decay the balance
        uint decay = calcDecay(
            lastTransactionBlock[_account],
            _balances[_account],
            block.number,
            zeroBlock[_account]
        );
        uint decayedBalance;
        if (decay > 0) {
            decayedBalance = burnAt(_account, decay);
            emit Decay(_account, decay);
        } else {
            decayedBalance = _balances[_account];
        }

        // 2. Generate tokens
        uint generationAccrued;
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
                    block.number,
                    lastGenerationBlock[_account],
                    generationPeriod
                ).mul(generationPeriod);

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
    }

    /** @notice Calculate the generation accrued since the last generation
            period
        @dev This function contains a for loop, so in theory may fail for
            accounts that have been inactive for an extremely long time. These
            accounts will have zero balance anyway. */
    function calcGeneration(
        uint _blockNumber,
        uint _lastGenerationBlock,
        uint _lifetime,
        uint _generationAmount,
        uint _generationPeriod
    )
        public
        pure
        returns (uint)
    {
        uint numCompletePeriods = calcNumCompletedPeriods(
            _blockNumber,
            _lastGenerationBlock,
            _generationPeriod
        );

        uint decayPerBlock = multiplier.div(_lifetime);
        uint decayPerGenerationPeriod = decayPerBlock.mul(_generationPeriod);
        uint remainingPerGenerationPeriod = multiplier.sub(
            decayPerGenerationPeriod
        );

        uint generation;
        for(uint i; i < numCompletePeriods; i++) {
            generation = generation.mul(
                remainingPerGenerationPeriod
            ).div(multiplier).add(_generationAmount);
        }
        return generation;
    }

    /** @notice Return the real balance of the account, as of this block
        @return Latest balance */
    function liveBalanceOf(address _account) public view returns (uint) {
        uint decay = calcDecay(
            lastTransactionBlock[_account],
            _balances[_account],
            block.number,
            zeroBlock[_account]
        );
        uint decayedBalance = _balances[_account].sub(decay);
        if (lastGenerationBlock[_account] == 0) {
            return(decayedBalance);
        }
        uint generationAccrued = calcGeneration(
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
    function getDecayedBalance(address _account) public view returns (uint) {
        uint decay = calcDecay(
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
    function transfer(address _to, uint _value) public returns (bool) {

        // Process generation and decay for sender
        triggerOnchainBalanceUpdate(msg.sender);

        // Process generation and decay for recipient
        triggerOnchainBalanceUpdate(_to);

        require(
            _balances[msg.sender] >= _value,
            "Not enough balance to make transfer"
        );

        // Process fees and tax
        uint feesAndTax = processFeesAndTax(
            _value,
            transactionFee,
            communityTax
        );
        uint valueAfterFees = _value.sub(feesAndTax);

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

        return true;
    }

    /// @notice transferFrom disabled
    function transferFrom(address, address, uint256)
        public
        returns (bool)
    {
        revert("transferFrom disabled");
    }

    /////////////////
    // Taxes and fees
    /////////////////

    /** @notice Calculate the tax due. Tax is a percentage taken from the fee
        @dev Percentage to x dp as defined by taxFeeDecimals e.g.
            when taxFeeDecimals is 2, 1200 is 12.00%
        @return Tokens to pay as tax */
    function calcTax(uint _value, uint _feeRate, uint _taxRate)
        public
        pure
        returns (uint)
    {
        uint taxFeeMultiplier = (100 * 10**taxFeeDecimals) ** 2;
        return _value.mul(_feeRate).mul(_taxRate).div(taxFeeMultiplier);
    }

    /** @notice Calculate fees to burn. This is the fee % minus the tax due
        @dev Percentage to x dp as defined by taxFeeDecimals e.g.
            when taxFeeDecimals is 2, 1200 is 12.00%
        @return Tokens to burn as fees */
    function calcFeesToBurn(uint _value, uint _feeRate, uint _taxRate)
        public
        pure
        returns (uint)
    {
        uint taxFeeMultiplier = 100 * 10**taxFeeDecimals;
        return _value.mul(_feeRate).div(taxFeeMultiplier).sub(
            calcTax(
                _value,
                _feeRate,
                _taxRate
            )
        );
    }

    /** @notice Calculate the total amount allocated for both fees and tax
            Tax % is not relavent as taxes are taken from the fee
        @dev Percentage to x dp as defined by taxFeeDecimals e.g.
            when taxFeeDecimals is 2, 1200 is 12.00%
        @return Tokens to cover fees, inclusive of tax */
    function calcFeesIncTax(uint _value, uint _feeRate)
        public
        pure
        returns (uint)
    {
        uint taxFeeMultiplier = 100 * 10**taxFeeDecimals;
        return _value.mul(_feeRate).div(taxFeeMultiplier);
    }

    /** @notice Calculate the fees and tax, send tax to the communtiy account,
            and burn the fees
        @dev Percentage to x dp as defined by taxFeeDecimals e.g.
            when taxFeeDecimals is 2, 1200 is 12.00%
        @return The total amount used for fees and tax */
    function processFeesAndTax(
        uint _value,
        uint _transactionFee,
        uint _communityTax)
        internal
        returns (uint)
    {
        uint feesIncTax = calcFeesIncTax(
            _value,
            _transactionFee
        );
        uint tax = calcTax(
            _value,
            _transactionFee,
            _communityTax
        );
        uint feesToBurn = calcFeesToBurn(
            _value,
            _transactionFee,
            _communityTax
        );
        require(feesIncTax == tax.add(feesToBurn),
            "feesIncTax should equal tax + feesToBurn"
        );

        if (feesToBurn > 0) {
            burn(feesToBurn);
            emit BurnedFees(msg.sender, feesToBurn);
        }

        if (tax > 0) {
            super.transfer(communityTaxAccount, tax);
            emit PaidTax(msg.sender, tax);
        }

        return feesIncTax;
    }

    ///////////////////////
    // Decay
    ///////////////////////

    /// @notice Used only for debugging
    function getDetails(address _account)
        public
        view
        returns (uint _lastBlock, uint _balance, uint _zeroBlock)
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
        uint _value,
        uint _balance,
        uint _blockNumber,
        uint _lifetime,
        uint _originalZeroBlock
    )
        public
        pure
        returns (uint)
    {
        if (_balance == 0 || _originalZeroBlock == 0) {
            // No other transaction to consider, so use the full lifetime
            return _blockNumber.add(_lifetime);
        }

        /* transactionWeight is the ratio of the transfer value to the total
            balance after the transfer */
        uint transactionWeight = _value.mul(multiplier).div(
            _balance.add(_value)
        );

        /* multiply the full lifetime by this ratio, and add
            the result to the original zero block */
        uint newZeroBlock = _originalZeroBlock.add(
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
        returns (uint)
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
        uint _lastTransactionBlock,
        uint _balance,
        uint _thisBlock,
        uint _zeroBlock
    )
        public
        pure
        returns (uint)
    {
        require(_thisBlock >= _lastTransactionBlock,
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
        uint blocksSinceLast = _thisBlock.sub(_lastTransactionBlock);
        if (blocksSinceLast == 0) {
            return 0;
        }
        /* Otherwise linear burn based on 'distance' moved to zeroblock since
            last transaction */
        uint fullDistance = _zeroBlock.sub(_lastTransactionBlock);
        uint relativeMovementToZero = blocksSinceLast.mul(
            multiplier
        ).div(fullDistance);
        return _balance.mul(relativeMovementToZero).div(multiplier);
    }

    /** @notice Return the current block number
        @return Current block number */
    function getBlockNumber() public view returns (uint) {
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
    function approveAccount(address _account)
        external
        onlyController
        fused(7)
    {
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
    function newAccount(
        address _account
    )
        external
        onlyController
    {
        accountApproved[_account] = true;
        if (initialBalance > 0 && lastTransactionBlock[_account] == 0) {
            _mint(_account, initialBalance);
            emit Mint(_account, initialBalance);
            zeroBlock[_account] = block.number.add(lifetime);
        }
        lastGenerationBlock[_account] = block.number;
        lastTransactionBlock[_account] = block.number;
        emit NewAccount(_account);
    }

    /////////////////
    // Lockable constant updates
    /////////////////

    /// @notice Update the lifetime for this currency.
    /// (The number of blocks afterwhich a balance decays to zero)
    function updateLifetime(uint _lifetime)
        external
        onlyController
        fused(5)
    {
        lifetime = _lifetime;
        emit UpdateLifetime(_lifetime);
    }

    /// @notice Update the balance issued to an account on creation
    function updateInitialBalance(uint _initialBalance)
        external
        onlyController
        fused(8)
    {
        initialBalance = _initialBalance;
        emit UpdateInitialBalance(_initialBalance);
    }

    /// @notice Update the number of blocks between each generation period
    function updateGenerationPeriod(uint _generationPeriod)
        external
        onlyController
        fused(4)
    {
        generationPeriod = _generationPeriod;
        emit UpdateGenerationPeriod(_generationPeriod);
    }

    /** @notice Update the number of tokens issued to each account after each
            generation period */
    function updateGenerationAmount(uint _generationAmount)
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
    function getGenerationAmount() public view returns (uint) {
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
    // Adjust taxes
    /////////////////

    /// @notice Set the address that the tax will be sent to
    function updateCommunityTaxAccount(address _newCommunityTaxAccount)
        external
        onlyController
        fused(0)
    {
      	communityTaxAccount = _newCommunityTaxAccount;
        emit UpdateCommunityTaxAccount(_newCommunityTaxAccount);
    }

    /// @notice Set the tax percentage, to be taken from the fee %
    function updateCommunityTax(uint _communityTax)
        external
        onlyController
        fused(1)
    {
        communityTax = _communityTax;
        emit UpdateCommunityTax(_communityTax);
    }

    /// @notice Set the fee %, to be take from every transaction
    function updateTransactionFee(uint _transactionFee)
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
