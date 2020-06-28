const Account = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the transaction history / account display
   *
   */

  'use strict';

  /* ================== private methods ================= */

  // async function castEntityName( address ) {
  //   const entity = await V.getEntity( address );
  //   return entity.success ? entity.data[0].fullId : V.castShortAddress( address );
  // }

  async function presenter( path ) {

    const aE = V.getState( 'activeEntity' );

    if ( !aE ) {
      // TODO: draw on entering through link
      // Marketplace.draw();
      return;
    }

    const transactions = await V.getTransaction();

    if( !transactions.success || !transactions.data.length ) {
      return {
        success: false,
        aE: aE
      };
    }

    const enhancedTx = [];

    for ( const txData of transactions.data.reverse() ) {
      // if ( V.getState( 'activeAddress' ) ) {
      //
      //   const blockDetails = await window.Web3Obj.eth.getBlock( txData.block );
      //   txData.blockDate = blockDetails.timestamp;
      //
      //   if ( txData.txType == 'in' ) {
      //     txData.title = await castEntityName( txData.fromAddress );
      //   }
      //   else if ( txData.txType == 'out' ) {
      //     txData.title = await castEntityName( txData.toAddress );
      //   }
      // }
      if ( !V.getState( 'activeAddress' ) ) { // in case of MongoDB transfers
        if ( txData.txType == 'fee' ) {
          txData.title = 'Transaction Fee';
        }
        else if ( txData.txType == 'generated' ) {
          txData.title = 'Community Payout';
        }
      }

      enhancedTx.push( txData );
    }

    return {
      success: true,
      aE: aE,
      data: enhancedTx
    };

  }

  function view( txData ) {

    const $list = CanvasComponents.list( 'narrow' );

    const $topcontent = AccountComponents.topcontent( txData.aE.fullId );

    // if ( V.getSetting( 'transactionLedger' ) == 'EVM' ) {
    //   V.setNode( $list, [ InteractionComponents.onboardingCard() ] ); // TODO: should not have to be an Array here
    // }

    if ( txData.success ) {
      for ( const tx of txData.data /*.reverse() */ ) {
        const $cardContent = AccountComponents.accountCard( tx );
        const $card = CanvasComponents.card( $cardContent );
        V.setNode( $list, $card );
      }
    }
    else {
      V.setNode( $list, CanvasComponents.notFound( 'transactions' ) );
    }
    Page.draw( {
      topcontent: $topcontent,
      listings: $list,
    } );
  }

  function preview( path ) {
    const aE = V.getState( 'activeEntity' );
    const $list = CanvasComponents.list( 'narrow' );

    for ( let i = 0; i < 12; i++ ) {
      const $ph = AccountComponents.accountPlaceholderCard();
      const $card = CanvasComponents.card( $ph );

      V.setNode( $list, $card );
    }

    Button.draw( 'all', { fade: 'out' } );
    Navigation.draw( path );

    Chat.drawMessageForm();
    Page.draw( {
      topcontent: aE ? AccountComponents.topcontent( aE.fullId ) : '',
      listings: $list,
      position: 'top',
    } );
  }

  /* ============ public methods and exports ============ */

  function drawHeaderBalance( balance, which ) {
    V.setNode( 'balance', '' );
    if ( balance ) {
      const $navBal = AccountComponents.headerBalance( balance );
      V.setNode( 'balance', $navBal );
    }
    else {
      const aE = V.getState( 'activeEntity' );
      V.getEntityBalance( aE ).then( accState => {
        const balance = accState.data[0] ? accState.data[0][ which || 'liveBalance' ] : 'n/a';
        const $navBal = AccountComponents.headerBalance( balance );
        V.setNode( 'balance', $navBal );
        // setTimeout( () => {return V.setNode( 'balance', $navBal )}, 100 );
      } );
    }
  }

  function draw( path ) {
    preview( path );
    presenter( path ).then( viewData => { view( viewData ) } );
  }

  return {
    draw: draw,
    drawHeaderBalance: drawHeaderBalance
  };

} )();
