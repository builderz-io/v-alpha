pragma solidity ^0.6.6;

/// This interface contains the functions to be called via the Aragon gateway

interface IVICoin {
    function approveAccount(address _account) external;

    function unapproveAccount(address _account) external;

    function verifyAccount(
        address _account,
        uint8 _role,
        uint256 _maxRequest
    ) external;

    function updatelifetime(uint256 _lifetime) external;

    function updateInitialBalance(uint256 _initialBalance) external;

    function updateGenerationPeriod(uint256 _generationPeriod) external;

    function changeController(address _controller) external;

    function updateGenerationAmount(uint256 _generationAmount) external;

    function blowFuse(uint256 _fuseID, bool _confirm) external;

    function makeSettingsImmutable(bool _confirm) external;

    function changeCommunityContributionAccount(
        address _newCommunityContributionAccount
    ) external;

    function updateCommunityContribution(uint256 _communityContribution)
        external;

    function updateTransactionFee(uint256 _transactionFee) external;
}
