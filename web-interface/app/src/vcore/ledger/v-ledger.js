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

  function setSocket() {
    return new Promise( ( resolve, reject ) => {
      const host = VInit.getSetting( 'socketHost' );
      const port = VInit.getSetting( 'socketPort' );

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
        VDebugHelper.debug( error );
        reject( 'could not connect socket' );
      } );
    } );
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
      else if ( whichEndpoint == 'verification' ) {
        return V.setAddressVerification( data );
      }
    }
    else if ( whichLedger == 'Symbol' ) {
      if ( whichEndpoint == 'transaction' ) {
        return V.setMosaicTransaction( data );
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
    setSocket: setSocket,
    getData: getData,
    setData: setData
  };

} )();
