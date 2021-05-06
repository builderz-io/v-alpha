const Join = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw the user login (join)
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( which ) {
    if ( V.getState( 'browserWallet' ) && V.getSetting( 'transactionLedger' ) == 'EVM' ) { // web3 join
      if ( which == 'initialize join' ) {
        which = 'initialize web3 join';
      }
      else if ( which.includes( 'authenticate' ) ) {
        // Modal.draw( 'please wait' );
        await V.setConnectedAddress().then( async res => {
          if ( res.success ) {

            const check = await ckeckEntityStoreByAddress();

            if ( which.includes( 'existing entity' ) ) {
              V.setLocal( 'welcome-modal', 1 );
              which = 'authenticate existing entity';
            }
            else {
              which = check;
            }
          }
          else {
            which = res.status;
          }
        } );
      }
      else if ( which == 'new entity was set up' ) {
        // Modal.draw( 'please wait' );
        if ( V.aE() && V.aE().fullId ) {
          which = 'entity found';
        }
        else if ( V.cA() ) {
          which = await ckeckEntityStoreByAddress();
        }
      }
    }
    else if ( V.getSetting( 'transactionLedger' ) == 'Symbol' ) { // web3 join
      if ( which == 'initialize join' ) {
        which = 'web2 login';
      }
      else if ( which == 'new entity was set up' ) {
        V.setLocal( 'last-connected-address', V.aE().symbolCredentials.address );
        which = 'entity found';
      }
    }
    else { // web2 join
      if ( which == 'initialize join' ) {
        which = 'initialize web2 join';
      }
      else if ( which == 'new entity was set up' ) {
        which = 'entity found';
      }
    }

    return which;

  }

  function view( which ) {
    console.log( 'join: ', which );

    if ( which == 'entity found' ) {

      V.setNode( 'join', 'clear' );

      V.setNode( '.modal', 'clear' );

      if ( V.getLocal( 'welcome-modal' ) == 1 ) {
        Modal.draw( which );
        V.setLocal( 'welcome-modal', 0 );
      }

      const bal = V.aE().balance;

      if ( !bal ) { // web2 signup
        Account.drawHeaderBalance();
      }
      else if ( bal && bal.success ) { // web3 signup
        Account.drawHeaderBalance( bal.balance.balance );
      }
      else { // web3 signup, balance not found (e.g. wrong network)
        Modal.draw( 'could not get balance' );
      }

      // TODO: replace setInterval with eventsubscription, when possible
      // ( Error: The current provider doesn't support subscriptions: OperaWeb3Provider" )
      setInterval( Account.drawHeaderBalance, V.getSetting( 'balanceCheckInterval' ) * 1000 );

    }
    else if ( which == 'entity not found' ) {
      V.sN( 'balance > svg', 'clear' );
      Join.launch();
      Modal.draw( which );
    }
    else if ( which == 'logged out' ) {
      Join.launch();
      Navigation.draw();
      Modal.draw( which );
    }
    else if ( which == 'user denied auth' ) {
      Join.launch();
      Navigation.draw();
      Modal.draw( which );
    }
    else {
      Navigation.draw();
      Modal.draw( which );
    }
  }

  async function ckeckEntityStoreByAddress() { // eslint-disable-line require-await

    return V.cA() ? V.getEntity( V.cA() ).then( async res => {

      if ( res.reset ) {
        return 'entity not found';
      }
      else if ( res.success ) {

        V.setActiveEntity( res.data[0] );

        const eB = await V.getEntityBalance( res.data[0] );

        if ( eB.success ) {
          V.setState( 'activeEntity', { balance: {
            success: true,
            balance: eB.data[0],
          } } );
        }
        else {
          V.setState( 'activeEntity', { balance: {
            success: false,
            message: eB.message.message.message,
          } } );
        }

        return 'entity found';
      }
      else {
        return 'entity not found';
      }
    } ) : 'error';
  }

  /* ================== public methods ================== */

  function launch() {
    // sets the view on launch (the header "Join" button)
    if( !V.getLocal( 'browser-id' ) ) {
      const brid = 'BRID' + V.castUuid().base64Url.substr( 1, 16 ); // e.g. BRIDdlvboP9QBioaDvm7
      V.setLocal( 'browser-id', brid );
    }
    if ( !V.getNode( 'join' ) ) {
      V.setNode( 'balance > svg', 'clear' );
      V.setLocal( 'welcome-modal', 1 );
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

  /* ====================== export ====================== */

  return {
    launch: launch,
    draw: draw,
  };

} )();
