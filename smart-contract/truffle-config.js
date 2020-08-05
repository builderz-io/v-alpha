const HDWalletProvider = require("truffle-hdwallet-provider");
const private = require("./private");

module.exports = {
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
        optimizer: {
          enabled: true,
        },
      },
      version: "0.5.17",
    },
  },
};
