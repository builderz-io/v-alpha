const HDWalletProvider = require("truffle-hdwallet-provider");
const private = require("./private");
const path = require("path");

module.exports = {
  contracts_directory: "../smart-contract/contracts",
  test_directory: "../smart-contract/test",
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      websockets: true,
    },
    idchain: {
      provider: function () {
        return new HDWalletProvider(
          private.mnemonic,
          "https://idchain.one/rpc/"
        );
      },
      network_id: 74,
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider(private.mnemonic, private.kovanEndpoint);
      },
      network_id: 42,
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(private.mnemonic, private.ropstenEndpoint);
      },
      network_id: 3,
    },
    development9545: {
      provider: function () {
        return new HDWalletProvider(private.mnemonic, "http://127.0.0.1:9545/");
      },
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      settings: {
        version: "0.5.16",
        optimizer: {
          enabled: true,
        },
      },
    },
  },
};
