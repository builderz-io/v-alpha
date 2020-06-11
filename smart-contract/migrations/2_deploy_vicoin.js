var VICoin = artifacts.require("./VICoin.sol");

module.exports = function (deployer) {
  /**
   * @param name {string} - Token name, e.g. VI Berlin.
   * @param symbol {string} - Token symbol, e.g. VALUE.
   * @param decimals {uint} - Number of decimals the token supports.
   * @param lifetimeInBlocks {uint} - Token lifetime expressed in blocks.
   * @param generationAmount {uint} - Amount of tokens in a regular payout, multiplied by 10 to the power of decimals, e.g. 100 * (10**decimals).
   * @param generationPeriod {uint} - Period between regular payouts expressed in blocks.
   * @param transactionFeePercentage {uint} - Total percentage taken from the signed amount to be burned, multiplied by 10 to the power of 2, e.g. 33.33 * (10**2).
   * @param communityContributionPercentage {uint} - Percentage taken from transactionFee before burned, to be credited to the communityContributionAccount, multiplied by 10 to the power of 2, e.g. 10 * (10**2).
   * @param initialBalance {uint} - Balance credited to verified accounts, multiplied by 10 to the power of decimals, e.g. 200 * (10**decimals).
   * @param communityContributionAccount {address} - Address of the community.
   * @param controller {address} - Address of the controller.
   *
   */

  /**
   * settings for running an installation
   *
   */

  const name = 'VI Berlin',
    symbol = 'VALUE',
    decimals = 6,
    lifetimeInBlocks = 100000000,
    generationAmount = 100 * (10**decimals),
    generationPeriod = 1,
    transactionFeePercentage = 33.33 * (10**2),
    communityContributionPercentage = 10 * (10**2),
    initialBalance = 200 * (10**decimals),
    communityContributionAccount = '0x3107b077b7745994cd93d85092db034ca1984d46',
    controller = '0x0000000000000000000000000000000000000000';

  /**
   * settings for running a test
   *
   */

  // const name = "VI Berlin",
  //   symbol = "VALUE",
  //   decimals = 6,
  //   lifetimeInBlocks = 10,
  //   generationAmount = 100,
  //   generationPeriod = 10,
  //   transactionFeePercentage = 0,
  //   communityContributionPercentage = 0,
  //   initialBalance = 200000000,
  //   communityContributionAccount = "0x0000000000000000000000000000000000000000",
  //   controller = "0x0000000000000000000000000000000000000000";

  deployer.deploy(
    VICoin,
    name,
    symbol,
    decimals,
    lifetimeInBlocks,
    generationAmount,
    generationPeriod,
    communityContributionPercentage,
    transactionFeePercentage,
    initialBalance,
    communityContributionAccount,
    controller
  );
};

/**
 * Instructions to deploy to remix:
 *
 * Load remix plugins: Compiler, Deploy & Run Transactions
 * (optional): Debugger, Gas Profiler
 *
 * First use solidity-flattener to flatten to one file
 * git clone https://github.com/poanetwork/solidity-flattener
 * Deploy contract with args below:
 * "VI Berlin","VALUE",6,10,100,10,0,0,200000000,"0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000"
 *
 */
