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
    devvps: {
      provider: function () {
        return new HDWalletProvider(
          private.devvpsKeys,
          "http://161.97.97.238:8547",
          0,
          1
        );
      },
      network_id: "1337",
      // host: "161.97.97.238",
      // port: 8547,
      // websockets: true,
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
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(private.mnemonic, private.rinkebyEndpoint);
      },
      network_id: 4,
      gas: 4612388,
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
      version: "0.6.6",
    },
  },
};
