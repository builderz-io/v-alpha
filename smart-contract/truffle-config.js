var HDWalletProvider = require( 'truffle-hdwallet-provider' );
var mnemonic = 'park image awkward badge lift scheme leave useless opera prefer soon bag';
module.exports = {
  networks: {
    // development: {
    //   host: "127.0.0.1",
    //   port: 8545,
    //   network_id: "*",
    //   websockets: true
    // },
    valueprivatechain: {
      host: '209.250.246.195',
      port: 8450,
      network_id: '*'
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider( mnemonic, 'https://ropsten.infura.io/v3/625537f6d9c8478980570cd3c99f5623' );
      },
      network_id: 3
    },
    development: {
      provider: function() {
        return new HDWalletProvider( mnemonic, 'http://127.0.0.1:9545/' );
      },
      network_id: '*',
    },

  },
  compilers: {
    solc: {
      settings: {
        optimizer: {
          enabled: true
        }
      }
    }
  }
};
