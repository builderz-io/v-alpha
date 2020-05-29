const Join = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw the user login (join)
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( which ) {
    if ( window.Web3Obj && V.getSetting( 'transactionLedger' ) == 'EVM' ) { // web3 join
      if ( which == 'initialize join' ) {
        which = 'initialize web3 join';
      }
      else if ( which.includes( 'authenticate' ) ) {
        // Modal.draw( 'please wait' );
        await V.setActiveAddress().then( async res => {
          if ( res.success ) {
            const check = await ckeckEntityStoreByAddress();
            // if ( check == 'entity found' ) {
            //   which = check;
            // }
            // else {
            if ( which.includes( 'existing entity' ) ) {
              V.setCookie( 'welcome-modal', 1 );
              which = 'authenticate existing entity';
            }
            else {
              which = check;
            }
            // }
          }
          else {
            which = res.status;
          }
        } );
      }
      else if ( which == 'new entity was set up' ) {
        // Modal.draw( 'please wait' );
        if ( V.getState( 'activeAddress' ) ) {
          which = await ckeckEntityStoreByAddress();
        }
        else if ( V.getState( 'activeEntity' ).fullId ) {
          which = 'entity found';
        }
      }
    }
    else if ( V.getSetting( 'transactionLedger' ) == 'Symbol' ) { // web3 join
      if ( which == 'initialize join' ) {
        which = 'web2 login';
      }
      else if ( which == 'new entity was set up' ) {
        V.setState( 'activeAddress', V.getState( 'activeEntity' ).symbolCredentials.address );
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
    if ( which == 'entity found' ) {
      Account.drawHeaderBalance();
      // Navigation.draw();
      if ( V.getCookie( 'welcome-modal' ) == 1 ) {
        Modal.draw( which );
        V.setCookie( 'welcome-modal', 0 );
      }
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
    else {
      Navigation.draw();
      Page.draw( { position: 'closed' } );
      Modal.draw( which );
    }
  }

  async function ckeckEntityStoreByAddress() { // eslint-disable-line require-await

    const activeAddress = V.getState( 'activeAddress' );

    return activeAddress ? V.getEntity( activeAddress ).then( async res => {
      if ( res.reset ) {
        return 'entity not found';
      }
      else if ( res.success ) {

        V.setState( 'activeEntity', res.data[0] );

        const eB = await V.getEntityBalance( res.data[0] );

        V.setState( 'activeEntity', { balance: eB.data[0] } );

        return 'entity found';
      }
      else {
        return 'entity not found';
      }
    } ) : 'error';
  }

  /* ================== public methods ================== */

  function onboardingCard() {

    const aE = V.getState( 'activeEntity' );
    const ledger = V.getSetting( 'transactionLedger' );

    if ( aE && ledger == 'EVM' ) {
      let $cardContent;
      const balanceCheck = aE.balance && aE.balance.liveBalance > 0 ? true : false;

      if ( !V.getState( 'activeAddress' ) ) { // no wallet in use
        $cardContent = V.castNode( {
          tag: 'div',
          c: 'flex w-full items-center justify-evenly',
          html: '<p>' + '👋 ' + V.i18n( 'Connect a crypto wallet', 'join', 'onboarding call to action' ) + '</p>'
        } );
        $cardContent.addEventListener( 'click', function handleAddWallet() {
          if ( window.Web3Obj ) {
            Join.draw( 'authenticate existing entity' );
          }
          else {
            Join.draw( 'install metamask' );
          }
        } );
      }
      else if ( !balanceCheck ) { // wallet balance is 0
        $cardContent = V.castNode( {
          tag: 'div',
          c: 'flex w-full items-center justify-evenly',
          html: '<p>' + '👋 ' + V.i18n( 'Ask a friend to transfer 1 VALUE to progress your verification.', 'join', 'onboarding call to action' ) + '</p>'
        } );
      }
      else if ( balanceCheck ) { // no brightID connected
        $cardContent = V.castNode( {
          tag: 'div',
          c: 'flex w-full items-center justify-evenly',
          html: '<p>' + '👋 ' + V.i18n( 'Verify with BrightID to receive VALUE basic income.', 'join', 'onboarding call to action' ) + '</p>'
          // <a href="brightid://link-verification/http:%2f%2fnode.brightid.org/VALUE/${ entity.private.base64Url }"><img src="/assets/img/brightID-logo_sm.png"></a>
        } );
      }

      const $onboardingCard = CanvasComponents.card( $cardContent );

      return $onboardingCard;
    }
    else {
      return '';
    }
  }

  function launch() {
    // sets the view on launch (the header "Join" button)
    if ( !V.getNode( 'join' ) ) {
      V.setNode( 'balance > svg', 'clear' );
      V.setCookie( 'welcome-modal', 1 );
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
    onboardingCard: onboardingCard,
    launch: launch,
    draw: draw,
  };

} )();
