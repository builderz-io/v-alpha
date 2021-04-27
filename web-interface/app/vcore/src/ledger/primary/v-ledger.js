const VLedger = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to route ledger/database queries
   *
   */

  'use strict';

  const host = V.getSetting( 'sourceEndpoint' );

  /* ================== private methods ================= */

  async function launchScripts() {

    if ( V.getSetting( 'transactionLedger' ) == 'EVM' ) {
      if ( V.getSetting( 'useBuilds' ) ) {
        await Promise.all( [
          V.setScript( host + '/vcore/builds/vevm.min.js' ),
        ] )
          .then( () => console.log( 'Success loading evm build' ) )
          .catch( () => console.error( 'Error loading evm build' ) );
      }
      else {
        await Promise.all( [
          V.setScript( host + '/vcore/dependencies/secondary/web3.min.js' ),
          V.setScript( host + '/vcore/src/ledger/secondary/v-evm-abi.js' ),
          V.setScript( host + '/vcore/src/ledger/secondary/v-evm.js' ),
        ] )
          .then( () => console.log( 'Success loading web3.js and evm source files' ) )
          .catch( () => console.error( 'Error loading web3.js and evm source files' ) );
      }

      await V.getWeb3Provider();

    }
    else if ( V.getSetting( 'transactionLedger' ) == 'EOS' ) {
      await Promise.all( [
        V.setScript( host + '/vcore/dependencies/eosjs-api.js' ),
        V.setScript( host + '/vcore/dependencies/eosjs-jsonrpc.js' ),
        V.setScript( host + '/vcore/dependencies/eosjs-jssig.js' ),
        V.setScript( host + '/vcore/dependencies/eosjs-numeric.js' ),
      ] );
      console.log( '*** eos scripts loaded ***' );
    }
    else if ( V.getSetting( 'transactionLedger' ) == 'Symbol' ) {
      await V.setScript( host + '/vcore/dependencies/symbol-sdk-0.17.5-alpha.js' );
      await V.setScript( host + '/vcore/src/ledger/v-symbol.js' );
      console.log( '*** symbol scripts loaded ***' );
    }

    if ( V.getSetting( 'entityLedger' ) == 'Firebase' ) {
      if ( !V.getSetting( 'useBuilds' ) ) {
        await Promise.all( [
          V.setScript( host + '/vcore/src/ledger/primary/v-firebase.js' ),
        ] )
          .then( () => console.log( 'Success loading v-firebase.js' ) )
          .catch( () => console.error( 'Error loading v-firebase.js' ) );
      }
    }
    else if ( V.getSetting( 'entityLedger' ) == '3Box' ) {
      await Promise.all( [
        V.setScript( host + '/vcore/dependencies/3box.min.js' ),
        V.setScript( host + '/vcore/src/ledger/v-3box.js' ),
      ] );
      console.log( '*** 3Box scripts loaded ***' );
    }

    if ( V.getSetting( 'chatLedger' ) == 'Firebase' ) {
      if ( V.getSetting( 'useBuilds' ) ) {
        await Promise.all( [
          V.setScript( host + '/vcore/builds/vchat.min.js' ),
        ] )
          .then( () => console.log( 'Success loading chat build' ) )
          .catch( () => console.error( 'Error loading chat build' ) );
      }
      else {
        await Promise.all( [
          V.setScript( host + '/vcore/dependencies/secondary/firebase-app.js' ),
          V.setScript( host + '/vcore/dependencies/secondary/firebase-database.js' ),
        ] )
          .then( () => console.log( 'Success loading firebase chat' ) )
          .catch( () => console.error( 'Error loading firebase chat' ) );
        await V.setScript( host + '/vcore/dependencies/secondary/firebase-chat-init.js' )
          .then( () => console.log( 'Success initializing firebase chat' ) )
          .catch( () => console.error( 'Error initializing firebase chat' ) );
      }
    }

    if ( [ V.getSetting( 'entityLedger' ), V.getSetting( 'chatLedger' ) ].includes( 'MongoDB' ) ) {
      await Promise.all( [
        V.setScript( host + '/vcore/src/ledger/secondary/v-mongodb.js' ),
        V.setScript( host + '/vcore/dependencies/secondary/socket.io.min.js' ),
      ] );
      console.log( '*** MongoDB and socket.io scripts loaded ***' );
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
        secure: true,
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
          'Accept': 'application/json',
        },
        body: JSON.stringify( data ),
      }
      : { method: 'GET' };

    return fetch( which, options )
      .then( ( response ) => response.json() )
      .then( ( data ) => ( {
        success: true,
        status: 'fetch success',
        data: [ data ] } ) )
      .catch( ( error ) => ( {
        success: false,
        status: 'fetch error',
        message: error,
      } ) );
  }

  /* ============ public methods and exports ============ */

  function setData( data, whichEndpoint, whichLedger ) {

    if ( whichLedger == 'MongoDB' ) {
      return V.setMongoDB( data, whichEndpoint );
    }
    else if ( whichLedger == 'Firebase' ) {
      return V.setFirebase( data, whichEndpoint );
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
      return V.getMongoDB( data, whichEndpoint );
    }
    else if ( whichLedger == 'Firebase' ) {
      return V.getFirebase( data, whichEndpoint );
    }
    else if ( whichLedger == 'EVM' ) {
      if ( whichEndpoint == 'transaction' ) {
        return V.getAddressHistory( data );
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
      return V.get3BoxSpace( data ).then( res => res );
    }
    else if ( whichLedger == 'http' ) {
      return http( data );
    }
  }

  async function launch() {

    return launchScripts();

  }

  /* ====================== export ====================== */

  V.getData = getData;
  V.setData = setData;

  return {
    launch: launch,
    getData: getData,
    setData: setData,
  };

} )();
