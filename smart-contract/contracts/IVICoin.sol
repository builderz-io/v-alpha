// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IVICoin is IERC20 {
    function unapproveAccount(address _account) external;

    function verifyAccount(address _account) external;

    function changeController(address _controller) external;

    function blowFuse(uint256 _fuseID, bool _confirm) external;

    function blowAllFuses(bool _confirm) external;
}
