const VConfig = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Configuration Module
   *
   */

  const namespaceEndpoints = {

    /* for development, firebase function is deployed to "entity-profile"-project */
    'firebase-local': 'http://localhost:5001/entity-profile/us-central1/api/v1',
    'firebase-staging': 'https://us-central1-entity-profile.cloudfunctions.net/api/v1',
    'firebase-development': 'https://us-central1-entity-profile.cloudfunctions.net/api/v1',
    'firebase-production': 'https://us-central1-entity-namespace.cloudfunctions.net/api/v1',
    'firebase-client-dfr': 'https://us-central1-client-dfr.cloudfunctions.net/api/v1',
  };

  const mongodbEndpoints = {
    trinity: {
      host: 'https://trinitymongo.valueinstrument.org',
      port: 443,
    },
    builderz: {
      host: 'https://buildersmongo.valueinstrument.org', // with 's', not 'z'
      port: 443,
    },
    local: {
      host: 'http://localhost',
      port: 6022,
    },
  };

  const apiEndpoints = {
    builderz: {
      email: 'https://api.builderz.io/v1/email',
      telegram: 'https://api.builderz.io/v1/telegram',
    },
    local: {
      email: 'http://localhost:8889/v1/email',
      telegram: 'http://localhost:8889/v1/telegram',
    },
  };

  const localeSettings = {
    'slug': '/theme/lang', // omit trailing "/"
    'english': 'en_US',
    'englisch': 'en_US',
    'german official': 'de_DE_sie',
    'deutsch offiziell': 'de_DE_sie',
    'german personal': 'de_DE_du',
    'deutsch persönlich': 'de_DE_du',
  };

  const settings = {

    appVersion: 'Alpha 3.5.0',

    entityLedger: VNetworkInit.entityLedger,
    chatLedger: VNetworkInit.chatLedger,
    transactionLedger: VNetworkInit.transactionLedger,
    managedTransactionApi: VNetworkInit.managedTransactionApi,

    socketHost: mongodbEndpoints[ VNetworkInit.mongodbEndpoint ].host,
    socketPort: mongodbEndpoints[ VNetworkInit.mongodbEndpoint ].port,

    namespaceEndpoint: namespaceEndpoints[ VNetworkInit.namespaceEndpoint ],
    telegramEndpoint: apiEndpoints[ VNetworkInit.apiEndpoint || 'builderz' ].telegram,
    emailEndpoint: apiEndpoints[ VNetworkInit.apiEndpoint || 'builderz' ].email,

    networkAdminEmail: VNetworkInit.networkAdminEmail,

    sourceEndpoint: VNetworkInit.sourceEndpoint,

    logo: VNetworkInit.logo,
    mapDefault: VNetworkInit.mapDefault,
    highlights: VNetworkInit.highlights,
    locale: localeSettings[ VNetworkInit.language ],
    localeSlug: localeSettings.slug,
    questionnaire: VNetworkInit.questionnaire,
    featureVideo: VNetworkInit.featureVideo,
    plugins: VNetworkInit.plugins,

    defaultPrivacy: VNetworkInit.defaultPrivacy,
    askforEmail: VNetworkInit.askforEmail,
    requireEmail: VNetworkInit.requireEmail,
    confirmEmail: VNetworkInit.confirmEmail,
    emailKey: VNetworkInit.emailKey,

    useBuilds: VNetworkInit.useBuilds,
    buildsHost: 'https://production.valueinstrument.org',

    sendLogsToServer: false,

    devMode: VNetworkInit.devMode,
    drawMap: true,
    queryContractState: false,

    joinVersion: 2,

    subscribeToChainEvents: false,
    balanceCheckInterval: 30, // in sec
    demoContent: false, // set to 'true', then reload page once, then set to 'false'
    defaultVerification: false,
    update3BoxEntityStore: false,
    highlightsCacheDuration: 60 * 8, // in minutes
    viewedCacheDuration: 60 * 8, // in minutes

    uuidStringLength: 10,

    tinyImageWidth: 40, // Numbers in px
    tinyImageQuality: 0.93, // Number from 0 to 1
    thumbnailWidth: 88,
    thumbnailQuality: 0.90,
    mediumImageWidth: 510,
    mediumImageQuality: 0.87,

    coinTicker: 'ETH',
    tokenTicker: 'V',

    tokenDivisibility: 18,
    transactionFee: 2500, // Total percentage taken from the signed amount to be burned, multiplied by 10 to the power of 2, e.g. 3333 for 33.33%
    communityContribution: 1000, // Percentage taken from transactionFee before burned, to be credited to the communityContributionAccount, multiplied by 10 to the power of 2, e.g. 1000 for 10.00%

  };

  const tokenContracts = {

    default: 'goerli',

    goerli: {
      contractAddress: '0x7c5ac8610bf0391409220b1dbdc285af9e2c885e',
      rpc: '',
    },
    symbol1: {
      type: 'TEST_NET',
      rpc: 'http://198.199.80.167:3000',
      generationHash: 'B626827FBD912D95931E03E9718BFE8FFD7D316E9FBB5416ED2B3C072EA32406',
      mosaicId: '85BBEA6CC462B244',
    },
    symbol2: {
      type: 'TEST_NET',
      rpc: 'http://api-01.us-west-1.symboldev.network:3000',
      generationHash: '44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C',
      mosaicId: '747B276C30626442',
    },
    localeos: {
      rpc: 'http://localhost:8888',
      privKey: '5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr',
    },
    testeos: {
      rpc: 'https://api.testnet.eos.io',

    },
  };

  /* ================== public methods ================== */

  function getSetting( which ) {
    return settings[which];
  }

  function getTokenContract(
    which = VNetworkInit.tokenContract,
  ) {
    if ( which ) {
      return tokenContracts[which];
    }
    else {
      const obj = tokenContracts[tokenContracts.default];
      obj.network = tokenContracts.default;
      return obj;
    }
  }

  /* ====================== export ====================== */

  V.getSetting = getSetting;
  V.getTokenContract = getTokenContract;

  return {
    getSetting: getSetting,
    getTokenContract: getTokenContract,
  };
} )();
