const VTransaction = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to manage transactions
   *
   */

  'use strict';

  /* ============== user interface strings ============== */

  const ui = {
    notActive: 'no active entity',
    invalidAmount: 'invalid amount',
    noDecimals: 'no decimals',
    noRecipient: 'recipient not found',
    noRecipientAddress: 'recipient address not found',
  };

  function getString( string, scope ) {
    return V.i18n( string, 'transaction', scope || 'error message' ) + ' ';
  }

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
        status: getString( ui.notActive )
      };
    }

    const messageParts = data.slice(),
      date = Date.now(),
      timeSecondsUNIX = Number( Math.floor( date / 1000 ) ),
      forIndex = messageParts.indexOf( V.i18n( 'for', 'trigger', 'key word' ) ),
      toIndex = messageParts.indexOf( V.i18n( 'to', 'trigger', 'key word' ) );

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
      recipient = castRecipient( messageParts );
    }
    else {
      messageParts.shift();

      for ( let i = messageParts.length - 1; i >= 0; i-- ) {
        if ( messageParts[i].charAt( 0 ) === '#' ) {
          recipient = castRecipient( messageParts );
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
        status: getString( ui.invalidAmount )
      };
    }
    else if ( amount % 1 != 0 ) {
      return {
        success: false,
        endpoint: 'transaction',
        status: getString( ui.noDecimals )
      };
    }

    const recipientData = await V.getEntity( recipient );

    if ( !recipientData.success ) {
      return {
        success: false,
        endpoint: 'transaction',
        status: getString( ui.noRecipient )
      };
    }

    // TODO
    currency = 'V'; // eslint-disable-line prefer-const

    if ( currency == 'V' ) {
      const convert = V.getGrossVAmount( amount );
      contribution = convert.contribution;
      feeAmount = convert.feeAmount;
      txTotal =convert.gross;
    }
    else {
      txTotal = amount;
    }

    let recipientAddress, signature;

    const tL = V.getSetting( 'transactionLedger' );

    if ( tL == 'EVM' && V.aA() ) {
      const rD = recipientData.data[0];

      rD.evmCredentials ? rD.evmCredentials.address ?
        recipientAddress = rD.evmCredentials.address : undefined : undefined;

      /**
       * Overwrite recipientAddress if another has been defined by user
       */

      rD.receivingAddresses ? rD.receivingAddresses.evm ?
        recipientAddress = rD.receivingAddresses.evm : undefined : undefined;

      // signature = initiator.evmCredentials.privateKey;
    }
    else if ( tL == 'Symbol' && V.aA() ) {
      recipientAddress = recipientData.data[0].symbolCredentials.address;
      signature = initiator.symbolCredentials.privateKey;
    }

    if ( V.aA() && !recipientAddress ) {
      return {
        success: false,
        endpoint: 'transaction',
        status: getString( ui.noRecipientAddress )
      };
    }

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
        initiatorAddress: V.aA(),
        sender: initiator.fullId, // currently the same as initiator
        senderAddress: V.aA(), // currently the same as initiator
        recipient: recipient,
        recipientAddress: recipientAddress,
        reference: reference || 'no reference given',
        timeSecondsUNIX: timeSecondsUNIX,
        origMessage: data,
        signature: signature
      }]
    };

  }

  function castRecipient( messageParts ) {
    const tag = messageParts.pop();
    return VEntity.castEntityTitle( messageParts.join( ' ' ) ).data[0] + ' ' + tag;
  }

  function reduceNumbers( array ) {
    return array.filter( function( item ) {
      return Number( parseInt( item ) == item );
    } )
      .reduce( function( acc, val ) { return Number( acc ) + Number( val ) }, 0 );
  }

  /* ================== public methods ================== */

  async function getTransaction(
    which = V.aE().fullId // for MongoDB
  ) {
    const choice = V.aA() ? 'transactionLedger' : 'transactionLedgerWeb2';
    return V.getData( which, 'transaction', V.getSetting( choice ) );
  }

  async function setTransactionConfirmation( which ) {
    const txData = await castTransaction( which );
    return Promise.resolve( txData );
  }

  function setTransaction( txData ) {
    if ( txData.success ) {
      // const choice = V.aA() ? 'transactionLedger' : 'transactionLedgerWeb2';
      if ( V.aA() ) {
        return V.setData( txData.data[0], 'transaction', V.getSetting( 'transactionLedger' ) );
      }
      else {
        return V.setData( txData.data[0], 'managed transaction', V.getSetting( 'transactionLedgerWeb2' ) );
      }
    }
    else {
      return Promise.resolve( txData );
    }
  }

  /* ====================== export ====================== */

  V.getTransaction = getTransaction;
  V.setTransactionConfirmation = setTransactionConfirmation;
  V.setTransaction = setTransaction;

  return {
    getTransaction: getTransaction,
    setTransactionConfirmation: setTransactionConfirmation,
    setTransaction: setTransaction
  };

} )();
