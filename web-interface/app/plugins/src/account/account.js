const Account = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the transaction history / account display
   *
   */

  'use strict';

  const session = {
    balance: -1,
  };

  /* ================== private methods ================= */

  async function presenter() {

    if ( !V.aE() ) {
      return {
        success: false,
        status: ''
      };
    }

    const transactions = await V.getTransaction();

    if( !transactions.success || !transactions.data.length ) {
      return {
        success: false,
        aE: V.aE(),
        entityBalance: null,
      };
    }

    const bal = await V.getEntityBalance();

    if ( !V.aA() ) {

      /**
       * enhance MongoDB transfers
       *
       */

      for ( const txData of transactions.data ) {
        if ( txData.txType == 'fee' ) {
          txData.title = 'Transaction Fee';
        }
        else if ( txData.txType == 'generated' ) {
          txData.title = 'Community Payout';
        }
      }
    }

    return {
      success: true,
      aE: V.aE(),
      entityBalance: bal,
      data: transactions.data
    };

  }

  function view( viewData ) {
    const $list = CanvasComponents.list( 'narrow' );
    if ( viewData.success ) {

      const $topcontent = AccountComponents.topcontent( viewData.aE.fullId, viewData.entityBalance );

      // if ( V.getSetting( 'transactionLedger' ) == 'EVM' ) {
      //   V.setNode( $list, [ InteractionComponents.onboardingCard() ] ); // TODO: should not have to be an Array here
      // }

      for ( const tx of viewData.data.reverse() ) {
        const $cardContent = AccountComponents.accountCard( tx );
        const $card = CanvasComponents.card( $cardContent );
        V.setNode( $list, $card );
      }

      Page.draw( {
        topcontent: $topcontent,
        listings: $list,
      } );
    }
    else {
      V.setNode( $list, CanvasComponents.notFound( 'transaction' ) );
      Page.draw( {
        listings: $list,
      } );
    }
  }

  function preview( path ) {

    const $list = CanvasComponents.list( 'narrow' );

    for ( let i = 0; i < 8; i++ ) {
      const $ph = AccountComponents.accountPlaceholderCard();
      const $card = CanvasComponents.card( $ph );

      V.setNode( $list, $card );
    }

    Button.draw( 'all', { fade: 'out' } );
    Navigation.draw( path );

    Chat.drawMessageForm();
    Page.draw( {
      topcontent: V.aE() ? AccountComponents.topcontent( V.aE().fullId ) : '',
      listings: $list,
      position: 'top',
    } );
  }

  function drawBalance( balance ) {
    if ( session.balance != balance ) {
      session.balance = Number( balance );
      const $navBal = AccountComponents.headerBalance( balance );
      V.setNode( 'balance', '' );
      V.setNode( 'balance', $navBal );
    }
  }

  /* ================== public methods ================== */

  function drawHeaderBalance( balance, which ) {
    if ( balance ) {
      drawBalance( balance );
    }
    else {
      V.getEntityBalance( V.aE() ).then( accState => {
        const balance = accState.data[0] ? accState.data[0][ which || 'liveBalance' ] : 'n/a';
        drawBalance( balance );
      } );
    }
  }

  function draw( path ) {
    preview( path );
    presenter().then( viewData => { view( viewData ) } );
  }

  /* ====================== export ====================== */

  return {
    draw: draw,
    drawHeaderBalance: drawHeaderBalance
  };

} )();
