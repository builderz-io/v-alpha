pragma solidity ^0.5.0;

import '../../lib/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
//import './lib/openzeppelin-solidity/contracts/math/Math.sol';

contract TokenTwisterGame is ERC20 {

    using SafeMath for uint;
    using SafeMath for int;

    uint constant gameTokenLimit = 50 * 10 ** 6;
    uint constant gameContributionMin = 10 * 10 ** 6;
    uint[] randomSeeds;
    uint[] lastUsedRandomSeeds;
    address[] public gameParticipants;
    uint nonce;
    uint public totalAmount;
    event Payout(address to, uint value);


    function randomNumbers() internal {
        delete randomSeeds;
        randomSeeds = new uint[](gameParticipants.length);
        for (uint i=0; i<gameParticipants.length; i++) {
            randomSeeds[i] = randomPercent();
        }
        lastUsedRandomSeeds = randomSeeds;
    }

    function randomPercent() internal returns (uint8) {
        nonce++;
        return uint8(uint256(keccak256(abi.encodePacked(now, msg.sender, nonce)))%100);
    }

    function getGameParticipants() view public returns (address[] memory) {
        return gameParticipants;
    }

    function getLastUsedRandomSeeds() view public returns (uint[] memory) {
        return lastUsedRandomSeeds;
    }

    function getTotalAmount() view public returns (uint) {
        return totalAmount;
    }

    function payout() internal {

      for (uint i = 0; i < gameParticipants.length - 1; i++) {
        uint payoutAmount = totalAmount * randomSeeds[i] / 100;
        totalAmount = totalAmount.sub(payoutAmount);

        transfer(gameParticipants[i], payoutAmount);
        emit Payout(gameParticipants[i], payoutAmount);
      }

      transfer(gameParticipants[gameParticipants.length - 1], totalAmount);
      emit Payout(gameParticipants[gameParticipants.length - 1], totalAmount);
      totalAmount = 0;

      delete gameParticipants;

    }

    function playGame(address _participant, uint _value) public {

        require(_value == gameContributionMin);
        totalAmount = totalAmount.add(_value);
        gameParticipants.push(_participant);

        // when token collected reached e.g. 100 tokens, we twist and payout random amount to participants.
        if (totalAmount >= gameTokenLimit) {
          randomNumbers();
          payout();
        }

    }

}
