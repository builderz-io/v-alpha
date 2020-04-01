const VLedger = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module for the app ledger / database connections
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

  async function launch() {
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

  function setData( which, data, ledger ) {
    const ledgerChoice = ledger.split( ' ' );
    if ( ledgerChoice[0] == 'mongodb' && ledgerChoice[1] == 'socket' ) {
      return getData( which, data, ledger ); // setData == getData in this case
    }
    if ( ledgerChoice[0] == 'evm' ) {
      if ( which == 'new transaction' ) {
        if ( data.currency == 'ETH' ) {
          return V.setEtherTransaction( data );
        }
        else if ( data.currency == 'V' ) {
          return V.setTokenTransaction( data );
        }
      }
      if ( which == 'new verification' ) {
        return V.setAddressVerification( data );
      }
    }
  }

  function getData( which, data, ledger ) {

    const ledgerChoice = ledger.split( ' ' );
    if ( ledgerChoice[0] == 'http' ) {
      return http( which );
    }
    if ( ledgerChoice[0] == 'mongodb' && ledgerChoice[1] == 'socket' ) {
      // TODO: error handling
      return new Promise( resolve => {
        // V.debug( socket.connected );

        socket.emit( which, data, function( res ) {
          // V.debug( res.message );
          resolve( res );
        } );

        /*
        resolve( {
          status: 'success',
          message: 'Entities retrieved successfully',
          data: [
            {
              credentials: {
                name: 'Accountant',
                tag: '#9232',
                role: 'job'
              },
              properties: {
                location: 'Berlin, Germany',
                description: 'We need an accountant for our monthly reporting',
                creator: 'test',
                creatorTag: 'test',
                created: '2020-02-18T13:59:02.648Z',
                fillUntil: '2020-02-25T13:59:02.648Z',
                expires: '2020-08-18T13:59:02.648Z',
                target: '400',
                unit: 'day'
              },
              geometry: {
                type: 'Point',
                coordinates: [
                  13.405,
                  52.52
                ]
              },
              fullId: 'Accountant #9232'
            }
          ]
        } );
        */

      } );
    }
  }

  return {
    launch: launch,
    setSocket: setSocket,
    getData: getData,
    setData: setData
  };

} )();
