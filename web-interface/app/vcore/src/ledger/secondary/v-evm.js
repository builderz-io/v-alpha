const VEvm = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to access EVM-compatible ledgers
   *
   */

  'use strict';

  let contract;

  // const subscribedEvents = {};

  const burnAddress = '0x0000000000000000000000000000000000000000';

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      community: 'Community',
      fee: 'Transaction Fee',
      unknown: 'unknown',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ================== event handlers ================== */

  function handleTransferSummaryEvent( eventData ) {
    if ( V.cA() && ( eventData.to.toLowerCase() == V.cA() || eventData.from.toLowerCase() == V.cA() ) ) {
      // TODO
    }
  }

  /* ================== private methods ================= */

  function setNewConnectedAddress( accounts ) {
    if ( !accounts.length ) {
      V.setLocal( 'last-connected-address', 'clear' );
      V.setState( 'activeEntity', 'clear' );
      V.setLocal( 'welcome-modal', 1 );
      Join.draw( 'logged out' );
    }
    else if ( V.cA() == undefined ) {
      console.log( 'set initial connected address', accounts[0] );
      V.setLocal( 'last-connected-address', accounts[0] );
    }
    else if ( accounts[0] != V.cA() ) {
      Join.draw( 'disconnect' );
    }
  }

  function setEventSubscription( whichEvent ) {
    // https://medium.com/coinmonks/how-to-subscribe-smart-contract-events-using-web3-1-0-93e996c06af2
    const eventJsonInterface = window.Web3Obj.utils._.find( contract._jsonInterface, o => o.name === whichEvent && o.type === 'event' );
    /* const subscription = */ window.Web3Obj.eth.subscribe( 'logs', {
      address: contract.options.address,
      topics: [eventJsonInterface.signature]  },
    ( error, result ) => {
      if ( error ) { console.log( error ); return }

      const eventData = window.Web3Obj.eth.abi.decodeLog( eventJsonInterface.inputs, result.data, result.topics.slice( 1 ) );
      if ( V.getSetting( 'subscribeToChainEvents' ) && whichEvent == 'TransferSummary' ) {
        handleTransferSummaryEvent( eventData );
      }

    } );

    // subscribedEvents[whichEvent] = subscription;
  }

  function castEthBalance( balance ) {
    return Number( balance / 10**18 ).toFixed( 4 );
  }

  function castTokenBalance( balance, decimals ) {
    const divisibility = V.getState( 'contract' ) ? V.getState( 'contract' ).divisibility : 18;
    return Number( balance / 10**( divisibility ) ).toFixed( decimals || 0 );
  }

  /* ================== public methods  ================= */

  async function getWeb3Provider() {
    let provider;
    // V.debug( 'run provider check' );
    if ( window.ethereum ) {
      // Modern dapp browsers
      // V.debug( 'window.ethereum found' );
      provider = window.ethereum;
      V.setState( 'browserWallet', true );
      if ( window.ethereum.isMetaMask ) {
        window.ethereum.on( 'accountsChanged', ( accounts ) => setNewConnectedAddress( accounts ) );
      }
    }
    else if ( window.web3 ) {
      // Legacy dapp browsers
      // V.debug( 'Legacy dapp browser found' );
      // provider = window.web3.currentProvider;
      return {
        success: false,
        status: 'web3 provider outdated',
      };
    }
    else {
      // If no injected web3 instance is detected, fall back to Truffel/Ganache
      // V.debug( 'no injected web3 instance' );
      // provider = new Web3.providers.HttpProvider( 'http://localhost:9545' );
      provider = new Web3.providers.HttpProvider(  V.getApiKey( 'rpc' ) );
      V.setState( 'browserWallet', false );
      // return {
      //   success: false,
      //   status: 'web3 provider not found',
      // };
    }

    window.Web3Obj = new Web3( provider );
    contract = new window.Web3Obj.eth.Contract( VEvmAbi, V.getTokenContract().contractAddress );

    const state = V.getSetting( 'queryContractState' ) ? await V.getContractState() : {};

    if ( state.success ) {
      // V.setState( 'contract', state.data ? state.data[0] : {} );
      return {
        success: true,
        status: 'provider set',
      };
    }
    else {
      return {
        success: false,
        status: 'could not set provider',
      };
    }

  }

  async function setConnectedAddress() {

    if ( window.ethereum ) {
      if ( window.ethereum.request ) {
        // Request account access using new MetaMask API
        try {
          await window.ethereum.request( {
            method: 'eth_requestAccounts',
          } ).then( ( accounts ) => {
            setNewConnectedAddress( accounts );
          } );
        }
        catch ( error ) {
          // User denied account access...
          console.log( error );

          return {
            success: false,
            status: 'user denied auth',
          };
        }
      }
      else if ( window.Web3Obj ) {
        // Backwards compatibility: Request account access using Web3Obj
        const accounts = await window.Web3Obj.eth.getAccounts();
        setNewConnectedAddress( accounts );
      }
    }

    if ( window.Web3Obj ) {
      setEventSubscription( 'TransferSummary' );
      return {
        success: true,
        status: 'address set',
      };
    }
    else {
      return {
        success: false,
        status: 'Web3Obj not available',
      };
    }

  }

  async function getContractState() {
    if ( contract ) {

      // kovan2
      // const blockNumber = contract.methods.getBlockNumber().call();
      // const fee = contract.methods.transactionFee.call().call();
      // const contribution = contract.methods.communityContribution.call().call();
      // const divisibility = contract.methods.decimals.call().call();

      // ganache remote
      const blockNumber = contract.methods.getBlockNumber().call();
      const payout = contract.methods.getGenerationAmount.call().call();
      const interval = contract.methods.getGenerationPeriod.call().call();
      const lifetime = contract.methods.getLifetime.call().call();
      const fee = contract.methods.getTransactionFee.call().call();
      const contribution = contract.methods.getCommunityContribution.call().call();
      const divisibility = 18; // now fixed to 18, instead of contract.methods.decimals.call().call();

      // const allEvents = contract.getPastEvents( 'allEvents', {
      // // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'},
      //   fromBlock: 0,
      //   toBlock: 'latest'
      // }, ( error ) => {return error ? console.error( error ) : null} )
      //   .then( res => {
      //     return res.map( item => {
      //       return {
      //         b: item.blockNumber,
      //         e: item.event,
      //         val: item.returnValues.value/( 10**6 ),
      //         to: item.returnValues.to,
      //         from: item.returnValues.from,
      //         all: item
      //       };
      //     } ).reverse();
      //   } );

      const all = await Promise.all( [
        blockNumber,
        fee,
        contribution,
        // divisibility,
        // payout,
        // interval,
        // lifetime,
        // allEvents,
      ] )
        .catch( err => { console.log( err ) } );

      if ( all && all[0] ) {

        console.log( '*** CONTRACT STATE ***' );
        console.log( 'Contract: ', contract._address );
        console.log( 'Current Block: ', all[0] );
        // console.log( 'Payout: ', all[4] / 10**18 );
        // console.log( 'Interval: ', all[5] );
        // console.log( 'Lifetime: ', all[6] );
        // console.log( 'Fee: ', ( all[1] / 100 ).toFixed( 2 ) );
        // console.log( 'Contribution: ', ( all[2] / 100 ).toFixed( 2 ) );
        // console.log( 'Divisibility: ', all[3] );
        // console.log( 'All Events:', all[4] );
        console.log( '*** CONTRACT STATE END ***' );

        const data = {
          currentBlock: Number( all[0] ),
          fee: all[1],
          contribution: all[2],
          divisibility: all[3],
          contract: contract._address,
          network: V.getTokenContract(),
          // allEvents: all[4],
        };

        V.setState( 'contract', data );

        return {
          success: true,
          status: 'contract state retrieved',
          data: [ data ],
        };
      }
      else {

        console.warn( 'Could not get contract state' );

        return {
          success: false,
          status: 'contract state not retrieved',
          message: all,
        };
      }
    }
    else {
      return {
        success: false,
        status: 'contract state not retrieved',
      };
    }
  }

  async function getAddressState( which ) {

    const all = await Promise.all( [
      window.Web3Obj.eth.getBalance( which ),
      contract.methods.liveBalanceOf( which ).call(),
      contract.methods.getDetails( which ).call(),
      contract.methods.getBlockNumber().call(),
      contract.methods.accountApproved( which ).call(),
    ] ).catch( err => {
      console.warn( 'Could not get address state' );
      return err;
    } );

    if ( all && all[0] && all[1] && all[2] && all[3] ) {
      const data = {
        coinBalance: castEthBalance( all[0] ),
        liveBalance: castTokenBalance( all[1] ),
        tokenBalance: castTokenBalance( all[2]._balance ),
        lastBlock: all[2]._lastBlock,
        zeroBlock: all[2]._zeroBlock,
        currentBlock: all[3],
        isVerified: all[4],
      };

      return {
        success: true,
        status: 'address state retrieved',
        ledger: 'EVM',
        data: [data],
      };
    }
    else {
      return {
        success: false,
        status: 'could not retrieve address state',
        message: all,
        ledger: 'EVM',
      };
    }

  }

  async function getAddressHistory( data,
    // which = V.cA() || V.aE().evmCredentials.address,
    // data = { fromBlock: 0, toBlock: 'latest' },
    // whichEvent = 'TransferSummary'
  ) {

    const transfers = await contract.getPastEvents( 'TransferSummary', {
      // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'},
      fromBlock: data.fromBlock,
      toBlock: data.toBlock,
    }, ( error ) => {
      error ? console.error( error ) : null;
    } )
      .then( ( events ) => events );

    if ( !transfers.length ) {
      return {
        success: false,
        status: 'no transfers',
        ledger: 'EVM',
      };
    }

    const filteredAndEnhanced = await castTransfers( transfers, data.address );

    return {
      success: true,
      status: 'transactions retrieved',
      ledger: 'EVM',
      data: filteredAndEnhanced,
    };

  }

  function setAddressVerification( which ) {
    console.log( 'verify:', which );
    return contract.methods.verifyAccount( which ).send( { from: V.cA(), gas: 6001000 } )
      .on( 'transactionHash', ( hash ) => {
        console.log( 'Hash: ', hash );
        // contract.methods.accountApproved( ethAddress ).call( ( err, result ) => {
        //   console.log( 'accountApproved result (confirm):', result, ' error: ', err );
        // } );
      } )
      .on( 'error', function( error ) { console.log( 'Error: ' + error ) } )
      .then( function( receipt ) {
        console.log( 'Success: ' + JSON.stringify( receipt ) );

        return {
          success: true,
          status: 'account verified',
        };

      } );
  }

  function setCoinTransaction( data ) {

    const txObject = {
      from: data.initiatorAddress,
      to: data.recipientAddress,
      value: window.Web3Obj.utils.toWei( data.txTotal.toString(), 'ether' ),
      // "gas": 21000,         (optional)
      // "gasPrice": 4500000,  (optional)
      // "data": 'For testing' (optional)
      // "nonce": 10           (optional)
    };

    return window.Web3Obj.eth.sendTransaction( txObject )
      .once( 'transactionHash', function( hash ) {
        console.log( 'Hash: ' + hash );
        Modal.draw( 'transaction sent' );
      } )
      .once( 'receipt', function( receipt ) { console.log( 'Receipt A: ' + JSON.stringify( receipt ) ) } )
      .on( 'confirmation', function( confNumber, receipt ) {
        console.log( 'Confirmation Number: ' + JSON.stringify( confNumber ) );
        console.log( 'Receipt B: ' + JSON.stringify( receipt ) );
      } )
      .on( 'error', function( error ) { console.log( 'Error: ' + error ) } )
      .then( function( receipt ) {
        console.log( 'Success: ' + JSON.stringify( receipt ) );

        return {
          success: true,
          status: 'last eth transaction successful',
          data: [ receipt ],

        };

      } );

  }

  async function setTokenTransaction( data ) {
    // const div = Number( V.getState( 'contract' ).divisibility );
    const recipient = window.Web3Obj.utils.toChecksumAddress( data.recipientAddress );
    const sender = data.initiatorAddress;
    const amount = window.Web3Obj.utils.toWei( String( data.txTotal /* * 10**div */ ) );
    const txFunction = await new Promise( ( resolve, reject ) => contract.methods.transfer( recipient, amount ).send( { from: sender } )
      .once( 'transactionHash', function( hash ) {
        console.log( 'Transaction Hash: ' + hash );
        V.drawHashConfirmation( hash );
      } )
    // .once( 'receipt', function( receipt ) { console.log( 'Receipt A: ' + JSON.stringify( receipt ) ) } )
    // .on( 'confirmation', function( confNumber, receipt ) {
    //   console.log( 'Confirmation Number: ' + JSON.stringify( confNumber ) );
    //   console.log( 'Receipt B: ' + JSON.stringify( receipt ) );
    // } )
      .on( 'error', function( error ) {
        console.log( 'Transaction Error: ' + JSON.stringify( error ) );

        reject( {
          success: false,
          status: error.code,
          message: error.message,
          data: [],
        } );

      } )
      .then( function( receipt ) {
        console.log( 'Transaction Success' /* + JSON.stringify( receipt ) */ );
        resolve( {
          success: true,
          status: 'last token transaction successful',
          data: [ receipt ],
        } );

      } ) );

    return txFunction;
  }

  function getNetVAmount( amount ) {
    const fee = V.getSetting( 'transactionFee' );
    const contr = V.getSetting( 'communityContribution' );
    const contractState = V.getState( 'contract' ) || { fee: fee, contribution: contr };
    const totalFee = Math.floor( amount * ( contractState.fee / 100**2 ) );
    const contribution = Math.round( ( totalFee * ( Number( contractState.contribution ) / 100**2 ) ) * 100 ) / 100;
    const feeAmount = totalFee - contribution;
    const net = amount - totalFee;

    return  {
      net: net,
      gross: amount,
      contribution: contribution,
      feeAmount: feeAmount,
    };
  }

  function getGrossVAmount( amount ) {
    const fee = V.getSetting( 'transactionFee' );
    const contr = V.getSetting( 'communityContribution' );
    const contractState = V.getState( 'contract' ) || { fee: fee, contribution: contr };

    /**
     * 33.33% and 25% are two possible and likely choices for a transaction fee
     * in the smart contract.
     * In order to avoid rounding issues, these are specifically setup here
     *
     */

    const totalFee = contractState.fee == 3333
      ? amount * 0.5
      : contractState.fee == 2500
        ? Math.round( amount * 0.33333333 * 100 ) / 100
        : Math.round( ( amount / ( 1 - ( ( Number( contractState.fee ) + 1 ) / 100**2 ) ) - amount ) * 100 ) / 100;

    const contribution = Math.round( ( totalFee * ( Number( contractState.contribution ) / 100**2 ) ) * 100 ) / 100;
    const feeAmount = Math.round( ( totalFee - contribution ) * 100 ) / 100;
    const gross = Math.round( ( amount + feeAmount + contribution ) * 100 ) / 100;

    const data = {
      net: amount,
      gross: gross,
      contribution: contribution,
      feeAmount: feeAmount,
    };

    return data;
  }

  async function castTransfers( transfers, which ) {

    const filteredAndEnhanced = await transfers.filter( tx => {
      const data = tx.returnValues;
      return data.from.toLowerCase() == which
              || data.to.toLowerCase() == which;

    } ).map( async tx => {
      const txData = {};
      // console.log( tx );
      txData.fromAddress = tx.returnValues.from.toLowerCase();
      txData.toAddress = tx.returnValues.to.toLowerCase();

      txData.fromAddress == which ? txData.txType = 'out' : null;
      txData.toAddress == which ? txData.txType = 'in' : null;
      txData.toAddress == burnAddress ? txData.txType = 'fee' : null;
      txData.fromAddress == burnAddress ? txData.txType = 'generated' : null;

      txData.amount = castTokenBalance( tx.returnValues.value );

      txData.feeAmount = castTokenBalance( tx.returnValues.feesBurned || 0, 2 );
      txData.contribution = castTokenBalance( tx.returnValues.contribution || 0, 2 );

      txData.payout = txData.fromAddress == which
        ? castTokenBalance( tx.returnValues.payoutSender || 0 )
        : castTokenBalance( tx.returnValues.payoutRecipient || 0 );

      txData.message = 'n/a';

      txData.hash = tx.transactionHash;
      txData.logIndex = tx.logIndex;
      txData.block = tx.blockNumber;

      const blockDetails = await window.Web3Obj.eth.getBlock( txData.block );
      txData.blockDate = blockDetails.timestamp;

      await addEntityData( txData, 'from' );
      await addEntityData( txData, 'to' );

      txData.fromAddress == contract._address.toLowerCase() ? txData.fromEntity = V.getString( ui.community ) : null;

      if ( txData.txType == 'in' ) {
        txData.title = txData.fromEntity;
      }
      else if ( txData.txType == 'out' ) {
        txData.title = txData.toEntity;
      }
      else if ( txData.txType == 'fee' ) {
        txData.title = V.getString( ui.fee );
      }
      else if ( txData.txType == 'generated' ) {
        txData.title = V.getString( ui.community );
      }

      return txData;

    } );

    const a = await Promise.all( filteredAndEnhanced );
    // console.log( a );
    return a;
  }

  async function addEntityData( txData, which ) {
    if (
      V.aE()
      && V.aE().evmCredentials.address == txData[which + 'Address']
    ) {
      txData[which + 'Entity'] = V.aE().fullId;
      txData[which + 'UuidE'] = V.aE().uuidE;
    }
    else {
      const entity = await V.getEntity( txData[which + 'Address'] );
      if ( entity.success ) {
        txData[which + 'Entity'] = entity.data[0].fullId;
        txData[which + 'UuidE'] = entity.data[0].uuidE;
      }
      else {
        txData[which + 'Entity'] = V.castShortAddress( txData[which + 'Address'] );
        txData[which + 'UuidE'] = V.getString( ui.unknown );
      }
    }
  }

  // previous versions

  // function getNetVAmount( amount ) {
  //   const fee = V.getSetting( 'transactionFee' );
  //   const contr = V.getSetting( 'communityContribution' );
  //   const contractState = V.getState( 'contract' ) || { fee: fee, contribution: contr };
  //   const totalFee = Math.floor( amount * ( contractState.fee / 100**2 ) );
  //   const contribution = totalFee == 0 ? 1 : Math.ceil( totalFee * ( Number( contractState.contribution ) / 100**2 ) );
  //   const feeAmount = totalFee == 0 ? 0 : totalFee - contribution;
  //   const net = amount - totalFee;
  //
  //   return  {
  //     net: net,
  //     gross: amount,
  //     contribution: contribution,
  //     feeAmount: feeAmount
  //   };
  // }

  // function getGrossVAmount( amount ) {
  //   const fee = V.getSetting( 'transactionFee' );
  //   const contr = V.getSetting( 'communityContribution' );
  //   const contractState = V.getState( 'contract' ) || { fee: fee, contribution: contr };
  //   const totalFee = Math.floor( amount / ( 1 - ( ( Number( contractState.fee ) + 1 ) / 100**2 ) ) - amount );
  //   const contribution = totalFee == 0 ? 1 : Math.ceil( totalFee * ( Number( contractState.contribution ) / 100**2 ) );
  //   const feeAmount = totalFee == 0 ? 0 : totalFee - contribution;
  //   const gross = amount + feeAmount + contribution;
  //
  //   return  {
  //     net: amount,
  //     gross: gross,
  //     contribution: contribution,
  //     feeAmount: feeAmount
  //   };
  // }

  /* ====================== export  ===================== */

  V.getWeb3Provider = getWeb3Provider;
  V.setConnectedAddress = setConnectedAddress;
  V.getContractState = getContractState;
  V.getAddressState = getAddressState;
  V.getAddressHistory = getAddressHistory;
  V.setAddressVerification = setAddressVerification;
  V.setCoinTransaction = setCoinTransaction;
  V.setTokenTransaction = setTokenTransaction;
  V.getNetVAmount = getNetVAmount;
  V.getGrossVAmount = getGrossVAmount;
  V.castTransfers = castTransfers;

  return {
    getWeb3Provider: getWeb3Provider,
    setConnectedAddress: setConnectedAddress,
    getContractState: getContractState,
    getAddressState: getAddressState,
    getAddressHistory: getAddressHistory,
    setAddressVerification: setAddressVerification,
    setCoinTransaction: setCoinTransaction,
    setTokenTransaction: setTokenTransaction,
    getNetVAmount: getNetVAmount,
    getGrossVAmount: getGrossVAmount,
    castTransfers: castTransfers,
  };

} )();
