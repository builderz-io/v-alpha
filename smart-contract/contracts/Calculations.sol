// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Calculations {
    uint256 constant contributionFeeDecimals = 2;
    uint256 constant multiplier = 10**6;

    /////////////////
    // Contributiones and fees
    /////////////////

    /** @notice Calculate the contribution due. Contribution is a percentage taken from the fee
        @dev Percentage to x dp as defined by contributionFeeDecimals e.g.
            when contributionFeeDecimals is 2, 1200 is 12.00%
        @return Tokens to pay as contribution */
    function calcContribution(
        uint256 _value,
        uint256 _feeRate,
        uint256 _contributionRate
    ) public pure returns (uint256) {
        uint256 contributionFeeMultiplier = (100 *
            10**contributionFeeDecimals)**2;
        return
            _value * _feeRate * _contributionRate / contributionFeeMultiplier;
    }

    /** @notice Calculate fees to burn. This is the fee % minus the contribution due
        @dev Percentage to x dp as defined by contributionFeeDecimals e.g.
            when contributionFeeDecimals is 2, 1200 is 12.00%
        @return Tokens to burn as fees */
    function calcFeesToBurn(
        uint256 _value,
        uint256 _feeRate,
        uint256 _contributionRate
    ) public pure returns (uint256) {
        uint256 contributionFeeMultiplier = 100 * 10**contributionFeeDecimals;
        // return
        //     _value.mul(_feeRate).div(contributionFeeMultiplier).sub(
        //         calcContribution(_value, _feeRate, _contributionRate)
        //     );
        return (_value * _feeRate / contributionFeeMultiplier) - calcContribution(_value, _feeRate, _contributionRate);

    }

    /** @notice Calculate the total amount allocated for both fees and contribution
            Contribution % is not relavent as contributiones are taken from the fee
        @dev Percentage to x dp as defined by contributionFeeDecimals e.g.
            when contributionFeeDecimals is 2, 1200 is 12.00%
        @return Tokens to cover fees, inclusive of contribution */
    function calcFeesIncContribution(uint256 _value, uint256 _feeRate)
        public
        pure
        returns (uint256)
    {
        uint256 contributionFeeMultiplier = 100 * 10**contributionFeeDecimals;
        return _value * _feeRate / contributionFeeMultiplier;
    }

    /** @notice Calculate the number of generation periods since the last
            generation block
        @return The number of completed periods since last generation block*/
    function calcNumCompletedPeriods(
        uint256 _blockNumber,
        uint256 _lastGenerationBlock,
        uint256 _generationPeriod
    ) public pure returns (uint256) {
        uint256 blocksSinceLastGeneration = _blockNumber - _lastGenerationBlock;
        return blocksSinceLastGeneration / _generationPeriod;
    }

    /** @notice Calculate the number of tokens decayed since the last transaction
        @return Number of tokens decayed since last transaction */
    function calcDecay(
        uint256 _lastTransactionBlock,
        uint256 _balance,
        uint256 _thisBlock,
        uint256 _zeroBlock
    ) public pure returns (uint256) {
        require(
            _thisBlock >= _lastTransactionBlock,
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
        uint256 blocksSinceLast = _thisBlock - _lastTransactionBlock;
        if (blocksSinceLast == 0) {
            return 0;
        }
        /* Otherwise linear burn based on 'distance' moved to zeroblock since
            last transaction */
        uint256 fullDistance = _zeroBlock - _lastTransactionBlock;
        uint256 relativeMovementToZero = blocksSinceLast * multiplier / fullDistance;
        return _balance * relativeMovementToZero / multiplier;
    }

    /** @notice Calculate the block at which the balance for this account will
            be zero
        @return Block at which balance is 0 */
    function calcZeroBlock(
        uint256 _value,
        uint256 _balance,
        uint256 _blockNumber,
        uint256 _lifetime,
        uint256 _originalZeroBlock
    ) public pure returns (uint256) {
        if (_balance == 0 || _originalZeroBlock == 0) {
            // No other transaction to consider, so use the full settings.lifetime
            return _blockNumber + _lifetime;
        }

        /* transactionWeight is the ratio of the transfer value to the total
            balance after the transfer */
        uint256 transactionWeight = _value * multiplier / (_balance + _value);

        /* multiply the full settings.lifetime by this ratio, and add
            the result to the original zero block */
        uint256 newZeroBlock = _originalZeroBlock + (
            _lifetime * transactionWeight / multiplier
        );

        if (newZeroBlock > _blockNumber + _lifetime) {
            newZeroBlock = _blockNumber + _lifetime;
        }
        return newZeroBlock;
    }

    /** @notice Calculate the generation accrued since the last generation
            period
        @dev This function contains a for loop, so in theory may fail for
            accounts that have been inactive for an extremely long time. These
            accounts will have zero balance anyway. */
    function calcGeneration(
        uint256 _blockNumber,
        uint256 _lastGenerationBlock,
        uint256 _lifetime,
        uint256 _generationAmount,
        uint256 _generationPeriod
    ) public pure returns (uint256) {
        uint256 numCompletePeriods = calcNumCompletedPeriods(
            _blockNumber,
            _lastGenerationBlock,
            _generationPeriod
        );

        uint256 decayPerBlock = multiplier / _lifetime;
        uint256 decayPerGenerationPeriod = decayPerBlock * _generationPeriod;
        uint256 remainingPerGenerationPeriod = multiplier - decayPerGenerationPeriod;

        uint256 generation;
        //todo replace this loop with a direct calculation
        for (uint256 i; i < numCompletePeriods; i++) {
            generation = generation
                * remainingPerGenerationPeriod
                / multiplier
                + _generationAmount;
        }
        return generation;
    }
}
