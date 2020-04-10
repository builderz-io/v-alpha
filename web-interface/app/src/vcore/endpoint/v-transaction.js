const VTransaction = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module to transact funds
  *
  */

  'use strict';

  const DOM = {};

  /* ================== private methods ================= */

  async function constructTx( data ) {

    /*
    * data: array
    */

    const messageParts = data.slice(),
      date = Date.now(),
      timeSecondsUNIX = Number( Math.floor( date / 1000 ) ),
      forIndex = messageParts.indexOf( V.i18n( 'for' ) ),
      toIndex = messageParts.indexOf( V.i18n( 'to' ) );

    // extract reference
    let reference = '', recipient = '', amount = 0;

    const command = messageParts[0];

    if ( forIndex != -1 ) {
      reference = messageParts.splice( forIndex, messageParts.length );
      reference.shift();
      reference = reference.join( ' ' ).trim();
    }

    if ( toIndex != -1 && !isNaN( messageParts[ toIndex -1 ] ) ) {
      const firstPart = messageParts.splice( 0, toIndex + 1 );
      amount = reduceNumbers( firstPart );
      recipient = messageParts.join( ' ' ).trim();
    }
    else {
      messageParts.shift();

      for ( let i = messageParts.length - 1; i >= 0; i-- ) {
        if ( messageParts[i].charAt( 0 ) === '#' ) {
          recipient = messageParts.join( ' ' ).trim();
          break;
        }
        if ( !isNaN( Number( messageParts[i] ) ) ) {
          amount += Number( messageParts[i] );
          messageParts.pop();
        }
      }
    }

    const initiator = V.getState( 'activeEntity' );

    const recipientData = await V.getEntity( recipient );

    return initiator ? {
      status: 'success',
      date: new Date(),
      amount: amount,
      currency: 'V', // TODO
      command: command,
      initiator: initiator.fullId,
      initiatorAddress: initiator.evmCredentials.address,
      sender: initiator.fullId, // currently the same as initiator
      senderAddress: initiator.evmCredentials.address, // currently the same as initiator
      recipient: recipient,
      recipientAddress: recipientData.data[0].evmCredentials.address,
      reference: reference,
      timeSecondsUNIX: timeSecondsUNIX,
      origMessage: data
    } : {
      status: 'no active entity'
    };
  }

  function reduceNumbers( array ) {
    return array.filter( function( item ) {
      return Number( parseInt( item ) == item );
    } )
      .reduce( function( acc, val ) { return Number( acc ) + Number( val ) }, 0 );
  }

  /* ============ public methods and exports ============ */

  async function getTransaction( which ) {
    return V.getData( which, 'get transaction', V.getSetting( 'transactionLedger' ) );
  }

  async function setTransaction( which ) {
    const txData = await constructTx( which );

    if ( txData.amount == 0 ) {
      return Promise.resolve( { status: 'error', message: 'invalid or no amount' } );
    }
    if ( txData.status == 'no active entity' ) {
      return Promise.resolve( { status: 'error', message: 'no active entity' } );
    }
    else {
      return V.setData( txData, 'set transaction', V.getSetting( 'transactionLedger' ) );
    }
  }

  return {
    getTransaction: getTransaction,
    setTransaction: setTransaction
  };

} )();
