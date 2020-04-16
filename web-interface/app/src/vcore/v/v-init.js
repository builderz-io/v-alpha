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
    tokenDivisibility: 6,

  };

  const networks = {

    choice: 'symbol1',

    truffle: {
      contractAddress: '0xfb8f1f762801e54b300E3679645fBB3571339Bc0',
      rpc: 'http://127.0.0.1:9545'
    },
    symbol1: {
      rpc: 'http://198.199.80.167:3000',
      generationHash: ''
    },
    symbol2: {
      rpc: 'http://api-01.us-west-1.symboldev.network:3000',
      generationHash: '44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C'
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
