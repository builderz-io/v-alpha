pragma solidity ^0.4.24;

/// This interface contains the functions to be called via the Aragon gateway

interface IVICoin {

    function approveAccount(address _account) external;

    function unapproveAccount(address _account) external;

    function verifyAccount(address _account) external;

    function updateLifetime(uint _lifetime) external;

    function updateInitialBalance(uint _initialBalance) external;

    function updateGenerationPeriod(uint _generationPeriod) external;

    function changeController(address _controller) external;

    function updateGenerationAmount(uint _generationAmount) external;

    function blowFuse(uint _fuseID, bool _confirm) external;

    function blowAllFuses(bool _confirm) external;

    function changeCommunityContributionAccount(address _newCommunityContributionAccount) external;

    function updateCommunityContribution(uint _communityContribution) external;

    function updateTransactionFee(uint _transactionFee) external;

}
