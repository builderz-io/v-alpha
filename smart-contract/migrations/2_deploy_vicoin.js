var VICoin = artifacts.require("./VICoin.sol");
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

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

  const instance = await deployProxy(VICoin,
    [name,
    symbol,
    lifetimeInBlocks,
    generationAmount,
    generationPeriod,
    communityContributionPercentage,
    transactionFeePercentage,
    initialBalance,
    communityContributionAccount,
    controller], 
    { deployer } );  

  //const upgraded = await upgradeProxy(instance.address, VICoin2, { deployer });

};