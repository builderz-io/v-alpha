const Join = ( function() { // eslint-disable-line no-unused-vars
  /**
  * Join module
  *
  *
  */

  'use strict';

  /* ================== private methods ================= */

  async function ckeckEntityExists() {
    const activeAddress = V.getState( 'activeAddress' );
    return activeAddress ? V.getEntity( 'by ethAddress', activeAddress ).then( entity => {

      if ( entity.data.length ) {
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
      await V.setActiveAddress().then( async res => {

        if ( res.status == 'set address' ) {
          V.getContractState();
          which = await ckeckEntityExists();
        }
        else {
          which = res.status;
        }

      } );
    }
    else if ( which == 'set new address' ) {
      which = await ckeckEntityExists();
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
      Modal.draw( which );
    }
  }

  /* ============ public methods and exports ============ */

  function launch() {
    // sets the view on launch (the header "Join" button)
    if ( !V.gN( 'join' ) ) {
      V.sN( 'balance > svg', 'clear' );
      const $join = InteractionComponents.joinBtn();
      $join.addEventListener( 'click', function joinHandler() {
        Join.draw( 'launch' );
      } );

      V.sN( 'header', $join );
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
