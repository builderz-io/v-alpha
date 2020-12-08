pragma solidity ^0.6.6;

import "./lib/contracts-ethereum-package/token/ERC20/IERC20.sol";

interface IVICoin is IERC20 {
    function unapproveAccount(address _account) external;

    function verifyAccount(address _account) external;

    function changeController(address _controller) external;

    function blowFuse(uint256 _fuseID, bool _confirm) external;

    function blowAllFuses(bool _confirm) external;
}
