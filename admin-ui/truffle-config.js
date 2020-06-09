const HDWalletProvider = require("truffle-hdwallet-provider");
const path = require("path");
var mnemonic =
  "park image awkward badge lift scheme leave useless opera prefer soon bag";
module.exports = {
  contracts_directory: "../smart-contract/contracts",
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  },
  compilers: {
    solc: {
      settings: {
        optimizer: {
          enabled: true,
        },
      },
    },
  },
};
