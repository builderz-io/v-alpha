const Account = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module driving the transaction history / account display
  *
  *
  */

  'use strict';

  /* ================== private methods ================= */

  async function castEntityName( address ) {
    const entity = await V.getEntity( address );
    return entity.success ? entity.data[0].fullId : V.castShortAddress( address );
  }

  async function presenter() {
    const pageState = V.getState( 'page' );

    if ( pageState.height != pageState.topCalc ) {
      const $topcontent = AccountComponents.topcontent( V.getState( 'activeEntity' ).fullId );
      const $list = CanvasComponents.list( 'narrow' );

      const transactions = await V.getTransaction();

      if( !transactions.success || !transactions.data[0].length ) {
        return {
          topcontent: CanvasComponents.notFound( 'transactions' ),
        };
      }

      for ( const txData of transactions.data[0].reverse() ) {
        if ( V.getSetting( 'transactionLedger' ) != 'MongoDB' ) {
          if ( txData.txType == 'in' ) {
            txData.title = await castEntityName( txData.fromAddress );
          }
          else if ( txData.txType == 'out' ) {
            txData.title = await castEntityName( txData.toAddress );
          }
        }
        if ( txData.txType == 'fee' ) {
          txData.title = 'Transaction Fee';
        }
        else if ( txData.txType == 'generated' ) {
          txData.title = 'Community Payout';
        }

        const $cardContent = AccountComponents.accountCard( txData );
        const $card = CanvasComponents.card( $cardContent );
        V.setNode( $list, $card );
      }

      // DemoContent.transactionsArr.forEach( cardData => {
      //   const $card = AccountComponents.accountCard( cardData );
      //   V.setNode( $list, $card );
      // } );

      // const $topsliderUl = AccountComponents.topSliderUl();
      // V.setNode( $topsliderUl, AccountComponents.accountBalance() );
      // for ( const variable in DemoContent.accountData ) {
      //   const $accountData = AccountComponents.accountSmallCard( variable, DemoContent.accountData );
      //   V.setNode( $topsliderUl, $accountData );
      // }

      const pageData = {
      // topslider: $topsliderUl,
        topcontent: $topcontent,
        listings: $list,
        position: 'top'
      };

      return pageData;
    }
  }

  function view( pageData ) {
    if ( pageData ) {
      Navigation.draw( 'all', { reset: true } );
      Page.draw( pageData );
    }
    else {
      Marketplace.draw();
    }
  }

  /* ============ public methods and exports ============ */

  function drawHeaderBalance( which ) {
    const aE = V.getState( 'activeEntity' );
    V.getEntityBalance( aE ).then( accState => {
      const balance = accState.data[0] ? accState.data[0][ which || 'liveBalance' ] : 'n/a';
      const $navBal = AccountComponents.headerBalance( balance );
      V.setNode( 'join', 'clear' );
      V.setNode( 'balance > svg', 'clear' );
      setTimeout( () => {return V.setNode( 'balance', $navBal )}, 700 );
    } );
  }

  function draw( options ) {
    presenter( options ).then( viewData => { view( viewData ) } );
  }

  return {
    draw: draw,
    drawHeaderBalance: drawHeaderBalance
  };

} )();
