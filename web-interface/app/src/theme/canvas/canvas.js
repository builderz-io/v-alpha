const Canvas = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module to initialize the app and its "canvas".
  *
  *
  */

  'use strict';

  launchScripts();

  /* ================== private methods ================= */

  async function launchScripts() {
    await Promise.all( [
      window.setScript( 'dist/velocity.min.js' ),
      window.setScript( 'dist/moment.min.js' ),
      window.setScript( 'dist/js.cookie.min.js' ),

      window.setScript( 'assets/demo-content/demo-content.js' ),
      window.setScript( 'src/theme/canvas/components.js' ),
      window.setScript( 'src/theme/canvas/feature.js' ),
      window.setScript( 'src/theme/canvas/haze.js' ),
      window.setScript( 'src/theme/canvas/page.js' ),
      window.setScript( 'src/theme/navigation/components.js' ),
      window.setScript( 'src/theme/navigation/navigation.js' ),
      window.setScript( 'src/theme/interaction/components.js' ),
      window.setScript( 'src/theme/interaction/buttons.js' ),
      window.setScript( 'src/theme/interaction/form.js' ),
      window.setScript( 'src/theme/interaction/join.js' ),
      window.setScript( 'src/theme/interaction/modal.js' ),
      window.setScript( 'src/theme/account/components.js' ),
      window.setScript( 'src/theme/account/account.js' ),
      window.setScript( 'src/theme/profile/components.js' ),
      window.setScript( 'src/theme/profile/profile.js' ),
      window.setScript( 'src/theme/chat/components.js' ),
      window.setScript( 'src/theme/chat/chat.js' ),

      window.setScript( 'src/plugins/map/map.js' ),
      window.setScript( 'src/plugins/google/google.js' ),
      window.setScript( 'src/plugins/data/components.js' ),
      window.setScript( 'src/plugins/data/data.js' ),
      window.setScript( 'src/plugins/marketplace/components.js' ),
      window.setScript( 'src/plugins/marketplace/marketplace.js' ),
      window.setScript( 'src/plugins/media/components.js' ),
      window.setScript( 'src/plugins/media/media.js' ),
    ] );
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
      activeTitle: false,
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

    /* make screenhight available to CSS */
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
        'src': 'url(assets/font/IBMPlexSans-Regular.ttf) format(\'truetype\')',
        'font-display': 'fallback',
        'unicode-range': 'U+000-024F'
      },
      '@font-face-2': {
        'font-family': 'IBM Plex Medium',
        'src': 'url(assets/font/IBMPlexSans-Medium.ttf) format(\'truetype\')',
        'font-display': 'fallback',
        'unicode-range': 'U+000-024F'
      },
      '@font-face-3': {
        'font-family': 'IBM Plex Bold',
        'src': 'url(assets/font/IBMPlexSans-Bold.ttf) format(\'truetype\')',
        'font-display': 'fallback',
        'unicode-range': 'U+000-024F'
      }
    } );
  }

  function presenter() {

    /* overall nodes */
    const $background = CanvasComponents.background();
    const $haze = CanvasComponents.haze();
    const $feature = CanvasComponents.feature();
    const $form = CanvasComponents.form();

    /* header nodes */
    const $header = CanvasComponents.header();
    const $balance = CanvasComponents.balance();
    const $entityNav = CanvasComponents.entityNav();
    const $serviceNav = CanvasComponents.serviceNav();
    const $back = CanvasComponents.back();
    const $interactions = CanvasComponents.interactions();

    /* page nodes */
    const $page = CanvasComponents.page();
    const $handle = CanvasComponents.handle();
    const $content = CanvasComponents.content();
    const $topSlider = CanvasComponents.topSlider();
    const $listings = CanvasComponents.listings();

    /* place nodes */

    V.setNode( $header, [ $balance, $entityNav, $serviceNav, $back, $interactions ] );
    V.setNode( $content, [$topSlider, $listings ] );
    V.setNode( $page, [$handle, $content] );

    return [$background, $haze, $feature, $form, $header, $page ];
  }

  function view( appCanvas ) {

    V.setNode( 'body', appCanvas );

  }

  function launchThemeModules() {

    Feature.launch();
    Haze.launch();
    Page.launch();
    Button.launch();
    Form.launch();
    Join.launch();
    Profile.launch();

    // Account and Modal do not need launching

  }

  function launchPlugins() {
    Chat.launch();
    Data.launch();
    Google.launch();
    VMap.launch();
    Marketplace.launch();
    Media.launch();
  }

  function updateNav() {
    Navigation.launch();
  }

  function drawFirstViews() {

    Navigation.draw( 'service-nav', { keep: 3 } );
    Navigation.draw( 'entity-nav', { keep: 5 } );

    setTimeout( Marketplace.draw, 300 );

    if ( V.getSetting( 'demoContent' ) ) {
      setTimeout( launchDemoContent, 1000 ); // sockets should be available after 1 sec...
    }

  }

  async function launchDemoContent() {
    for ( let i = 0; i < DemoContent.mongoArr.length; i++ ) {
      await V.setEntity( DemoContent.mongoArr[i] );
    }
  }

  /* ============ public methods and exports ============ */

  function launch() {
    V.setPipe(
      setState,
      setHead,
      setCss,
      setFont,
      presenter,
      view,
      launchThemeModules,
      launchPlugins,
      updateNav,
      drawFirstViews,
      //  join
    )();

  }

  return {
    launchScripts: launchScripts,
    launch: launch,
  };

} )();
