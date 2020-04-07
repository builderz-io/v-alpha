const VLedger = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module for the app whichLedger / database connections
  *
  */

  'use strict';

  /* ================== private methods ================= */

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
        return data;
      } )
      .catch( ( error ) => {
        return { status: 'error', message: error };
      } );
  }

  /* ============ public methods and exports ============ */

  function launch() {
    if ( V.getSetting( 'socketUse' ) ) {
      V.sN( 'head', {
        t: 'script',
        a: {
          src: 'dist/socket.io.min.js',
          onload: 'VLedger.setSocket()'
        }
      } );
    }
    if ( V.getSetting( 'web3Use' ) ) {
      V.sN( 'head', {
        t: 'script',
        a: {
          src: 'dist/web3.min.js'
        }
      } );
    }
  }

  function setSocket() {

    const host = V.getSetting( 'socketHost' );
    const port = V.getSetting( 'socketPort' );

    const connection = host + ( port ? ':' + port : '' );

    const socketSettings = {
      // transports: ['websocket'],
      secure: true
    };

    window.socket = io.connect( connection, socketSettings );

    socket.on( 'connect', () => {
      // V.debug( socket.id );
      console.log( socket.id, 'connected' );
    } );

    socket.on( 'connect_error', ( error ) => {
      V.debug( error );
    } );
  }

  function setData( data, options, whichLedger ) {

    if ( whichLedger == 'MongoDB' ) {

      /**
       * @notice setData == getData in this case
       */

      return getData( data, options, whichLedger );
    }
    if ( whichLedger == 'EVM' ) {
      if ( options.key == 'new transaction' ) {
        if ( data.currency == 'ETH' ) {
          return V.setEtherTransaction( data );
        }
        else if ( data.currency == 'V' ) {
          return V.setTokenTransaction( data );
        }
      }
      if ( options.key == 'verification' ) {
        return V.setAddressVerification( data );
      }
    }
    if ( whichLedger == '3Box' ) {
      return V.set3BoxSpace( options.key, data );
    }
  }

  function getData( data, options, whichLedger ) {
    if ( whichLedger == 'MongoDB' ) {

      /**
      * @notice MongoDB requires 'data' and 'options' switched
      */

      // TODO: error handling
      return new Promise( resolve => {
        socket.emit( options.key, data, function( res ) {
          resolve( res );
        } );
      } );
    }
    if ( whichLedger == 'EVM' ) {
      if ( options.key == 'transaction' ) {
        return V.getAddressHistory();
      }
    }
    if ( whichLedger == '3Box' ) {
      return V.get3BoxSpace( data ).then( res => {
        return res;
      } );
    }
    if ( whichLedger == 'http' ) {
      return http( data );
    }
  }

  return {
    launch: launch,
    setSocket: setSocket,
    getData: getData,
    setData: setData
  };

} )();
