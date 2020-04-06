const Join = ( function() { // eslint-disable-line no-unused-vars
  /**
  * Join module
  *
  *
  */

  'use strict';

  /* ================== private methods ================= */

  async function ckeckEntityStore() {
    const activeAddress = V.getState( 'activeAddress' );
    return activeAddress ? V.getEntity( activeAddress ).then( entity => {
      if ( entity.data[0] && entity.data[0].fullId ) {
        V.setState( 'activeEntity', entity.data[0] );
        return 'entity found';
      }
      else {
        return 'entity not found';
      }
    } ) : 'error';
  }

  async function presenter( which ) {

    if ( which == 'launch' && V.getSetting( 'web3Use' ) ) {

      Modal.draw('please wait');

      await V.setActiveAddress().then( async res => {

        if ( res.success ) {
          V.getContractState();
          which = await ckeckEntityStore();
        }
        else {
          which = res.status;
        }

      } );
    }
    else if ( which == 'new address set' ) {

      Modal.draw('please wait');

      which = await ckeckEntityStore();
    }

    return which;

  }

  function view( which ) {
    if ( which == 'entity found' ) {
      Account.drawHeaderBalance();
      Marketplace.draw();
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
