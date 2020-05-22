const Canvas = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to initialize the app and its "canvas"
   *
   * Note: This module is loaded by V Core to INITIALIZE THE THEME
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function launchStylesheets() {
    await Promise.all( [
      V.setStylesheet( '/src/css/0_0_variables.css' ),
      V.setStylesheet( '/src/css/1_0_reset-normalize.css' ),
      V.setStylesheet( '/src/css/1_1_reset.css' ),
      V.setStylesheet( '/src/css/2_0_typography.css' ),
      V.setStylesheet( '/src/css/2_2_color.css' ),
      V.setStylesheet( '/src/css/3_0_utilities.css' ),
      V.setStylesheet( '/src/css/4_0_components.css' ),
      V.setStylesheet( '/src/css/8_0_overrides.css' ),
      V.setStylesheet( '/src/css/9_0_leaflet.css' )
    ] );
  }

  async function launchScripts() {
    await Promise.all( [

      V.setScript( '/assets/demo-content/demo-content.js' ),

      V.setScript( '/src/theme/canvas/components.js' ),
      V.setScript( '/src/theme/canvas/background.js' ),
      V.setScript( '/src/theme/canvas/haze.js' ),
      V.setScript( '/src/theme/canvas/feature.js' ),
      V.setScript( '/src/theme/canvas/header.js' ),
      V.setScript( '/src/theme/canvas/page.js' ),
      V.setScript( '/src/theme/modal/components.js' ),
      V.setScript( '/src/theme/modal/modal.js' ),
      V.setScript( '/src/theme/interaction/components.js' ),
      V.setScript( '/src/theme/interaction/button.js' ),
      V.setScript( '/src/theme/interaction/form.js' ),
      V.setScript( '/src/theme/interaction/join.js' ),
      V.setScript( '/src/theme/navigation/components.js' ),
      V.setScript( '/src/theme/navigation/navigation.js' ),

      V.setScript( '/src/plugins/account/components.js' ),
      V.setScript( '/src/plugins/account/account.js' ),
      V.setScript( '/src/plugins/user/components.js' ),
      V.setScript( '/src/plugins/user/user.js' ),
      V.setScript( '/src/plugins/profile/components.js' ),
      V.setScript( '/src/plugins/profile/profile.js' ),
      V.setScript( '/src/plugins/chat/components.js' ),
      V.setScript( '/src/plugins/chat/chat.js' ),
      V.setScript( '/src/plugins/map/map.js' ),
      V.setScript( '/src/plugins/google/google.js' ),
      V.setScript( '/src/plugins/data/components.js' ),
      V.setScript( '/src/plugins/data/data.js' ),
      V.setScript( '/src/plugins/marketplace/components.js' ),
      V.setScript( '/src/plugins/marketplace/marketplace.js' ),
      V.setScript( '/src/plugins/media/components.js' ),
      V.setScript( '/src/plugins/media/media.js' ),
    ] );
    console.log( '*** canvas scripts loaded ***' );

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
        'src': 'url(/assets/font/IBMPlexSans-Regular.ttf) format(\'truetype\')',
        'font-display': 'fallback',
        'unicode-range': 'U+000-024F'
      },
      '@font-face-2': {
        'font-family': 'IBM Plex Medium',
        'src': 'url(/assets/font/IBMPlexSans-Medium.ttf) format(\'truetype\')',
        'font-display': 'fallback',
        'unicode-range': 'U+000-024F'
      },
      '@font-face-3': {
        'font-family': 'IBM Plex Bold',
        'src': 'url(/assets/font/IBMPlexSans-Bold.ttf) format(\'truetype\')',
        'font-display': 'fallback',
        'unicode-range': 'U+000-024F'
      }
    } );
  }

  function setState() {

    V.setState( 'screen', {
      height: Number( window.innerHeight ),
      width: Number( window.innerWidth )
    } );
    V.setState( 'active', {} );
    V.setState( 'page', {
      height: V.getCss( '--page-position-peek' ),
      top: V.setPipe( V.getCss, V.castRemToPixel )( '--page-position-top' ),
      topSelected: V.setPipe( V.getCss, V.castRemToPixel )( '--page-position-top-selected' ),
      peek: V.getCss( '--page-position-peek' ),
      closed: V.getCss( '--page-position-closed' ),
    } );

    /* calculate page size for the feature and top position according to screen dimensions */
    const state = V.getState( 'all' );
    V.setState( 'page', { topCalc: state.screen.height - state.page.top } );
    V.setState( 'page', { topSelectedCalc: state.screen.height - state.page.topSelected } );
    V.setState( 'page', { featureCalc: Math.floor( state.screen.height - state.page.topSelected - state.screen.width * 9/16 ) } );

    V.setState( 'header', {

      isHazed: false,

      serviceNavTop: V.setPipe( V.getCss, V.castRemToPixel, Number )( '--service-nav-top' ),
      serviceNavLeft: V.setPipe( V.getCss, Number )( '--service-nav-left' ),

      entityNavTop: V.setPipe( V.getCss, Number )( '--entity-nav-top' ),
      entityNavLeft: V.setPipe( V.getCss, Number )( '--entity-nav-left' ),

    } );
  }

  function setCss() {

    /* make screen size available to CSS */
    document.documentElement.style.setProperty( '--screen-height', `${ window.innerHeight }px` );
    document.documentElement.style.setProperty( '--screen-width', `${ window.innerWidth }px` );

  }

  function setWindow() {

    function refresh() {
      location.reload();
    }

    window.onresize = function() {
      V.setNode( 'body', 'clear' );
      clearTimeout( V.getState( 'throttle' ) );
      V.setState( 'throttle', setTimeout( refresh, 200 ) );
    };

    document.onkeyup = function( e ) {
      if ( e.ctrlKey && e.which == 83 ) {
        console.log( V.getState() );
      }
    };
  }

  function presenter( historyState ) {
    return Promise.resolve( historyState );
  }

  function view(
    historyState,
    path = historyState ? historyState.path : ''
  ) {

    /**
     * Canvas view renders on initial page load, reload and history change
     *
     */

    setNavStates(); // if !serviceNav

    initCanvas(); // if !background

    returningUser(); // if !activeEntity

    V.castRoute( path )
      .then( (
        x,
        status = x.status,
        which = x.data[0]
      ) => {
        if ( ['home'].includes( status ) ) {
          Marketplace.draw();
        }
        else if ( ['market', 'market category'].includes( status ) ) {
          Marketplace.draw( which );
        }
        else if ( ['media', 'media category'].includes( status ) ) {
          Media.draw( which );
        }
        else if ( ['data'].includes( status ) ) {
          Data.draw( which );
        }
        else if ( ['user profile'].includes( status ) ) {
          User.draw();
        }
        else if ( ['user account'].includes( status ) ) {
          Account.draw();
        }
        else if ( ['chat everyone'].includes( status ) ) {
          Chat.draw( which );
        }
        else if ( ['profile'].includes( status ) ) {
          Profile.draw( which );
        }

      } );

  }

  function setNavStates() {
    if( !V.getState( 'serviceNav' ) ) {
      Chat.launch(); // sets navItem & sets socket.on
      Data.launch(); // sets navItem
      Marketplace.launch(); // sets navItem
      Media.launch(); // sets navItem
    }

    if ( V.getSetting( 'demoContent' ) ) {
      ( async () => {
        for ( let i = 0; i < DemoContent.mongoArr.length; i++ ) {
          await V.setEntity( DemoContent.mongoArr[i] );
        }
      } )();
    }
  }

  function initCanvas() {
    if( !V.getNode( 'background' ) ) {

      Background.launch(); // sets node
      Haze.launch(); // sets node
      Feature.launch(); // sets node
      Header.launch(); // sets nodes
      Button.launch(); // sets nodes: hidden buttons
      Page.launch(); //  sets nodes: page elements and adds flick and click handlers for sliding

    }
  }

  function returningUser() {
    if( !V.getState( 'activeEntity' ) ) {
      const returningWallet = V.getCookie( 'lastActiveAddress' );
      const returningUphrase = V.getCookie( 'lastActiveUphrase' );

      if ( returningWallet ) {
        Join.draw( 'authenticate' );
      }
      else if ( returningUphrase ) {
        ( async () => {
          const returningEntity = await V.getEntity( V.castJson( returningUphrase ) );
          V.setState( 'activeEntity', returningEntity.data[0] );
          Join.draw( 'new entity was set up' );
        } )();
      }
      else {
        Join.launch(); // sets node: join button
      }
    }
  }

  /* ============ public methods and exports ============ */

  async function launch() {

    await launchStylesheets();
    await launchScripts();

    V.setPipe(
      setState,
      setWindow,
      setCss,
      setFont,
    )();

  }

  function draw( historyState ) {
    presenter( historyState ).then( historyState => { view( historyState ) } );
  }

  return {
    launch: launch,
    draw: draw
  };

} )();
