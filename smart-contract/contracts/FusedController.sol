// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

/**
    @title A controllable contract that can incrementally transition to an
        immutable contract
    @author Marc Griffiths, Value Instrument, the enkel collective
    @notice Provides special permisions to a controller account or contract,
        while allowing those special permissions to be discarded at any time */

contract FusedController is Initializable {
    address public controller;
    // address with priviledges to adjust settings, add accounts etc

    bool allFusesBlown;
    // set this to true to blow all fuses

    bool[32] fuseBlown;
    /* allows a seperate fuse for distinct functions, so that those functions
    can be disabled */

    event BlowFuse(uint8 _fuseID);
    event BlowAllFuses();
    event ChangeController(address _newController);

    function initialize(address _controller) public initializer {
        if (_controller == address(0)) {
            controller = msg.sender;
        } else {
            controller = _controller;
        }
    }

    /// Modifiers

    modifier fused(uint8 _fuseID) {
        require(allFusesBlown == false, "Function fuse has been triggered");
        require(
            fuseBlown[_fuseID] == false,
            "Function fuse has been triggered"
        );
        _;
    }
    modifier onlyController() {
        require(msg.sender == controller, "Controller account/contract only");
        _;
    }

    function blowAllFuses(bool _confirm) external onlyController {
        require(
            _confirm,
            "This will permanently disable function all fused functions, please set _confirm=true to confirm"
        );
        allFusesBlown = true;
        emit BlowAllFuses();
    }

    function blowFuse(uint8 _fuseID, bool _confirm) external onlyController {
        require(
            _confirm == true,
            "This will permanently disable function, please set _confirm=true to confirm"
        );
        fuseBlown[_fuseID] = true;
        emit BlowFuse(_fuseID);
    }

    function changeController(address _newController) external onlyController {
        controller = _newController;
        emit ChangeController(_newController);
    }
}
