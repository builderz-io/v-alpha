pragma solidity ^0.5.8;

/// This interface contains the functions to be called via the Aragon gateway

interface IVICoin {

    function approveAccount(address _account) external;

    function unapproveAccount(address _account) external;

    function newAccount(address _account, uint8 _role, uint _maxRequest) external;

    function updatelifetime(uint _lifetime) external;

    function updateInitialBalance(uint _initialBalance) external;

    function updateGenerationPeriod(uint _generationPeriod) external;

    function changeController(address _controller) external;

    function updateGenerationAmount(uint _generationAmount) external;

    function blowFuse(uint _fuseID, bool _confirm) external;

    function makeSettingsImmutable(bool _confirm) external;

    function changeCommunityTaxAccount(address _newCommunityTaxAccount) external;

    function updateCommunityTax(uint _communityTax) external;

    function updateTransactionFee(uint _transactionFee) external;

}
