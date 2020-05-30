const VSetup = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Setup Module
   *
   */

  const settings = {

    entityLedger: 'MongoDB', // choices are: 'MongoDB' or '3Box' (case sensitive)
    chatLedger: 'MongoDB',
    transactionLedger: 'EVM', // choices are: 'MongoDB' or 'EVM' or 'Symbol' (case sensitive)
    transactionLedgerWeb2: 'MongoDB',

    socketHost: 'http://localhost',
    socketPort: 6021,
    // socketHost: 'https://mongodb.valueinstrument.org',
    // socketPort: 443,

    demoContent: false, // set to 'true', then reload page once, then set to 'false'
    defaultVerification: true,
    update3BoxEntityStore: false,
    loadMap: true,

    coinTicker: 'ETH',
    tokenTicker: 'V',

    tokenDivisibility: 6,
    transactionFee: 3333, // Total percentage taken from the signed amount to be burned, multiplied by 10 to the power of 2, e.g. 3333 for 33.33%
    communityContribution: 1000, // Percentage taken from transactionFee before burned, to be credited to the communityContributionAccount, multiplied by 10 to the power of 2, e.g. 1000 for 10.00%

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
    },
    localeos: {
      rpc: 'http://localhost:8888',
      privKey: '5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr'
    },
    testeos: {
      rpc: 'https://api.testnet.eos.io',

    }
  };

  /* ================== public methods ================== */

  function getSetting( which ) {
    return settings[which];
  }

  function getNetwork( which ) {
    if ( which ) {
      return networks[which];
    }
    else {
      const obj = networks[networks.choice];
      obj.network = networks.choice;
      return obj;
    }
  }

  /* ====================== export ====================== */

  ( () => {
    V.getSetting = getSetting;
    V.getNetwork = getNetwork;
  } )();

  return {
    getSetting: getSetting,
    getNetwork: getNetwork,
  };
} )();
