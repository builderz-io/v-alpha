const Canvas = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module to initialize the app and its "canvas".
  *
  *
  */

  'use strict';

  /* ================== private methods ================= */

  function setStates() {

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

    // ['js.cookie', 'moment', 'velocity'].forEach( vendor => {
    //   V.sN( 'body', {
    //     t: 'script',
    //     a: {
    //       src: 'dist/' + vendor + '.min.js',
    //     }
    //   } );
    // } );

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
    const $map = CanvasComponents.map();
    const $haze = CanvasComponents.haze();
    const $feature = CanvasComponents.feature();
    const $form = CanvasComponents.form();

    /* header nodes */
    const $header = CanvasComponents.header();
    const $balance = CanvasComponents.balance();
    const $entities = CanvasComponents.entities();
    const $nav = CanvasComponents.nav();
    const $back = CanvasComponents.back();
    const $interactions = CanvasComponents.interactions();

    /* page nodes */
    const $page = CanvasComponents.page();
    const $handle = CanvasComponents.handle();
    const $content = CanvasComponents.content();
    const $topSlider = CanvasComponents.topSlider();
    const $listings = CanvasComponents.listings();

    /* place nodes */

    V.setNode( $header, [ $balance, $entities, $nav, $back, $interactions ] );
    V.setNode( $content, [$topSlider, $listings ] );
    V.setNode( $page, [$handle, $content] );

    return [$map, $haze, $feature, $form, $header, $page ];
  }

  function view( appCanvas ) {

    V.setNode( 'body', appCanvas );

  }

  function launchModules() {

    Feature.launch();
    Haze.launch();
    Button.launch();
    Form.launch();
    Join.launch();
    Navigation.launch();
    Page.launch();
    VMap.launch();
    Google.launch();

  }

  function drawFirstViews() {

    Navigation.draw( 'nav', { keep: 3 } );
    Navigation.draw( 'entities', { keep: 5 } );

    setTimeout( Marketplace.draw, 300 );

    if ( V.getSetting( 'demoContent' ) ) {
      setTimeout( launchDemoContent, 1000 ); // sockets should be available after 1 sec...
    }

  }

  function launchDemoContent() {
    let delay = 100;
    DemoContent.mongoArr.forEach( entityData => {
      setTimeout( write, delay );

      function write() {
        delay += 100;
        V.setEntity( 'new entity', entityData, V.getSetting( 'entityLedger' ) );
      }
    } );
  }

  /* ============ public methods and exports ============ */

  function launch() {
    V.setPipe(
      setStates,
      setHead,
      setCss,
      setFont,
      presenter,
      view,
      launchModules,
      drawFirstViews,
    //  join
    )();
  }

  return {
    launch: launch,
  };

} )();
