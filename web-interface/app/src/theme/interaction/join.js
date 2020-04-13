const Join = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Join module
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function ckeckEntityStore() {

    const activeAddress = V.getState( 'activeAddress' );

    return activeAddress ? V.getEntity( activeAddress ).then( res => {
      if ( res.reset ) {
        return 'entity not found';
      }
      else if ( res.success ) {
        V.setState( 'activeEntity', res.data[0] );

        // debug info
        V.getContractState();
        console.log( V.getState( 'all' ) );

        return 'entity found';
      }
      else {
        return 'entity not found';
      }
    } ) : 'error';
  }

  async function presenter( which ) {

    if ( V.getSetting( 'transactionLedger' ) == 'EVM' ) { // web3 join
      if ( which == 'launch' ) {
        Modal.draw( 'please wait' );
        await V.setActiveAddress().then( async res => {
          if ( res.success ) {
            which = await ckeckEntityStore();
          }
          else {
            which = res.status;
          }
        } );
      }
      else if ( which == 'setup new entity' ) {
        Modal.draw( 'please wait' );
        which = await ckeckEntityStore();
      }
    }
    else { // web2 join
      if ( which == 'launch' ) {
        which = 'web2 login';
      }
      else if ( which == 'setup new entity' ) {
        which = 'entity found';
      }
    }

    return which;

  }

  function view( which ) {
    if ( which == 'entity found' ) {
      Account.drawHeaderBalance();
      Marketplace.draw();
      Navigation.draw( 'all', { reset: 'true' } );
      Modal.draw( which );
    }
    else if ( which == 'logged out' ) {
      Join.launch();
      Marketplace.draw();
      Modal.draw( which );
    }
    else {
      Marketplace.draw();
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
        Join.draw( 'launch' );
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
