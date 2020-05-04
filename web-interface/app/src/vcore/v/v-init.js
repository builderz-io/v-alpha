const VInit = ( function() { // eslint-disable-line no-unused-vars

  const settings = {

    entityLedger: 'MongoDB', // choices are: 'MongoDB' or '3Box' (case sensitive)
    chatLedger: 'MongoDB',
    transactionLedger: 'Symbol', // choices are: 'MongoDB' or 'EVM' or 'Symbol' (case sensitive)

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

    choice: 'truffle',

    truffle: {
      contractAddress: '0xfb8f1f762801e54b300E3679645fBB3571339Bc0',
      rpc: 'http://127.0.0.1:9545'
    },
    symbol1: {
      type: 'TEST_NET',
      rpc: 'http://198.199.80.167:3000',
      generationHash: 'B626827FBD912D95931E03E9718BFE8FFD7D316E9FBB5416ED2B3C072EA32406',
      mosaicId: '85BBEA6CC462B244'
    },
    symbol2: {
      type: 'TEST_NET',
      rpc: 'http://api-01.us-west-1.symboldev.network:3000',
      generationHash: '44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C',
      mosaicId: '747B276C30626442'
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
