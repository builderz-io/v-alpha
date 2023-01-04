// SPDX-License-Identifier: ISC
pragma solidity ^0.8.17;

import "./IVICoin.sol";

interface IVICoinAdjustable is IVICoin {
    function updatelifetime(uint256 _lifetime) external;

    function updateInitialBalance(uint256 _initialBalance) external;

    function updateGenerationPeriod(uint256 _generationPeriod) external;

    function updateGenerationAmount(uint256 _generationAmount) external;

    function updateCommunityContribution(uint256 _communityContribution)
        external;

    function updateTransactionFee(uint256 _transactionFee) external;
}
