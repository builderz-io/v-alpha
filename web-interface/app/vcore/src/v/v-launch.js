const VLaunch = ( async function() { // eslint-disable-line no-unused-vars

  // await kickAss();
  //
  // async function kickAss() {

  /**
    * Launch ledger-specific VCore scripts and methods,
    *
    */

  V.setNode( 'loader', V.i18n( 'Connecting to ledger', 'app' ) );

  await VLedger.launch();

  /**
   * Also load the canvas script (the first theme script)
   * to enable theme-initialization
   *
   */

  V.setNode( 'loader', V.i18n( 'Setting up the theme', 'app' ) );

  if( V.getSetting( 'useBuilds' ) ) {
    await Promise.all( [
      V.setScript( '/theme/builds/vtheme.min.js' )
    ] );
    console.log( '*** theme builds loaded ***' );
  }
  else {
    await Promise.all( [
      V.setScript( '/theme/src/canvas/canvas.js' ),
    ] );
  }

  /**
    * Launch the Canvas
    *
    */

  V.setNode( 'loader', V.i18n( 'Initializing network\'s plugins', 'app' ) );

  await Canvas.launch();

  /**
    * Draw the first view
    *
    */

  Canvas.draw( {
    path: window.location.pathname
  } );

  // }

} )();
