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

    socket.on( 'community message', Chat.drawMessage );
  }

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
      if ( whichEndpoint == 'verification' ) {
        return V.setAddressVerification( data );
      }
    }
    else if ( whichLedger == '3Box' ) {
      return V.set3BoxSpace( whichEndpoint, data );
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
    else if ( whichLedger == '3Box' ) {
      return V.get3BoxSpace( data ).then( res => {
        return res;
      } );
    }
    else if ( whichLedger == 'http' ) {
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
