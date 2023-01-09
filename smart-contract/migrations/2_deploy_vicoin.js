var VICoin = artifacts.require("./VICoin.sol");

module.exports = async function (deployer) {
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
   * VI Berlin Test Token
   * settings for running a local truffle test installation
   *
   */

  // const name = 'VI Berlin',
  //   symbol = 'VALUE',
  //   decimals = 6,
  //   generationAmount = 100 * (10**decimals),
  //   generationPeriod = 1,
  //   lifetimeInBlocks = 100000000,
  //   transactionFeePercentage = 33.33 * (10**2),
  //   communityContributionPercentage = 10 * (10**2),
  //   initialBalance = 200 * (10**decimals),
  //   communityContributionAccount = '0xdfb69ffdfe70fd00698891b753c2b029bceb3807', // trufflePAV2 2nd Account
  //   controller = '0x0000000000000000000000000000000000000000';

  /**
   * Daily Rice Token
   *
   */

  // const name = 'Rice Token',
  //   symbol = 'RTKN',
  //   decimals = 6,
  //   generationAmount = 10 * (10**decimals),
  //   generationPeriod = 180, // every 15 min on Kovan Testnet
  //   lifetimeInBlocks = 720 * 24, // 1 day on Kovan Testnet
  //   transactionFeePercentage = 33.33 * (10**2),
  //   communityContributionPercentage = 10 * (10**2),
  //   initialBalance = 100 * (10**decimals),
  //   communityContributionAccount = '0x0000000000000000000000000000000000000000',
  //   controller = '0x0000000000000000000000000000000000000000';

  /**
   * settings for running code tests
   *
   */

  const name = "VI Berlin",
    symbol = "VALUE",
    decimals = 6,
    lifetimeInBlocks = 10,
    generationAmount = 100,
    generationPeriod = 10,
    transactionFeePercentage = 0,
    communityContributionPercentage = 0,
    initialBalance = 200000000,
    communityContributionAccount = "0x0000000000000000000000000000000000000000",
    controller = "0x0000000000000000000000000000000000000000";

    await deployer.deploy(
        VICoin,
        name,
        symbol,
        lifetimeInBlocks,
        generationAmount,
        generationPeriod,
        communityContributionPercentage,
        transactionFeePercentage,
        initialBalance,
        communityContributionAccount,
        controller,
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
