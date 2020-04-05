const Account = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module driving the transaction history / account display
  *
  *
  */

  'use strict';

  const DOM = {};

  /* ================== private methods ================= */

  async function presenter() {
    const pageState = V.getState( 'page' );

    if ( pageState.height != pageState.topCalc ) {

      const transactions = await V.getAddressHistory();

      const $listingsUl = AccountComponents.listingsUl();

      for ( const txData of transactions.data[0] ) {

        if ( txData.type == 'in' ) {
          const from = await V.getEntity( txData.from );
          txData.title = from.data[0].fullId;
        }
        else if ( txData.type == 'out' ) {
          const to = await V.getEntity( txData.to );
          txData.title = to.data[0].fullId;
        }
        else if ( txData.type == 'burned' ) {
          txData.title = 'Burn Account';
        }
        else if ( txData.type == 'generated' ) {
          txData.title = 'Community Payout';
        }
        else {
          txData.title = 'Unknown';
        }

        const $card = AccountComponents.accountCard( txData );
        V.setNode( $listingsUl, $card );
      }

      // DemoContent.transactionsArr.forEach( cardData => {
      //   const $card = AccountComponents.accountCard( cardData );
      //   V.setNode( $listingsUl, $card );
      // } );

      // const $topsliderUl = AccountComponents.topSliderUl();
      // V.setNode( $topsliderUl, AccountComponents.accountBalance() );
      // for ( const variable in DemoContent.accountData ) {
      //   const $accountData = AccountComponents.accountSmallCard( variable, DemoContent.accountData );
      //   V.setNode( $topsliderUl, $accountData );
      // }

      const pageData = {
      // topslider: $topsliderUl,
        topcontent: V.cN( {
          tag: 'p',
          class: 'pxy fs-xl font-bold txt-center',
          html: 'Account of ' + V.getState( 'activeEntity' ).fullId,
        } ),
        listings: $listingsUl,
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
    V.getAllEntityData().then( accState => {
      const $navBal = AccountComponents.headerBalance( accState.data[0], which );
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
