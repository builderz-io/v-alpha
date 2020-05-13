const VTransaction = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to manage transactions
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function castTransaction( data ) {

    /**
     * @param data {Array} - The message as Array,
     *                       e.g. ["send", "Peter", "Smith", "#2121", "100", "for", "gardening", "work"]
     *                       or ["send", "100", "to", "Peter", "Smith", "#2121", "for", "gardening", "work"]
     *
     */

    const initiator = V.getState( 'activeEntity' );
    if ( !initiator ) {
      return {
        success: false,
        endpoint: 'transaction',
        status: 'no active entity'
      };
    }

    const messageParts = data.slice(),
      date = Date.now(),
      timeSecondsUNIX = Number( Math.floor( date / 1000 ) ),
      forIndex = messageParts.indexOf( V.i18n( 'for', 'trigger' ) ),
      toIndex = messageParts.indexOf( V.i18n( 'to', 'trigger' ) );

    let reference = '', recipient = '', currency,
      amount = 0, feeAmount = 0, contribution = 0, txTotal = 0;

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

    if ( !amount ) {
      return {
        success: false,
        endpoint: 'transaction',
        status: 'invalid amount'
      };
    }

    const recipientData = await V.getEntity( recipient );

    if ( !recipientData.success ) {
      return {
        success: false,
        endpoint: 'transaction',
        status: 'recipient not found'
      };
    }

    // TODO
    currency = 'V'; // eslint-disable-line prefer-const

    if ( currency == 'V' ) {
      const fee = V.getSetting( 'transactionFee' );
      const contr = V.getSetting( 'communityContribution' );
      const contractState = V.getState( 'contract' ) || { fee: fee, contribution: contr };
      const totalFee = Math.floor( amount / ( 1 - ( contractState.fee / 100**2 ) ) - amount );
      contribution = totalFee == 0 ? 1 : Math.ceil( totalFee * ( contractState.contribution / 100**2 ) );
      feeAmount = totalFee == 0 ? 0 : totalFee - contribution;
    }

    txTotal = amount + feeAmount + contribution;

    let recipientAddress, signature;

    const tL = V.getSetting( 'transactionLedger' );

    if ( tL == 'EVM' ) {
      recipientAddress = recipientData.data[0].evmCredentials.address;
      signature = initiator.evmCredentials.privateKey;
    }
    else if ( tL == 'Symbol' ) {
      recipientAddress = recipientData.data[0].symbolCredentials.address;
      signature = initiator.symbolCredentials.privateKey;
    }

    const aA = V.getState( 'activeAddress' );

    return {
      success: true,
      endpoint: 'transaction',
      status: 'transaction cast',
      data: [{
        date: new Date(),
        amount: amount,
        feeAmount: feeAmount,
        contribution: contribution,
        txTotal: txTotal,
        currency: currency,
        command: command,
        initiator: initiator.fullId,
        initiatorAddress: aA,
        sender: initiator.fullId, // currently the same as initiator
        senderAddress: aA, // currently the same as initiator
        recipient: recipient,
        recipientAddress: recipientAddress,
        reference: reference || 'no reference given',
        timeSecondsUNIX: timeSecondsUNIX,
        origMessage: data,
        signature: signature
      }]
    };

  }

  function reduceNumbers( array ) {
    return array.filter( function( item ) {
      return Number( parseInt( item ) == item );
    } )
      .reduce( function( acc, val ) { return Number( acc ) + Number( val ) }, 0 );
  }

  /* ================== public methods ================== */

  async function getTransaction(
    which = V.getState( 'activeEntity' ).fullId
  ) {
    const choice = V.getState( 'activeAddress' ) ? 'transactionLedger' : 'transactionLedgerWeb2';
    return V.getData( which, 'transaction', V.getSetting( choice ) );
  }

  async function setTransactionConfirmation( which ) {
    const txData = await castTransaction( which );
    return Promise.resolve( txData );
  }

  function setTransaction( txData ) {
    if ( txData.success ) {
      const choice = V.getState( 'activeAddress' ) ? 'transactionLedger' : 'transactionLedgerWeb2';
      return V.setData( txData.data[0], 'transaction', V.getSetting( choice ) );
    }
    else {
      return Promise.resolve( txData );
    }
  }

  /* ====================== export ====================== */

  ( () => {
    V.getTransaction = getTransaction;
    V.setTransactionConfirmation = setTransactionConfirmation;
    V.setTransaction = setTransaction;
  } )();

  return {
    getTransaction: getTransaction,
    setTransactionConfirmation: setTransactionConfirmation,
    setTransaction: setTransaction
  };

} )();
