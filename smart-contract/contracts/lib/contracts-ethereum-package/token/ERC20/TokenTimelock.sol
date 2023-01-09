// SPDX-License-Identifier: ISC
pragma solidity ^0.8.0;

import "./SafeERC20.sol";
import "../../Initializable.sol";

/**
 * @dev A token holder contract that will allow a beneficiary to extract the
 * tokens after a given release time.
 *
 * Useful for simple vesting schedules like "advisors get all of their tokens
 * after 1 year".
 *
 * For a more complete vesting schedule, see {TokenVesting}.
 */
contract TokenTimelockUpgradeSafe is Initializable {
    using SafeERC20 for IERC20;

    // ERC20 basic token contract being held
    IERC20 private _token;

    // beneficiary of tokens after they are released
    address private _beneficiary;

    // timestamp when token release is enabled
    uint256 private _releaseTime;


    function __TokenTimelock_init(IERC20 timelockToken, address timelockBeneficiary, uint256 timelockReleaseTime) internal initializer {
        __TokenTimelock_init_unchained(timelockToken, timelockBeneficiary, timelockReleaseTime);
    }

    function __TokenTimelock_init_unchained(IERC20 timelockToken, address timelockBeneficiary, uint256 timelockReleaseTime) internal initializer {


        // solhint-disable-next-line not-rely-on-time
        require(timelockReleaseTime > block.timestamp, "TokenTimelock: release time is before current time");
        _token = timelockToken;
        _beneficiary = timelockBeneficiary;
        _releaseTime = timelockReleaseTime;

    }


    /**
     * @return the token being held.
     */
    function token() public view returns (IERC20) {
        return _token;
    }

    /**
     * @return the beneficiary of the tokens.
     */
    function beneficiary() public view returns (address) {
        return _beneficiary;
    }

    /**
     * @return the time when the tokens are released.
     */
    function releaseTime() public view returns (uint256) {
        return _releaseTime;
    }

    /**
     * @notice Transfers tokens held by timelock to beneficiary.
     */
    function release() public virtual {
        // solhint-disable-next-line not-rely-on-time
        require(block.timestamp >= _releaseTime, "TokenTimelock: current time is before release time");

        uint256 amount = _token.balanceOf(address(this));
        require(amount > 0, "TokenTimelock: no tokens to release");

        _token.safeTransfer(_beneficiary, amount);
    }

    uint256[47] private __gap;
}
