const Join = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw the user login (join)
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( which ) {
    if ( // web3 join
      V.getState( 'browserWallet' )
      && V.getSetting( 'transactionLedger' ) == 'EVM'
    ) {
      if ( which == 'initialize join' ) {
        which = 'web3 initialize join';
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
        which = 'web2 initialize join';
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

      Navigation.drawReset();

      // if ( V.getLocal( 'welcome-modal' ) == 1 ) {
      //   // Modal.draw( which );
      //   // Navigation.drawEntityNavPill( V.getState( 'activeEntity' ) );
      //   V.setLocal( 'welcome-modal', 0 );
      // }

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
    else if ( which == 'web3 entity not found' ) {
      if( V.getSetting( 'joinVersion' ) === 1 ) {
        V.sN( 'balance > svg', 'clear' );
        Join.launch();
        Modal.draw( which );
      }
      else {
        V.sN( 'modal', 'clear' );
        V.setNode( 'body', JoinRoutine.draw( { role: 'Person', join: 1 } ) );
      }
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
    else if ( which.includes( 'initialize join' ) ) {
      Navigation.draw();
      Modal.draw( which );
    }
    else {
      Navigation.draw();
      Modal.draw( which );
    }
  }

  async function ckeckEntityStoreByAddress() { // eslint-disable-line require-await

    return V.cA()
      ? V.getEntity( 'JOIN' + '--' + V.cA() ).then( async res => {

        if ( res.reset ) {
          return 'web3 entity not found';
        }
        else if ( res.success ) {

          V.setActiveEntity( res.data[0] );

          const $userPill = V.getNode( '[uuide="' + res.data[0].uuidE + '"]' );
          if ( $userPill ) {
            Navigation.drawJoinedUserPill();
          }
          else {
            Navigation.drawEntityNavPill( res.data[0] );
          }

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
          return 'web3 entity not found';
        }
      } )
      : 'error';
  }

  /* ================== public methods ================== */

  function launch() {

    /** Sets the view on launch (the header "Join" button) */
    if( !V.getLocal( 'browser-id' ) ) {
      const brid = 'BRID' + V.castUuid().base64Url.substr( 1, 16 ); // e.g. BRIDdlvboP9QBioaDvm7
      V.setLocal( 'browser-id', brid );
    }
    if ( !V.getNode( 'join' ) ) {

      /** Flag that the welcome modal could be shown to a new user */
      V.setLocal( 'welcome-modal', 1 );

      /** Draw the version of the join button according to the app setting */
      // V.setNode( 'balance > svg', 'clear' );
      V.setNode( 'header', JoinComponents.joinBtn() );
    }
  }

  function draw( which ) {
    presenter( which ).then( viewData => { view( viewData ) } );
  }

  /* ====================== onboard ===================== */

  function onboard( key ) {
    const skillPill = document.querySelector( '[path="/network/skills"]' );
    const entityNav = document.querySelector( 'entity-nav' );
    const skillRect = skillPill.getBoundingClientRect();
    const entityNavRect = entityNav.getBoundingClientRect();

    V.sN( 'body', V.cN( {
      c: 'nudge-overlay',
      y: {
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
      },
      k: handleOnboard.bind( key ),
      h: [
        {
          c: 'profile-nudge',
          y: {
            position: 'absolute',
            top: ( entityNavRect.y + 22 ) + 'px',
            left: ( entityNavRect.x + 50 ) + 'px',
          },
          h: [{
            innerHtml: '<svg class="nudge-arrow nudge-arrow__profile" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 43.1 85.9" style="enable-background:new 0 0 43.1 85.9;" xml:space="preserve">'
                       + '<path stroke-linecap="round" stroke-linejoin="round" class="draw-nudge-arrow" d="M11.3,2.5c-5.8,5-8.7,12.7-9,20.3s2,15.1,5.3,22c6.7,14,18,25.8,31.7,33.1" />'
                       + '<path stroke-linecap="round" stroke-linejoin="round" class="draw-nudge-arrow tail-1" d="M40.6,78.1C39,71.3,37.2,64.6,35.2,58" />'
                       + '<path stroke-linecap="round" stroke-linejoin="round" class="draw-nudge-arrow tail-2" d="M39.8,78.5c-7.2,1.7-14.3,3.3-21.5,4.9" />'
                     + '</svg>', // thanks to Ashley Hebler at https://codepen.io/ahebler/pen/YXJJWb
          },
          {
            c: 'font-indie',
            y: {
              'font-size': '1.9rem',
              'color': 'blue',
              'text-shadow': '0 0 5px white',
            },
            h: 'Add your image and location',
          }],
        },
        {
          c: 'skill-nudge',
          y: {
            display: 'none',
            position: 'absolute',
            top: ( skillRect.y + 28 ) + 'px',
            left: ( skillRect.x + -25 ) + 'px',
          },
          h: [{
            innerHtml: '<svg class="nudge-arrow nudge-arrow__skill" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 43.1 85.9" style="enable-background:new 0 0 43.1 85.9;" xml:space="preserve">'
                       + '<path stroke-linecap="round" stroke-linejoin="round" class="draw-nudge-arrow" d="M11.3,2.5c-5.8,5-8.7,12.7-9,20.3s2,15.1,5.3,22c6.7,14,18,25.8,31.7,33.1" />'
                       + '<path stroke-linecap="round" stroke-linejoin="round" class="draw-nudge-arrow tail-1" d="M40.6,78.1C39,71.3,37.2,64.6,35.2,58" />'
                       + '<path stroke-linecap="round" stroke-linejoin="round" class="draw-nudge-arrow tail-2" d="M39.8,78.5c-7.2,1.7-14.3,3.3-21.5,4.9" />'
                     + '</svg>',
          },
          {
            c: 'font-indie',
            y: {
              'font-size': '1.8rem',
              'color': 'blue',
              'text-shadow': '0 0 5px white',
            },
            h: 'Add a skill',
          }],
        },
      ],
    } ) );
  }

  function handleOnboard() {
    if ( V.getNode( '.profile-nudge' ) ) {
      V.sN( '.profile-nudge', 'clear' );
      V.getNode( '.skill-nudge' ).style.display = 'block';
    }
    else if ( V.getNode( '.skill-nudge' ) ) {
      // V.sN( '.skill-nudge', 'clear' );
      V.sN( '.nudge-overlay', 'clear' );
      drawKey( this ); // this === key
    }
    else {
      V.sN( '.nudge-overlay', 'clear' );
    }
  }

  function drawKey( key ) {
    const $key = V.cN( {
      c: 'first-view-key pxy',
      y: {
        'position': 'absolute',
        'right': '10px',
        'bottom': '10px',
        'z-index': -1,
      },
      h: [
        // { t: 'span', h: key ? key.length > 18 ? '0x' : 'vx' : '' },
        {
          t: 'input',
          a: {
            value: key,
            type: 'password',
          },
          y: {
            'width': '230px',
            'padding': '2px 8px',
            'background': 'lightskyblue',
            'border': '2px solid blue',
            'border-radius': '20px',
          },
          e: {
            focus: handleViewFirstKeyFocus,
            blur: handleViewFirstKeyFocus,
          },
        },
      ],
    } );

    V.setNode( 'logo', $key );

    const firstViewKey = document.querySelector( '.first-view-key' );
    const firstViewKeyRect = firstViewKey.getBoundingClientRect();

    const $keyNudge = V.cN( {
      c: 'save-key',
      y: {
        'position': 'absolute',
        'top': ( firstViewKeyRect.y - 220 ) + 'px',
        'left': ( firstViewKeyRect.x - 85 ) + 'px',
        'z-index': -2,
      },
      h: [
        {
          c: 'font-indie',
          y: {
            'font-size': '1.9rem',
            'color': 'blue',
            'text-shadow': '0 0 5px white',
          },
          h: 'Before you begin, copy and save this key elsewhere',
        },
        {
          innerHtml: '<svg class="nudge-arrow nudge-arrow__key" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 43.1 85.9" style="enable-background:new 0 0 43.1 85.9;" xml:space="preserve">'
                   + '<path stroke-linecap="round" stroke-linejoin="round" class="draw-nudge-arrow" d="M11.3,2.5c-5.8,5-8.7,12.7-9,20.3s2,15.1,5.3,22c6.7,14,18,25.8,31.7,33.1" />'
                   + '<path stroke-linecap="round" stroke-linejoin="round" class="draw-nudge-arrow tail-1" d="M40.6,78.1C39,71.3,37.2,64.6,35.2,58" />'
                   + '<path stroke-linecap="round" stroke-linejoin="round" class="draw-nudge-arrow tail-2" d="M39.8,78.5c-7.2,1.7-14.3,3.3-21.5,4.9" />'
                 + '</svg>',
        },
      ],
    } );

    V.setNode( 'body', $keyNudge );

  }

  function handleViewFirstKeyFocus( e ) {
    if ( this.type === 'password' ) {
      V.sN( '.save-key', 'clear' );
      this.type = 'text';
      setTimeout( function() {
        e.target.setSelectionRange( 0, 9999 );
      }, 50 );
    }
    else {
      const selection = window.getSelection();
      selection.removeAllRanges();
      this.type = 'password';
    }
  }

  /* ====================== export ====================== */

  return {
    launch: launch,
    draw: draw,
    onboard: onboard,
    handleViewFirstKeyFocus: handleViewFirstKeyFocus,
  };

} )();
