pragma solidity >=0.4.25 <0.6.0;



// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract ShareTokenGame {
    mapping (address => uint) balances;
    uint[] public randomseeds;
    mapping (uint => address) tiragebyaddress;

    uint totalamount;
    
    uint nonce; 
    
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event LogUint(string, uint);
    
    constructor() public {
        balances[tx.origin] = 10000;
        nonce = 0; 
    }

    function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
        if (balances[msg.sender] < amount) return false;
        amount = randomPercent();
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Transfer(msg.sender, receiver, amount);
        return true;
    }



    function getBalance(address addr) public view returns(uint) {
        return balances[addr];
    }
    
    function calculRandomSeeds(uint parts) private {
        delete randomseeds;
        randomseeds = new uint[](parts);
        for (uint i=0; i<parts; i++) {
            randomseeds[i] = randomPercent();
        }
       
    }
    
    function randomPercent() private returns (uint8) {
        nonce++;
        return uint8(uint256(keccak256(abi.encodePacked(now, msg.sender, nonce)))%100);
        
        
    }   
    
    function withdraw() public returns(uint) {
        require(totalamount > 0);
        require(randomseeds.length > 0);
        
        uint totalseeds = 0;
        for (uint i=0; i<randomseeds.length; i++) {
            totalseeds +=randomseeds[i];
        }
        
        
        uint tirageamount = totalamount * randomseeds[randomseeds.length -1] / totalseeds;
        delete randomseeds[randomseeds.length -1];
        randomseeds.length--;
        
        

        totalamount -= tirageamount;
        balances[msg.sender] += tirageamount;
        
        return tirageamount;
    }
    function contribute(uint amount, uint parts) public 
    {
        require(balances[msg.sender] > amount);
        calculRandomSeeds(parts);
        
        for (uint i=0; i<randomseeds.length; i++) {
            emit LogUint("randomseeds", randomseeds[i]);
        }
        

        totalamount = amount;
        balances[msg.sender] -= amount;
        
        
        
    }
}