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

    V.setState( 'menu', {
      // activeTitle: false,
      isHazed: false,

      navTop: V.setPipe( V.getCss, V.castRemToPixel, Number )( '--app-nav-top' ),
      navLeft: V.setPipe( V.getCss, Number )( '--app-nav-left' ),

      entitiesTop: V.setPipe( V.getCss, Number )( '--entities-nav-top' ),
      entitiesLeft: V.setPipe( V.getCss, Number )( '--entities-nav-left' ),

    } );
  }

  function setHead() {

    V.setNode( 'head', {
      tag: 'title',
      html: 'VI UI 2020'
    } );

  }

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

  function view( historyState ) {

    /**
     * View renders on history change
     *
     */

    historyState = historyState ? historyState : historyState = { path: '' };
    initCanvas();

    V.castRoute( historyState.path )
      .then( which => {
        if ( ['home'].includes( which.status ) ) {
          Marketplace.draw(); // no parameter to display all entities and reset navigation
        }
        else if ( ['market', 'market category'].includes( which.status ) ) {
          Marketplace.draw( which.data[0] );
        }
        else if ( ['media', 'media category'].includes( which.status ) ) {
          Media.draw( which.data[0] );
        }
        else if ( ['data'].includes( which.status ) ) {
          Data.draw( which.data[0] );
        }
        else if ( which.status == 'profile' ) {
          Profile.draw( which.data[0] );
        }

      } );
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

      Profile.launch(); // sets navItem "me"
      Chat.launch(); // sets navItem & sets socket.on
      Data.launch(); // sets navItem
      Marketplace.launch(); // sets navItem
      Media.launch(); // sets navItem

      Navigation.launch(); // updates Cookies

      Navigation.draw( 'service-nav', { keep: 3 } );
      Navigation.draw( 'entity-nav', { keep: 5 } );

      if ( V.getSetting( 'demoContent' ) ) {
        ( async () => {
          for ( let i = 0; i < DemoContent.mongoArr.length; i++ ) {
            await V.setEntity( DemoContent.mongoArr[i] );
          }
        } )();
      }

    }
  }

  /* ============ public methods and exports ============ */

  async function launch() {

    await launchScripts();

    V.setPipe(
      setState,
      setHead,
      setCss,
      setFont,
    )();

    return Promise.resolve();

  }

  function draw( historyState ) {
    presenter( historyState ).then( historyState => { view( historyState ) } );
  }

  return {
    launch: launch,
    draw: draw
  };

} )();
