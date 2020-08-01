const VLedger = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to route ledger/database queries
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function launchScripts() {

    V.getData = getData;
    V.setData = setData;

    if ( V.getSetting( 'transactionLedger' ) == 'EVM' ) {
      if ( V.getSetting( 'useBuilds' ) ) {
        await Promise.all( [
          V.setScript( '/vcore/builds/vevm.min.js' )
        ] );
        console.log( '*** vevm builds loaded ***' );
      }
      else {
        await Promise.all( [
          V.setScript( '/vcore/dependencies/secondary/web3.min.js' ),
          V.setScript( '/vcore/src/ledger/secondary/v-evm-abi.js' ),
          V.setScript( '/vcore/src/ledger/secondary/v-evm.js' )
        ] );
        console.log( '*** vcore source web3 and evm scripts loaded ***' );
      }

      await V.getWeb3Provider();

    }

    if ( V.getSetting( 'transactionLedger' ) == 'EOS' ) {
      await Promise.all( [
        V.setScript( '/vcore/dependencies/eosjs-api.js' ),
        V.setScript( '/vcore/dependencies/eosjs-jsonrpc.js' ),
        V.setScript( '/vcore/dependencies/eosjs-jssig.js' ),
        V.setScript( '/vcore/dependencies/eosjs-numeric.js' )
      ] );

      console.log( '*** eos scripts loaded ***' );
    }

    if ( V.getSetting( 'transactionLedger' ) == 'Symbol' ) {
      await V.setScript( '/vcore/dependencies/symbol-sdk-0.17.5-alpha.js' );
      await V.setScript( '/vcore/src/ledger/v-symbol.js' );
      console.log( '*** symbol scripts loaded ***' );
    }

    if ( V.getSetting( 'entityLedger' ) == '3Box' ) {
      await Promise.all( [
        V.setScript( '/vcore/dependencies/3box.min.js' ),
        V.setScript( '/vcore/src/ledger/v-3box.js' )
      ] );
      console.log( '*** 3Box scripts loaded ***' );
    }

    if ( [ V.getSetting( 'entityLedger' ), V.getSetting( 'chatLedger' ) ].includes( 'MongoDB' ) ) {
      await Promise.all( [
        V.setScript( '/vcore/dependencies/secondary/socket.io.min.js' ),
      ] );
      console.log( '*** vcore source socket scripts loaded ***' );
      await setSocket().then( res => {
        console.log( res );
      } );
    }

  }

  async function setSocket() {
    return new Promise( ( resolve, reject ) => {
      const host = V.getSetting( 'socketHost' );
      const port = V.getSetting( 'socketPort' );

      const connection = host + ( port ? ':' + port : '' );

      const socketSettings = {
        // transports: ['websocket'],
        secure: true
      };

      window.socket = io.connect( connection, socketSettings );

      window.socket.on( 'connect', () => {
        resolve( socket.id + ' connected' );
      } );

      window.socket.on( 'connect_error', ( error ) => {
        // V.debug( error );
        reject( 'could not connect socket' );
      } );

    } );
  }

  function http( which, data ) {

    const options = data
      ? {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( data ),
      }
      : { method: 'GET' };

    return fetch( which, options )
      .then( ( response ) => {
        return response.json();
      } )
      .then( ( data ) => {
        return {
          success: true,
          status: 'fetch success',
          data: [ data ] };
      } )
      .catch( ( error ) => {
        return {
          success: false,
          status: 'fetch error',
          message: error
        };
      } );
  }

  /* ============ public methods and exports ============ */

  function setData( data, whichEndpoint, whichLedger ) {

    if ( whichLedger == 'MongoDB' ) {
      return new Promise( resolve => {
        // MongoDB requires 'data' and 'whichEndpoint' switched
        socket.emit( 'set ' + whichEndpoint, data, function( res ) {
          resolve( res );
        } );
      } );
    }
    else if ( whichLedger == 'EVM' ) {
      if ( whichEndpoint == 'transaction' ) {
        if ( data.currency == 'ETH' ) {
          return V.setCoinTransaction( data );
        }
        else if ( data.currency == 'V' ) {
          return V.setTokenTransaction( data );
        }
      }
      else if ( whichEndpoint == 'verification' ) {
        return V.setAddressVerification( data );
      }
    }
    else if ( whichLedger == 'Symbol' ) {
      if ( whichEndpoint == 'transaction' ) {
        return V.setMosaicTransaction( data );
      }
    }
    else if ( whichLedger == 'EOS' ) {
      if ( whichEndpoint == 'transaction' ) {
        return V.setEOSTransaction( data );
      }
    }
    else if ( whichLedger == '3Box' ) {
      if ( whichEndpoint == 'entity' ) {
        return V.set3BoxSpace( whichEndpoint, data );
      }
      else if ( whichEndpoint == 'verification' ) {
        // todo
      }
    }
  }

  function getData( data, whichEndpoint, whichLedger ) {
    if ( whichLedger == 'MongoDB' ) {
      return new Promise( resolve => {
        // MongoDB requires 'data' and 'whichEndpoint' switched
        socket.emit( 'get ' + whichEndpoint, data, function( res ) {
          resolve( res );
        } );
      } );
    }
    else if ( whichLedger == 'EVM' ) {
      if ( whichEndpoint == 'transaction' ) {
        return V.getAddressHistory();
      }
    }
    else if ( whichLedger == 'Symbol' ) {
      if ( whichEndpoint == 'transaction' ) {
        return V.getAddressHistory();
      }
    }
    else if ( whichLedger == 'EOS' ) {
      if ( whichEndpoint == 'transaction' ) {
        return V.getAddressHistory();
      }
    }
    else if ( whichLedger == '3Box' ) {
      return V.get3BoxSpace( data ).then( res => {
        return res;
      } );
    }
    else if ( whichLedger == 'http' ) {
      return http( data );
    }
  }

  async function launch() {

    return launchScripts();

  }

  return {
    launch: launch,
    getData: getData,
    setData: setData
  };

} )();
