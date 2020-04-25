const Canvas = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Module to initialize the app and its "canvas".
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function launchScripts() {
    await Promise.all( [

      V.setScript( '/assets/demo-content/demo-content.js' ),

      V.setScript( '/src/theme/canvas/components.js' ),
      V.setScript( '/src/theme/canvas/background.js' ),
      V.setScript( '/src/theme/canvas/haze.js' ),
      V.setScript( '/src/theme/canvas/feature.js' ),
      V.setScript( '/src/theme/canvas/header.js' ),
      V.setScript( '/src/theme/canvas/page.js' ),
      V.setScript( '/src/theme/navigation/components.js' ),
      V.setScript( '/src/theme/navigation/navigation.js' ),
      V.setScript( '/src/theme/interaction/components.js' ),
      V.setScript( '/src/theme/interaction/button.js' ),
      V.setScript( '/src/theme/interaction/form.js' ),
      V.setScript( '/src/theme/interaction/join.js' ),
      V.setScript( '/src/theme/interaction/modal.js' ),

      V.setScript( '/src/plugins/account/components.js' ),
      V.setScript( '/src/plugins/account/account.js' ),
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

  function setState() {

    V.setState( 'active', {
      registeredNav: ['service-nav', 'entity-nav'],
    } );
    V.setState( 'screen', {
      height: Number( window.innerHeight ),
      width: Number( window.innerWidth )
    } );
    V.setState( 'page', {
      height: V.getCss( '--page-position-peek' ),
      top: V.setPipe( V.getCss, V.castRemToPixel )( '--page-position-top' ),
      topSelected: V.setPipe( V.getCss, V.castRemToPixel )( '--page-position-top-selected' ),
      peek: V.getCss( '--page-position-peek' ),
      closed: V.getCss( '--page-position-closed' ),
    } );

    /* calculate page size for the feature and top position according to screen dimentions */
    const state = V.getState( 'all' );
    V.setState( 'page', { topCalc: state.screen.height - state.page.top } );
    V.setState( 'page', { topSelectedCalc: state.screen.height - state.page.topSelected } );
    V.setState( 'page', { featureCalc: Math.floor( state.screen.height - state.page.topSelected - state.screen.width * 9/16 ) } );

    V.setState( 'header', {
      // activeTitle: false,
      isHazed: false,

      navTop: V.setPipe( V.getCss, V.castRemToPixel, Number )( '--app-nav-top' ),
      navLeft: V.setPipe( V.getCss, Number )( '--app-nav-left' ),

      entitiesTop: V.setPipe( V.getCss, Number )( '--entities-nav-top' ),
      entitiesLeft: V.setPipe( V.getCss, Number )( '--entities-nav-left' ),

    } );
  }

  // function setHead() {
  //
  //   V.setNode( 'head', {
  //     tag: 'title',
  //     html: 'VI UI 2020'
  //   } );
  //
  // }

  function setCss() {

    /* make screen size available to CSS */
    document.documentElement.style.setProperty( '--screen-height', `${ window.innerHeight }px` );
    document.documentElement.style.setProperty( '--screen-width', `${ window.innerWidth }px` );

  }

  function setFont() {

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
      Profile.launch(); // sets navItem "me"
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
      Join.launch(); // sets node: join button
      Page.launch(); //  sets nodes: page elements and adds flick and click handlers for sliding

      // Navigation.launch(); // updates Cookies
      // Navigation.draw( 'service-nav', { keep: 3 } );
      // Navigation.draw( 'entity-nav', { keep: 5 } );

    }
  }

  /* ============ public methods and exports ============ */

  async function launch() {

    V.setPipe(
      setState,
      // setHead,
      setCss,
      setFont,
    )();

    await launchScripts();

  }

  function draw( historyState ) {
    presenter( historyState ).then( historyState => { view( historyState ) } );
  }

  return {
    launch: launch,
    draw: draw
  };

} )();
