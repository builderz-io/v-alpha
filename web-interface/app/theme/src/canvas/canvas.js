const Canvas = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to initialize the app and its "canvas"
   *
   * Note: This module is loaded by V Core to INITIALIZE THE THEME
   *
   */

  'use strict';

  const host = V.getSetting( 'sourceEndpoint' );

  /* ================== private methods ================= */

  async function launchStylesheets() {

    if ( /*V.getSetting( 'useBuilds' ) */ false ) {
      await Promise.all( [
        V.setStylesheet( host + '/css/builds/v.min.css' ),
      ] )
        .then( () => console.log( 'Success loading css build' ) )
        .catch( () => console.error( 'Error loading css build' ) );
    }
    else {
      await Promise.all( [
        V.setStylesheet( host + '/css/src/0_0_variables.css' ),
        V.setStylesheet( host + '/css/src/1_0_reset-normalize.css' ),
        V.setStylesheet( host + '/css/src/1_1_reset.css' ),
        V.setStylesheet( host + '/css/src/2_0_typography.css' ),
        V.setStylesheet( host + '/css/src/2_2_color.css' ),
        V.setStylesheet( host + '/css/src/3_0_utilities.css' ),
        V.setStylesheet( host + '/css/src/4_0_components.css' ),
        V.setStylesheet( host + '/css/src/8_0_overrides.css' ),
        V.setStylesheet( host + '/css/src/9_0_leaflet.css' ),
        V.setStylesheet( host + '/css/src/9_1_leaflet-locationpicker.css' ),
      ] )
        .then( () => console.log( 'Success loading CSS source files' ) )
        .catch( () => console.error( 'Error loading CSS source files' ) );
    }
  }

  async function launchScripts() {

    if( !V.getSetting( 'useBuilds' ) ) { // the build is optionally loaded in v-launch.js (in VCore)
      await Promise.all( [
        V.setScript( host + '/theme/src/join/components.js' ),
      ] );
      await Promise.all( [
        V.setScript( host + '/theme/src/canvas/components.js' ),
        V.setScript( host + '/theme/src/canvas/background.js' ),
        V.setScript( host + '/theme/src/canvas/haze.js' ),
        V.setScript( host + '/theme/src/canvas/logo.js' ),
        V.setScript( host + '/theme/src/canvas/feature.js' ),
        V.setScript( host + '/theme/src/canvas/header.js' ),
        V.setScript( host + '/theme/src/canvas/page.js' ),
        V.setScript( host + '/theme/src/modal/components.js' ),
        V.setScript( host + '/theme/src/modal/modal.js' ),
        V.setScript( host + '/theme/src/help/components.js' ),
        V.setScript( host + '/theme/src/help/help.js' ),
        V.setScript( host + '/theme/src/interaction/components.js' ),
        // V.setScript( host + '/theme/src/interaction/button.js' ),
        V.setScript( host + '/theme/src/interaction/magic-button.js' ),
        V.setScript( host + '/theme/src/interaction/form.js' ),
        // V.setScript( host + '/theme/src/join/components.js' ),
        V.setScript( host + '/theme/src/join/avatars.js' ),
        V.setScript( host + '/theme/src/join/routine.js' ),
        V.setScript( host + '/theme/src/join/join.js' ),
        V.setScript( host + '/theme/src/navigation/components.js' ),
        V.setScript( host + '/theme/src/navigation/navigation.js' ),
      ] )
        .then( () => console.log( 'Success loading theme source files' ) )
        .catch( () => console.error( 'Error loading theme source files' ) );
    }

    if( V.getSetting( 'useBuilds' ) ) {
      await Promise.all( [
        V.setScript( host + '/plugins/builds/vplugins.min.js' ),
      ] )
        .then( () => console.log( 'Success loading plugin build' ) )
        .catch( () => console.error( 'Error loading plugin build' ) );
    }
    else {
      await Promise.all( [
        V.setScript( host + '/plugins/dependencies/jquery-3.6.0.slim.min.js' ),
        V.setScript( host + '/plugins/dependencies/leaflet.js' ),
      ] )
        .then( () => console.log( 'Success loading plugin source files A' ) )
        .catch( () => console.error( 'Error loading plugin source files A' ) );

      await Promise.all( [
        V.setScript( host + '/plugins/src/account/components.js' ),
        V.setScript( host + '/plugins/src/account/account.js' ),
        V.setScript( host + '/plugins/src/entity/components.js' ),
        V.setScript( host + '/plugins/src/entity/editable.js' ),
        V.setScript( host + '/plugins/src/entity/display.js' ),
        V.setScript( host + '/plugins/src/entity/settings.js' ),
        V.setScript( host + '/plugins/src/entity/entitylist.js' ),
        V.setScript( host + '/plugins/src/chat/components.js' ),
        V.setScript( host + '/plugins/src/chat/chat.js' ),

        V.setScript( host + '/plugins/dependencies/leaflet-locationpicker.js' ),
        V.setScript( host + '/plugins/src/map/map.js' ),

        V.setScript( host + '/plugins/src/google/google.js' ),
        V.setScript( host + '/plugins/src/data/components.js' ),
        V.setScript( host + '/plugins/src/data/data.js' ),
        V.setScript( host + '/plugins/src/pool/components.js' ),
        V.setScript( host + '/plugins/src/pool/pool.js' ),
        V.setScript( host + '/plugins/src/farm/soil-calculator/components.js' ),
        V.setScript( host + '/plugins/src/farm/soil-calculator/precipitation-calculator.js' ),
        V.setScript( host + '/plugins/src/farm/soil-calculator/soil-calculator.js' ),
        V.setScript( host + '/plugins/src/farm/farm.js' ),
        V.setScript( host + '/plugins/src/group/group.js' ),
        V.setScript( host + '/plugins/src/group/components.js' ),
        V.setScript( host + '/plugins/src/marketplace/components.js' ),
        V.setScript( host + '/plugins/src/marketplace/definitions.js' ),
        V.setScript( host + '/plugins/src/marketplace/marketplace.js' ),
        V.setScript( host + '/plugins/src/media/components.js' ),
        V.setScript( host + '/plugins/src/media/media.js' ),
        V.setScript( host + '/plugins/src/hall/components.js' ),
        V.setScript( host + '/plugins/src/hall/hall.js' ),
      ] )
        .then( () => console.log( 'Success loading plugin source files B' ) )
        .catch( () => console.error( 'Error loading plugin source files B' ) );
    }

    V.setNode( 'body', '' );

    if( V.getSetting( 'demoContent' ) ) {
      await Promise.all( [
        V.setScript( host + '/assets/demo-content/demo-content.js' ),
      ] )
        .then( () => console.log( 'Success loading demo content' ) )
        .catch( () => console.error( 'Error loading demo content' ) );
    }
  }

  function setFont() {

    // TODO
    // ['IBMPlexSans-Regular', 'IBMPlexSans-Medium', 'IBMPlexSans-Bold'].forEach( font => {
    //   V.sN( 'head', {
    //     t: 'link',
    //     a: {
    //       rel: 'preload',
    //       as: 'font',
    //       crossorigin: 'anonymous',
    //       href: 'assets/font/' + font + '.ttf',
    //     }
    //   } );
    // } );

    V.setStyle( 'font-styles', {
      '@font-face': {
        'font-family': 'IBM Plex Regular',
        'src': 'url(' + V.getSetting( 'sourceEndpoint' ) + '/assets/font/IBMPlexSans-Regular.ttf) format(\'truetype\')',
        'font-display': 'fallback',
        'unicode-range': 'U+000-024F',
      },
      '@font-face-2': {
        'font-family': 'IBM Plex Medium',
        'src': 'url(' + V.getSetting( 'sourceEndpoint' ) + '/assets/font/IBMPlexSans-Medium.ttf) format(\'truetype\')',
        'font-display': 'fallback',
        'unicode-range': 'U+000-024F',
      },
      '@font-face-3': {
        'font-family': 'IBM Plex Bold',
        'src': 'url(' + V.getSetting( 'sourceEndpoint' ) + '/assets/font/IBMPlexSans-Bold.ttf) format(\'truetype\')',
        'font-display': 'fallback',
        'unicode-range': 'U+000-024F',
      },
      '@font-face-4': {
        'font-family': 'Indie Flower',
        'src': 'url(' + V.getSetting( 'sourceEndpoint' ) + '/assets/font/IndieFlower-Regular.ttf) format(\'truetype\')',
        'font-display': 'fallback',
        'unicode-range': 'U+000-024F',
      },
    } );
  }

  function setState() {

    V.setState( 'screen', {
      brandPrimary: V.getCss( '--brandPrimary' ),
      brandSecondary: V.getCss( '--brandSecondary' ),
      buttonBkg: V.getCss( '--buttonBkg' ),
    } );

    V.setState( 'page', {
      height: V.getCss( '--page-position-peek' ),
      top: V.setPipe( V.getCss, V.castRemToPixel )( '--page-position-top' ),
      topSelected: V.setPipe( V.getCss, V.castRemToPixel )( '--page-position-top-selected' ),
      peek: V.getCss( '--page-position-peek' ),
      closed: V.getCss( '--page-position-closed' ),
      detach: V.setPipe( V.getCss, V.castRemToPixel )( '--desktop-page-detach' ),
      // rectOffset: 11, // getBoundingClientRect-for-pill-bug-mitigation
    } );

    V.setState( 'header', {
      isHazed: false,
      serviceNavTop: V.setPipe( V.getCss, V.castRemToPixel, Number )( '--service-nav-top' ),
      serviceNavLeft: V.getCss( '--service-nav-left' ),
      entityNavTop: V.getCss( '--entity-nav-top' ),
      entityNavLeft: V.getCss( '--entity-nav-left' ),
    } );

    V.setState( 'active', {
      path: window.location.pathname,
    } );
  }

  function setStatePage() {
    V.setState( 'screen', {
      height: Number( window.innerHeight ),
      width: Number( window.innerWidth ),
    } );

    /* calculate page size for the feature and top position according to screen dimensions */
    const state = V.getState();
    V.setState( 'page', { topCalc: state.screen.height - state.page.top - state.page.detach * 1.5 } );
    V.setState( 'page', { topSelectedCalc: state.screen.height - state.page.topSelected - state.page.detach * 1.5 } );
    V.setState( 'page', { featureCalc:
      Math.floor(
        state.screen.height
      - state.page.topSelected
      // - state.page.detach
      - ( state.screen.width < 600 ? state.screen.width : 600 ) * 9/16,
      ),
    } );
    V.setState( 'page', { featureDimensions: {
      width: state.screen.width < 600 ? state.screen.width : 495,
      height: Math.floor(
        ( state.screen.width < 600 ? state.screen.width : 495 ) * 9/16,
      ),
    },
    } );

  }

  function setCss() {

    /* make screen size available to CSS */
    document.documentElement.style.setProperty( '--screen-height', `${ window.innerHeight }px` );
    document.documentElement.style.setProperty( '--screen-width', `${ window.innerWidth }px` );

  }

  function setDocument() {

    // function refresh() {
    //   location.reload();
    // }

    // window.onresize = function() {
    //   V.setNode( 'body', 'clear' );
    //   clearTimeout( V.getState( 'throttle' ) );
    //   V.setState( 'throttle', setTimeout( refresh, 200 ) );
    // };

    window.onresize = function() {

      /**
       * handles page layout when mobile keyboard pops up:
       * if the screen height suddenly drops to less than 3/4 of its original height
       * fix page to top-position and bottom. Exceptions: user is on homepage and form is open.
       */

      if (
        window.innerHeight < ( V.getState( 'screen' ).height / 4 * 3 )
        && !V.getVisibility( 'form' )
      ) {
        if ( 'top' == V.getState( 'page' ).position ) {
          V.setStyle( 'keyboard-open', {
            'page-top-keyb-open': {
              top: V.getState( 'page' ).current.top + 'px',
              bottom: '0 !important',
              height: 'unset !important',
            },
          } );
          V.getNode( 'page' ).classList.add( 'page-top-keyb-open' );
        }
        else {
          V.setStyle( 'keyboard-open', {
            'page-max-keyb-open': {
              'max-height': ( window.innerHeight - V.getState( 'page' ).top ) + 'px !important',
            },
          } );
          V.getNode( 'page' ).classList.add( 'page-max-keyb-open' );
        }
      }
      else {
        V.getNode( 'page' ).classList.remove( 'page-top-keyb-open', 'page-max-keyb-open' );
      }
    };

    document.addEventListener( 'keydown', function handleDocumentKeyDown( e ) {
      const key = window.event ? e.keyCode : e.which;
      if ( key == 13 ) {
        if ( 'TEXTAREA' == document.activeElement.tagName ) {
          // e.preventDefault();
        }

        if (
          V.getVisibility( '.join-submit__btn' )
        ) {
          setTimeout( function joinClickOnEnter() {
            V.getNode( '.join-submit__btn' ).click();
          }, 120 );
        }
        else if (
          !V.getVisibility( 'form' )
          && !V.getVisibility( 'modal' )
          && !V.getVisibility( 'joinoverlay' )
          && !V.getVisibility( '.messageform' )
        ) {
          V.getNode( '.magic-btn__btn' ).click();
        }
        else if (
          V.getVisibility( '#query' )
          || V.getVisibility( '#search' )
          || V.getVisibility( '#sign-transaction' )
        ) {
          e.preventDefault();
          handleKeyboard( ['search', 'query' /*, 'sign-transaction' */ ] );
        }
        // handleKeyboard( ['sign-transaction', 'plus', /* 'set', */ 'name-new', 'query'] );
      }
      else if ( key == 27 ) {
        e.preventDefault();
        MagicButton.drawReset();
        if (
          V.getVisibility( 'modal' )
        ) {
          V.getNode( 'modal' ).click();
        }
        else if (
          V.getVisibility( 'joinoverlay' )
        ) {
          V.getNode( 'joinoverlay' ).click();
        }
        else {
          CanvasComponents.handleClosePopup();
          handleKeyboard( ['close', 'modal-close'] );
        }
      }
    } );

    // document.addEventListener( 'keyup', function handleDocumentKeyUp( e ) {
    //   const key = window.event ? e.keyCode : e.which;
    //   if ( key == 13 ) {
    //     e.preventDefault();
    //   }
    //   else if ( key == 27 ) {
    //     e.preventDefault();
    //   }
    // } );

  }

  function view(
    historyState,
    path = historyState ? historyState.path : '',
  ) {

    /**
     * Canvas view renders on initial page load, reload and history change
     *
     */

    const lP = V.getSetting( 'landingPage' );
    const lPVisits = Number( V.getLocal( 'landing-page-visits' ) );

    if (
      window.location.pathname == '/'
      && lP
      && ( !lPVisits || lPVisits < 20000 )
      && !V.aE()
    ) {
      path = lP;
      V.setBrowserHistory( lP );
      V.setLocal( 'landing-page-visits', lPVisits + 1 );
    }

    Chat.drawMessageForm( 'clear' );

    setNavStates(); // if !serviceNav

    initCanvas(); // if !background

    returningUser(); // if !activeEntity

    V.castRoute( path )
      .then( (
        x,
        status = x.status,
        which = x.data[0],
      ) => {
        if ( ['home'].includes( status ) ) {
          // V.setState( 'page', { rectOffset: 0 } ); // getBoundingClientRect-for-pill-bug-mitigation
          Marketplace.draw();
        }
        else if ( ['market', 'market category'].includes( status ) ) {
          Marketplace.draw( which );
        }
        else if ( ['media', 'media category'].includes( status ) ) {
          Media.draw( which );
        }
        else if ( ['farms', 'farms category'].includes( status ) ) {
          Farm.draw( which );
        }
        else if ( ['hall'].includes( status ) ) {
          Hall.draw( which );
        }
        else if ( ['data'].includes( status ) ) {
          Data.draw( which );
        }
        else if ( ['pool'].includes( status ) ) {
          Pool.draw( which );
        }
        else if ( ['user profile'].includes( status ) ) {
          User.draw( which );
        }
        else if ( ['user account'].includes( status ) ) {
          Account.draw( which );
        }
        else if ( ['user entities'].includes( status ) ) {
          EntityList.draw( which );
        }
        else if ( ['user settings'].includes( status ) ) {
          Settings.draw( which );
        }
        else if ( ['chat everyone'].includes( status ) ) {
          Chat.draw( which );
        }
        else if ( ['profile'].includes( status ) ) {
          Profile.draw( which );
        }

      } )
      .catch( () => {
        Marketplace.draw();
        Modal.draw( '404' );
      } );

  }

  function setNavStates() {
    if( !V.getState( 'serviceNav' ) ) {

      /** if the plugin choice is available, execute its .launch method */
      const pluginChoices = Object.keys( V.getSetting( 'plugins' ) );
      const availablePlugins = V.getState( 'availablePlugins' );
      pluginChoices.map( choice => availablePlugins[choice] ? availablePlugins[choice]() : null );

      /** launch the user navigation (transfer, settings ...) */
      User.launch();
    }

    if ( V.getSetting( 'demoContent' ) ) {
      V.setEntity( DemoContent.mongoArr[4] );
      // ( async () => {
      //   for ( let i = 0; i < DemoContent.mongoArr.length; i++ ) {
      //     await V.setEntity( DemoContent.mongoArr[i] );
      //   }
      // } )();
    }
  }

  function initCanvas() {
    if( !V.getNode( 'background' ) ) {
      Background.launch(); // sets node
      Haze.launch(); // sets node
      Feature.launch(); // sets node
      Header.launch(); // sets nodes
      Logo.launch(); // sets node
      Page.launch(); //  sets nodes: page elements and adds flick and click handlers for sliding
      // Button.launch(); // sets nodes: hidden buttons

      V.setNode( 'balance', AccountComponents.headerBalance( -1 ) );

      VMap.launch();

      if ( V.getSetting( 'devMode' ) ) {
        V.setNode( 'body', VDebugger.resetApp() );
        V.setNode( 'body', VDebugger.downloadStrings() );
        V.setNode( 'body', VDebugger.debugLogs() );
      }

      // setTimeout( function functionName() {
      //   Join.onboard();
      // }, 2000 );
    }
  }

  function returningUser() {
    if( !V.aE() ) {
      if ( V.getLocal( 'last-connected-address' ) && window.ethereum ) {
        Join.draw( 'authenticate' );
      }
      else {
        Join.launch(); // sets node: join button
      }
    }
    else {
      setTimeout( function delayedDrawJoinedUserPill() {
        // setTimeout ensures pill is found in nav
        Navigation.drawJoinedUserPill();
      }, 0 );
      Join.draw( 'new entity was set up' );
    }
  }

  /*
  function returningUser() {
    if( !V.aE() ) {
      V.setAuth()
        .then( data => {
          if ( data.success ) {
            console.log( 'auth success' );
            return data.data[0];
          }
          else {
            throw new Error( 'could not set auth' );
          }
        } )
        .then( data => V.getEntity( { uuidE: data.uuidE, uuidP: data.uuidP, isReturningUser: true } ) )
        .then( entity => {
          if ( entity.success ) {
            V.setActiveEntity( entity.data[0] );
            Navigation.drawJoinedUserPill();
            Join.draw( 'new entity was set up' );
          }
          else {
            throw new Error( 'could not get entity after set auth' );
          }
        } )
        .catch( err =>  {
          V.setTempRefreshToken(); // clears temp_refresh
          console.log( 'auth unsuccessful -', err );
          if ( V.getLocal( 'last-connected-address' ) && window.ethereum ) {
            Join.draw( 'authenticate' );
          }
          else {
            Join.launch(); // sets node: join button
          }
        } );
    }
  }
*/

  function handleKeyboard( array ) {
    array.some( elem => {
      if ( V.getVisibility( '#' + elem ) ) {
        V.getNode( '#' + elem ).click();
      }
    } );
  }

  /* ============ public methods and exports ============ */

  async function launch() {

    await launchStylesheets();
    await launchScripts();

    setState();
    setStatePage();
    setDocument();
    setCss();
    setFont();

  }

  function draw( historyState ) {
    view( historyState );
  }

  return {
    setStatePage: setStatePage,
    launch: launch,
    draw: draw,
  };

} )();
