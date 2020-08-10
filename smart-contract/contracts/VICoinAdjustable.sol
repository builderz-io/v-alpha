pragma solidity ^0.6.6;

/**
    @title An open source smart contract for a UBI token with demurrage that
        gives control of the currency to the community, with adjustable
        parameters.
    @author The Value Instrument Team
    @notice 
*/

import "./VICoin.sol";

contract VIAdjustable is VICoin {
    event UpdateLifetime(uint256 lifetime);
    event UpdateInitialBalance(uint256 initialBalance);
    event UpdateGenerationAmount(uint256 generationAmount);
    event UpdateGenerationPeriod(uint256 generationPeriod);
    event UpdateCommunityContributionAccount(
        address newCommunityContributionAccount
    );
    event UpdateTransactionFee(uint256 transactionFee);
    event UpdateCommunityContribution(uint256 communityContribution);

    /// @notice Set the address that the contribution will be sent to
    function updateCommunityContributionAccount(
        address _newCommunityContributionAccount
    ) external onlyController fused(0) {
        settings
            .communityContributionAccount = _newCommunityContributionAccount;
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
        settings.communityContribution = _communityContribution;
        emit UpdateCommunityContribution(_communityContribution);
    }

    /// @notice Set the fee %, to be taken from every transaction
    function updateTransactionFee(uint256 _transactionFee)
        external
        onlyController
        fused(2)
    {
        settings.transactionFee = _transactionFee;
        emit UpdateTransactionFee(_transactionFee);
    }

    /// @notice Update the settings.lifetime for this currency.
    /// (The number of blocks after which a balance decays to zero)
    function updateLifetime(uint256 _lifetime)
        external
        onlyController
        fused(5)
    {
        settings.lifetime = _lifetime;
        emit UpdateLifetime(_lifetime);
    }

    /// @notice Update the balance issued to an account on creation
    function updateInitialBalance(uint256 _initialBalance)
        external
        onlyController
        fused(8)
    {
        settings.initialBalance = _initialBalance;
        emit UpdateInitialBalance(_initialBalance);
    }

    /// @notice Update the number of blocks between each generation period
    function updateGenerationPeriod(uint256 _generationPeriod)
        external
        onlyController
        fused(4)
    {
        require(
            numAccounts == 0,
            "Generation period cannot be changed once contract is in active use"
        );
        settings.generationPeriod = _generationPeriod;
        emit UpdateGenerationPeriod(_generationPeriod);
    }

    /** @notice Update the number of tokens issued to each account after each
            generation period */
    function updateGenerationAmount(uint256 _generationAmount)
        external
        onlyController
        fused(3)
    {
        settings.generationAmount = _generationAmount;
        emit UpdateGenerationAmount(_generationAmount);
    }
}
