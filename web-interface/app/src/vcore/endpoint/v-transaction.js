const VTransaction = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module to transact funds
  *
  */

  'use strict';

  /* ================== private methods ================= */

  async function castTransaction( data ) {

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

    if ( !initiator ) {
      return {
        success: false,
        status: 'no active entity'
      };
    }
    else if ( !recipientData ) {
      return {
        success: false,
        status: 'no recipient'
      };
    }
    else if ( !amount ) {
      return {
        success: false,
        status: 'invalid amount'
      };
    }
    else {
      return {
        success: true,
        status: 'transaction casted',
        data: [{
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
        }]
      };
    }
  }

  function reduceNumbers( array ) {
    return array.filter( function( item ) {
      return Number( parseInt( item ) == item );
    } )
      .reduce( function( acc, val ) { return Number( acc ) + Number( val ) }, 0 );
  }

  /* ============ public methods and exports ============ */

  async function getTransaction(
    which = V.getState( 'activeEntity' ).fullId
  ) {
    return V.getData( which, 'transaction', V.getSetting( 'transactionLedger' ) );
  }

  async function setTransaction( which ) {
    const txData = await castTransaction( which );

    if ( txData.success ) {
      return V.setData( txData.data[0], 'transaction', V.getSetting( 'transactionLedger' ) );
    }
    else {
      return Promise.resolve( txData );
    }
  }

  return {
    getTransaction: getTransaction,
    setTransaction: setTransaction
  };

} )();
