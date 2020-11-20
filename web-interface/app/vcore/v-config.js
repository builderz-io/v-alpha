const VConfig = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Configuration Module
   *
   */

  const production = true;

  const settings = {

    entityLedger: 'MongoDB', // choices are: 'MongoDB' or '3Box' (case sensitive)
    chatLedger: 'MongoDB',
    transactionLedger: 'EVM', // choices are: 'MongoDB' or 'EVM' or 'Symbol' (case sensitive)
    transactionLedgerWeb2: 'MongoDB',

    socketHost: production ? 'https://cocooonmongo.valueinstrument.org' : 'http://localhost', // omit trailing slash
    socketPort: production ? 443 : 6022,

    // socketHost: 'https://buildersmongo.valueinstrument.org',
    // socketPort: 443,

    useBuilds: production ? false : false,

    sendLogsToServer: production ? true : false,

    drawMap: production ? true : true,

    subscribeToChainEvents: false,
    balanceCheckInterval: 10, // in sec
    demoContent: false, // set to 'true', then reload page once, then set to 'false'
    defaultVerification: false,
    update3BoxEntityStore: false,
    marketCacheDuration: 3, // in minutes
    managedEntitiesCacheDuration: 5, // in minutes

    tinyImageWidth: 40, // Numbers in px
    tinyImageQuality: 0.93, // Number from 0 to 1
    thumbnailWidth: 88,
    thumbnailQuality: 0.90,
    mediumImageWidth: 400,
    mediumImageQuality: 0.87,

    coinTicker: 'ETH',
    tokenTicker: 'V',

    tokenDivisibility: 18,
    transactionFee: 2500, // Total percentage taken from the signed amount to be burned, multiplied by 10 to the power of 2, e.g. 3333 for 33.33%
    communityContribution: 1000, // Percentage taken from transactionFee before burned, to be credited to the communityContributionAccount, multiplied by 10 to the power of 2, e.g. 1000 for 10.00%

    appVersion: 'v2 0.8.6',
    entityDocVersion: 'v0.3 - valueinstrument.org',

    neQuestionnaire: [

      /*
       * do not change the qid of the question once used in production,
       * max 10 questions
       *
       */

      {
        q: 'What is the project about',
        qid: 1
      },
      {
        q: 'How is the system broken',
        qid: 2
      },
      {
        q: 'What is the goal',
        qid: 3
      },
      {
        q: 'What is the system',
        qid: 4
      },
      {
        q: 'What is the shape of capital that is needed',
        qid: 5
      },
      {
        q: 'What is the point of leverage',
        qid: 6
      },
      {
        q: 'What is the trim tab, the thing that it changes, catalyses a system shift or phase change',
        qid: 7
      }
    ]
  };

  const networks = {

    choice: 'rinkeby1',

    trufflePAV1: {
      contractAddress: '0xfb8f1f762801e54b300E3679645fBB3571339Bc0',
      rpc: 'http://127.0.0.1:9545'
    },
    trufflePAV2: {
      contractAddress: '0x7F4c6BA99864fCF201f6cb07B0DF8dA0ffD0b818',
      rpc: 'http://127.0.0.1:9545'
    },
    idchain: {
      contractAddress: '',
      rpc: 'https://idchain.one/rpc/'
    },
    rinkeby1: {
      contractAddress: '0x23f1d397Bc94439C6159D618855d6D176CEad4E0', // '0xfe611d4a98760fC70B030F9c5A418Da07adD18C1', // builderz.io
      rpc: 'https://rinkeby.infura.io/v3/32ec6f4ab5544ec3a45473458c3a1638'
    },
    ropstenDevelop: {
      contractAddress: '0x87a100DFe128616e1e53e499EB0ae99Ff9Cf0d8c', // daily rice coin
      rpc: 'wss://ropsten.infura.io/v3/199ad2592bb243e2b00118d4c6de0641'
    },
    ganacheDevelop: {
      contractAddress: '0x669e17db2Db2334fDbC9CBC01D117528e5F84488', // '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550',
      rpc: 'http://161.97.97.238:8547'
    },
    kovan1: {
      contractAddress: '0x793315F6E7dAA99d6000fb2B4347F5301E20dB09',
      rpc: 'https://kovan.infura.io/v3/199ad2592bb243e2b00118d4c6de0641'
    },
    kovan2: {
      contractAddress: '0xA4788b5EB689fd886AD4Ee27119D89DC587c084E', // daily rice coin
      rpc: 'wss://kovan.infura.io/v3/199ad2592bb243e2b00118d4c6de0641'
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

  V.getSetting = getSetting;
  V.getNetwork = getNetwork;

  return {
    getSetting: getSetting,
    getNetwork: getNetwork,
  };
} )();
