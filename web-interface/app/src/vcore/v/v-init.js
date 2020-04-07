const VInit = ( function() { // eslint-disable-line no-unused-vars

  const settings = {
    socketUse: true,
    socketHost: 'http://localhost',
    socketPort: 6021,
    // socketHost: 'https://mongodb.valueinstrument.org',
    // socketPort: 443,

    entityLedger: '3Box', // choices are: 'MongoDB' or '3Box'
    chatLedger: 'MongoDB',
    transactionLedger: 'EVM', // choices are: 'MongoDB' or 'EVM'

    web3Use: true,

    mapUse: true,

    demoContent: false,
    update3BoxEntityStore: false,

  };

  const networks = {
    choice: 'truffle',
    truffle: {
      contractAddress: '0xfb8f1f762801e54b300E3679645fBB3571339Bc0',
      rpc: 'http://127.0.0.1:9545'
    },
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
