pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";
import "./interfaces/IVICoin.sol";

contract VCommunityApp is AragonApp {
    using SafeMath for uint256;

    /// Events
    event SetVICoinAddress(address _viCoinAddress);
    event ApproveAccount(address _account);
    event UnapproveAccount(address _account);
    event VerifyAccount(address _account);
    event Updatelifetime(uint _lifetime);
    event UpdateInitialBalance(uint _initialBalance);
    event UpdateGenerationPeriod(uint _generationPeriod);
    event ChangeController(address _controller);
    event UpdateGenerationAmount(uint _generationAmount);
    event BlowFuse(uint _fuseID, bool _confirm);
    event BlowAllFuses(bool _confirm);
    event ChangeCommunityContributionAccount(address _newCommunityContributionAccount);
    event UpdateCommunityContribution(uint _communityContribution);
    event UpdateTransactionFee(uint _transactionFee);


    /// State
    IVICoin public viCoin;

    /// ACL
    bytes32 constant public SETCOINADDRESS = keccak256("SETCOINADDRESS");
    bytes32 constant public APPROVEACCOUNT = keccak256("APPROVEACCOUNT");
    bytes32 constant public UNAPPROVEACCOUNT = keccak256("UNAPPROVEACCOUNT");
    bytes32 constant public VERIFYACCOUNT = keccak256("VERIFYACCOUNT");
    bytes32 constant public UPDATELIFETIME = keccak256("UPDATELIFETIME");
    bytes32 constant public UPDATEINITIALBALANCE = keccak256("UPDATEINITIALBALANCE");
    bytes32 constant public UPDATEGENERATIONPERIOD = keccak256("UPDATEGENERATIONPERIOD");
    bytes32 constant public CHANGECONTROLLER = keccak256("CHANGECONTROLLER");
    bytes32 constant public UPDATEGENERATIONAMOUNT = keccak256("UPDATEGENERATIONAMOUNT");
    bytes32 constant public BLOWFUSE = keccak256("BLOWFUSE");
    bytes32 constant public CHANGECOMMUNITYCONTRIBUTIONACCOUNT = keccak256("CHANGECOMMUNITYCONTRIBUTIONACCOUNT");
    bytes32 constant public UPDATECOMMUNITYCONTRIBUTION = keccak256("UPDATECOMMUNITYCONTRIBUTION");
    bytes32 constant public UPDATETRANSACTIONFEE = keccak256("UPDATETRANSACTIONFEE");

    uint public communityContribution = 6900;
    uint public value = 2121;

    function initialize() public onlyInit {
        //TODO this should be set as a parameter on initialise
        address randomAddress = 0x5f6F7E8cc7346a11ca2dEf8f827b7a0b612c56a1;
        viCoin = IVICoin(randomAddress);
        initialized();
    }
    // function initialize(address _viCoinAddress) public onlyInit {
    //     viCoin = IVICoin(_viCoinAddress);
    //     initialized();
    // }

    function setVICoinAddress(address _viCoinAddress) external auth(SETCOINADDRESS) {
        viCoin = IVICoin(_viCoinAddress);
        emit SetVICoinAddress(_viCoinAddress);
    }

    function approveAccount(address _account) external auth(APPROVEACCOUNT) {
        viCoin.approveAccount(_account);
        emit ApproveAccount(_account);
    }

    function unapproveAccount(address _account) external auth(UNAPPROVEACCOUNT) {
        viCoin.unapproveAccount(_account);
        emit UnapproveAccount(_account);
    }

    function verifyAccount(
            address _account)
        external
        auth(VERIFYACCOUNT)
    {
        viCoin.verifyAccount(_account);
        emit VerifyAccount(_account);
    }

    function updateLifetime(uint _lifetime) external auth(UPDATELIFETIME) {
        viCoin.updateLifetime(_lifetime);
        emit Updatelifetime(_lifetime);
    }

    function updateInitialBalance(uint _initialBalance) external auth(UPDATEINITIALBALANCE) {
        viCoin.updateInitialBalance(_initialBalance);
        emit UpdateInitialBalance(_initialBalance);
    }

    function updateGenerationPeriod(uint _generationPeriod) external auth(UPDATEGENERATIONPERIOD) {
        viCoin.updateGenerationPeriod(_generationPeriod);
        emit UpdateGenerationPeriod(_generationPeriod);
    }

    function updateGenerationAmount(uint _generationAmount) external auth(UPDATEGENERATIONAMOUNT) {
        viCoin.updateGenerationAmount(_generationAmount);
        emit UpdateGenerationAmount(_generationAmount);
    }

    function changeController(address _controller) external auth(CHANGECONTROLLER) {
        viCoin.changeController(_controller);
        emit ChangeController(_controller);
    }

    function blowFuse(uint _fuseID, bool _confirm) external auth(BLOWFUSE) {
        viCoin.blowFuse(_fuseID, _confirm);
        emit BlowFuse(_fuseID, _confirm);
    }

    function blowAllFuses(bool _confirm) external auth(BLOWFUSE) {
        viCoin.blowAllFuses(_confirm);
        emit BlowAllFuses(_confirm);
    }

    function changeCommunityContributionAccount(address _newCommunityContributionAccount) external auth(CHANGECOMMUNITYCONTRIBUTIONACCOUNT) {
        viCoin.changeCommunityContributionAccount(_newCommunityContributionAccount);
        emit ChangeCommunityContributionAccount(_newCommunityContributionAccount);
    }

    function updateCommunityContribution(uint _communityContribution) external auth(UPDATECOMMUNITYCONTRIBUTION) {
        viCoin.updateCommunityContribution(_communityContribution);
        emit UpdateCommunityContribution(_communityContribution);
    }

    function updateTransactionFee(uint _transactionFee) external auth(UPDATETRANSACTIONFEE) {
        viCoin.updateTransactionFee(_transactionFee);
        emit UpdateTransactionFee(_transactionFee);
    }


}
