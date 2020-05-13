const Join = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw the user login (join)
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function ckeckEntityStoreByAddress() {

    const activeAddress = V.getState( 'activeAddress' );

    return activeAddress ? V.getEntity( activeAddress ).then( res => {
      if ( res.reset ) {
        return 'entity not found';
      }
      else if ( res.success ) {

        V.setState( 'activeEntity', res.data[0] );

        return 'entity found';
      }
      else {
        return 'entity not found';
      }
    } ) : 'error';
  }

  async function presenter( which ) {

    if ( V.getSetting( 'transactionLedger' ) == 'EVM' ) { // web3 join

      if ( which == 'initialize join' ) {
        which = 'initialize web3 join';
      }
      else if ( which == 'authenticate' ) {
        Modal.draw( 'please wait' );
        await V.setActiveAddress().then( async res => {
          if ( res.success ) {
            which = await ckeckEntityStoreByAddress();
          }
          else {
            which = res.status;
          }
        } );
      }
      else if ( which == 'new entity was set up' ) {
        Modal.draw( 'please wait' );
        if ( V.getState( 'activeAddress' ) ) {
          which = await ckeckEntityStoreByAddress();
        }
        else if ( V.getState( 'activeEntity' ).fullId ) {
          which = 'entity found';
        }
      }
    }
    else if ( V.getSetting( 'transactionLedger' ) == 'Symbol' ) { // web3 join
      if ( which == 'authenticate' ) {
        which = 'web2 login';
      }
      else if ( which == 'new entity was set up' ) {
        V.setState( 'activeAddress', V.getState( 'activeEntity' ).symbolCredentials.address );
        which = 'entity found';
      }
    }
    else { // web2 join
      if ( which == 'authenticate' ) {
        which = 'web2 login';
      }
      else if ( which == 'new entity was set up' ) {
        which = 'entity found';
      }
    }

    return which;

  }

  function view( which ) {
    if ( which == 'entity found' ) {
      Account.drawHeaderBalance();
      Navigation.draw();
      Modal.draw( which );
    }
    else if ( which == 'logged out' ) {
      Join.launch();
      Navigation.draw();
      Modal.draw( which );
    }
    else {
      Navigation.draw();
      Page.draw( { position: 'closed' } );
      Modal.draw( which );
    }
  }

  /* ============ public methods and exports ============ */

  function launch() {
    // sets the view on launch (the header "Join" button)
    if ( !V.getNode( 'join' ) ) {
      V.setNode( 'balance > svg', 'clear' );
      const $join = InteractionComponents.joinBtn();
      $join.addEventListener( 'click', function joinHandler() {
        Join.draw( 'initialize join' );
      } );

      V.setNode( 'header', $join );
    }
  }

  function draw( which ) {
    presenter( which ).then( viewData => { view( viewData ) } );
  }

  return {
    launch: launch,
    draw: draw
  };

} )();
