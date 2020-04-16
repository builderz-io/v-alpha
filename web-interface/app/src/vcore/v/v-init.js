const VInit = ( function() { // eslint-disable-line no-unused-vars

  const settings = {

    entityLedger: 'MongoDB', // choices are: 'MongoDB' or '3Box'
    chatLedger: 'MongoDB',
    transactionLedger: 'Symbol', // choices are: 'MongoDB' or 'EVM' or 'Symbol'

    socketHost: 'http://localhost',
    socketPort: 6021,
    // socketHost: 'https://mongodb.valueinstrument.org',
    // socketPort: 443,

    demoContent: false, // set to 'true', then reload page once, then set to 'false'
    update3BoxEntityStore: false,
    loadMap: true,

    coinTicker: 'ETH',
    tokenTicker: 'V',

  };

  const networks = {
    choice: 'truffle',
    truffle: {
      contractAddress: '0xfb8f1f762801e54b300E3679645fBB3571339Bc0',
      rpc: 'http://127.0.0.1:9545'
    },
    symbol: {
      rpc: 'http://198.199.80.167:3000'
    }
  };

  function getSetting( which ) {
    return settings[which];
  }

  function getNetwork( which ) {
    return networks[which];
  }

  return {
    getSetting: getSetting,
    getNetwork: getNetwork,
  };
} )();
