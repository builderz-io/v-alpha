// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface IVICoin is IERC20Upgradeable {
    function unapproveAccount(address _account) external;

    function verifyAccount(address _account) external;

    function changeController(address _controller) external;

    function blowFuse(uint256 _fuseID, bool _confirm) external;

    function blowAllFuses(bool _confirm) external;

    function updatelifetime(uint256 _lifetime) external;

    function updateInitialBalance(uint256 _initialBalance) external;

    function updateGenerationPeriod(uint256 _generationPeriod) external;

    function updateGenerationAmount(uint256 _generationAmount) external;

    function updateCommunityContribution(uint256 _communityContribution)
        external;

    function updateTransactionFee(uint256 _transactionFee) external;
}
