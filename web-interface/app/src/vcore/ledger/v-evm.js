const VEvm = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to access EVM-compatible ledgers
   *
   */

  'use strict';

  let contract;

  /* ================== private methods ================= */

  function castEthBalance( balance ) {
    return Number( balance / 10**18 ).toFixed( 1 );
  }

  function castTokenBalance( balance ) {
    const divisibility = V.getSetting( 'tokenDivisibility' );
    return Number( balance / 10**( divisibility ) ).toFixed( 0 ); // TODO: get decimals from contract
  }

  async function getWeb3Provider() {

    let provider;

    // Modern dapp browsers...
    if ( window.ethereum ) {
      // console.log( 'ethereum is there' );
      provider = window.ethereum;

      try {
      // Request account access
        await window.ethereum.enable();

        return {
          success: true,
          status: 'provider set',
          data: [ provider ]
        };

      }
      catch ( error ) {
      // User denied account access...
        return {
          success: false,
          status: 'user denied auth',
        };
      }
    }
    // Legacy dapp browsers...
    else if ( window.web3 ) {
      // console.log( 'web3 is there' );
      provider = window.web3.currentProvider;

      return {
        success: true,
        status: 'legacy provider set',
        data: [ provider ]
      };
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      //  console.log( 'local network is there' );
      //  provider = new Web3.providers.HttpProvider( 'http://localhost:9545' );
      return {
        success: false,
        status: 'web3 provider not found',
      };
    }

  }

  /* ================== public methods  ================= */

  function setActiveAddress() {

    if ( window.ethereum && !window.ethereum.selectedAddress ) {
      Join.draw( 'wallet locked' );
    }

    return getWeb3Provider().then( res => {

      if ( res.success ) {

        window.Web3Obj = new Web3( res.data[0] );
        contract = new window.Web3Obj.eth.Contract( VEvmAbi, V.getNetwork( V.getNetwork( 'choice' ) )['contractAddress'] );

        const activeAddress = window.Web3Obj.currentProvider.publicConfigStore._state.selectedAddress;
        V.setState( 'activeAddress', activeAddress ? activeAddress.toLowerCase() : false );

        window.Web3Obj.currentProvider.publicConfigStore.on( 'update', function setNewActiveAddress() {

          var currentActiveAddress = window.Web3Obj.currentProvider.publicConfigStore._state.selectedAddress;
          // console.log( currentActiveAddress );
          // console.log( V.getState( 'activeAddress' ) );
          V.setState( 'activeEntity', false );

          if ( currentActiveAddress == null ) {
            V.setState( 'activeAddress', false );
            Join.draw( 'logged out' );
          }
          else if ( currentActiveAddress != V.getState( 'activeAddress' ) ) {
            V.setState( 'activeAddress', currentActiveAddress.toLowerCase() );
            Join.draw( 'new entity was set up' );
          }

        } );

        return {
          success: true,
          status: 'address set',
        };
      }
      else {
        return res;
      }
    } );
  }

  async function getContractState() {
    if ( contract ) {

      const blockNumber = contract.methods.getBlockNumber().call();
      const fee = contract.methods.transactionFee.call().call();
      const contribution = contract.methods.communityContribution.call().call();
      const divisibility = contract.methods.decimals.call().call();

      const allEvents = contract.getPastEvents( 'allEvents', {
      // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'},
        fromBlock: 0,
        toBlock: 'latest'
      }, ( error ) => {return error ? console.error( error ) : null} )
        .then( res => {
          return res.map( item => {
            return {
              b: item.blockNumber,
              e: item.event,
              val: item.returnValues.value/( 10**6 ),
              to: item.returnValues.to,
              from: item.returnValues.from,
              all: item
            };
          } ).reverse();
        } );

      const all = await Promise.all( [ blockNumber, fee, contribution, divisibility, allEvents ] );

      if ( all[0] ) {

        console.log( '*** CONTRACT STATUS ***' );
        console.log( 'Current Block: ', all[0] );
        console.log( 'Fee: ', ( all[1] / 100 ).toFixed( 2 ) );
        console.log( 'Contribution: ', ( all[2] / 100 ).toFixed( 2 ) );
        console.log( 'Divisibility: ', all[3] );
        console.log( 'Contract: ', contract._address );
        console.log( 'All Events:', all[4] );
        console.log( '*** CONTRACT STATUS END ***' );

        const data = {
          currentBlock: Number( all[0] ),
          fee: all[1],
          contribution: all[2],
          divisibility: all[3],
          contract: contract._address,
          allEvents: all[4],
        };

        V.setState( 'contract', data );

        return {
          success: true,
          status: 'contract state retrieved',
          data: [ data ]
        };
      }
      else {

        console.log( '*** CONTRACT STATUS ***' );
        console.log( 'Could not get contract status' );
        console.log( '*** CONTRACT STATUS END ***' );

        return {
          success: false,
          status: 'contract state not retrieved',
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
      contract.methods.getDetails( which ).call()
    ] );

    if ( all[0] && all[1] && all[2] ) {
      return {
        success: true,
        status: 'address state retrieved',
        ledger: 'EVM',
        data: [{
          coinBalance: castEthBalance( all[0] ),
          liveBalance: castTokenBalance( all[1] ),
          tokenBalance: castTokenBalance( all[2]._balance ),
          lastBlock: all[2]._lastBlock,
          zeroBlock: all[2]._zeroBlock,
        }]
      };
    }
    else {
      return {
        success: false,
        status: 'could not retrieve address state',
        ledger: 'EVM'
      };
    }

  }

  async function getAddressHistory(
    which = V.getState( 'activeAddress' ),
    data = { fromBlock: 0, toBlock: 'latest' }
  ) {

    const burnA = '0x0000000000000000000000000000000000000000';

    const transfers = await contract.getPastEvents( 'Transfer', {
      // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'},
      fromBlock: data.fromBlock,
      toBlock: data.toBlock
    }, ( error ) => {
      error ? console.error( error ) : null;
    } )
      .then( ( events ) => {
        return events;
      } );

    if ( !transfers.length ) {
      return {
        success: false,
        status: 'no transfers',
        ledger: 'EVM',
      };
    }

    const filteredTransfers = transfers.filter( tx => {
      const data = tx.returnValues;
      return data.from.toLowerCase() == which ||
                data.to.toLowerCase() == which;

    } ).map( tx => {
      const txData = {};

      txData.amount = ( tx.returnValues.value / 10**6 ).toFixed( 0 );

      txData.fromAddress = tx.returnValues.from.toLowerCase();
      txData.toAddress = tx.returnValues.to.toLowerCase();

      txData.fromAddress == which ? txData.txType = 'out' : null;
      txData.toAddress == which ? txData.txType = 'in' : null;
      txData.toAddress == burnA ? txData.txType = 'fee' : null;
      txData.fromAddress == burnA ? txData.txType = 'generated' : null;

      txData.block = tx.blockNumber;
      txData.logIndex = tx.logIndex;
      txData.hash = tx.transactionHash;

      txData.message = 'n/a';

      return txData;

    } );

    return {
      success: true,
      status: 'transactions retrieved',
      ledger: 'EVM',
      data: [ filteredTransfers ]
    };

  }

  function setAddressVerification( which ) {
    console.log( 'verify:', which );
    return contract.methods.verifyAccount( which ).send( { from: V.getState( 'activeAddress' ), gas: 6001000 } )
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
      .once( 'transactionHash', function( hash ) { console.log( 'Hash: ' + hash ) } )
      .once( 'receipt', function( receipt ) { console.log( 'Receipt A: ' + JSON.stringify( receipt ) ) } )
      .on( 'confirmation', function( confNumber, receipt ) {
        console.log( 'Confirmation Number: ' + JSON.stringify( confNumber ) );
        console.log( 'Receipt B: ' + JSON.stringify( receipt ) );
      } )
      .on( 'error', function( error ) { console.log( 'Error: ' + error ) } )
      .then( function( receipt ) {
        console.log( 'Success: ' + JSON.stringify( receipt ) );
        Account.drawHeaderBalance();

        return {
          success: true,
          status: 'last eth transaction successful',
        };

      } );

  }

  async function setTokenTransaction( data ) {
    const recipient = window.Web3Obj.utils.toChecksumAddress( data.recipientAddress );
    const sender = data.initiatorAddress;
    const amount = data.txTotal * 10**6;
    const txFunction = await new Promise( ( resolve, reject ) => {
      return contract.methods.transfer( recipient, amount ).send( { from: sender } )
        .once( 'transactionHash', function( hash ) { console.log( 'Hash: ' + hash ) } )
      // .once( 'receipt', function( receipt ) { console.log( 'Receipt A: ' + JSON.stringify( receipt ) ) } )
      // .on( 'confirmation', function( confNumber, receipt ) {
        //   console.log( 'Confirmation Number: ' + JSON.stringify( confNumber ) );
        //   console.log( 'Receipt B: ' + JSON.stringify( receipt ) );
        // } )
        .on( 'error', function( error ) {
          console.log( 'Error: ' + JSON.stringify( error ) );

          reject( {
            success: false,
            status: error.code,
            message: error.message,
            data: []
          } );

        } )
        .then( function( receipt ) {
          console.log( 'Success: ' + JSON.stringify( receipt ) );

          resolve( {
            success: true,
            status: 'last token transaction successful',
            data: [ receipt ]
          } );

        } );
    } );

    return txFunction;
  }

  /* ====================== export  ===================== */

  ( () => {
    V.setActiveAddress = setActiveAddress;
    V.getContractState = getContractState;
    V.getAddressState = getAddressState;
    V.getAddressHistory = getAddressHistory;
    V.setAddressVerification = setAddressVerification;
    V.setCoinTransaction = setCoinTransaction;
    V.setTokenTransaction = setTokenTransaction;
  } )();

  return {
    setActiveAddress: setActiveAddress,
    getContractState: getContractState,
    getAddressState: getAddressState,
    getAddressHistory: getAddressHistory,
    setAddressVerification: setAddressVerification,
    setCoinTransaction: setCoinTransaction,
    setTokenTransaction: setTokenTransaction,
  };

} )();
