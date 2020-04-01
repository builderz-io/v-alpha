var VICoin = artifacts.require( './VICoin.sol' );

module.exports = function( deployer ) {

  const name = 'VI Berlin',
    symbol = 'VALUE',
    decimals = 6,
    lifetimeInBlocks = 1000000000,
    generationAmount = 100 * ( 10**decimals ),
    generationPeriod = 1,
    communityTaxPercentage = 10 * 100,
    transactionFeePercentage = 50 * 100,
    initialBalance = 200 * ( 10**decimals ),
    communityTaxAccount = '0x3107b077b7745994cd93d85092db034ca1984d46',
    controller = '0x0000000000000000000000000000000000000000';

  deployer.deploy(  VICoin,
    name,
    symbol,
    decimals,
    lifetimeInBlocks,
    generationAmount,
    generationPeriod,
    communityTaxPercentage,
    transactionFeePercentage,
    initialBalance,
    communityTaxAccount,
    controller );

};
//
// module.exports = function(deployer) {
//
//   var name = "VI Berlin",
//       symbol = "VALUE",
//       decimals = 6,
//       lifetimeInBlocks = 10,
//       generationAmount = 100,
//       generationPeriod = 10,
//       communityTaxPercentage = 0,
//       transactionFeePercentage = 0,
//       initialBalance = 200 * (10**decimals),
//       communityTaxAccount = "0x0000000000000000000000000000000000000000",
//       controller = "0x0000000000000000000000000000000000000000";
//       deployer.deploy(  VICoin,
//                         name,
//                         symbol,
//                         decimals,
//                         lifetimeInBlocks,
//                         generationAmount,
//                         generationPeriod,
//                         communityTaxPercentage,
//                         transactionFeePercentage,
//                         initialBalance,
//                         communityTaxAccount,
//                         controller);
//
// };

/// Instructions to deploy to remix:

/// Load remix plugins: Compiler, Deploy & Run Transactions
/// (optional): Debugger, Gas Profiler

/// First use solidity-flattener to flatten to one file
/// git clone https://github.com/poanetwork/solidity-flattener
/// Deploy contract with args below:
/// "VI Berlin","VALUE",6,10,100,10,0,0,200000000,"0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000"
