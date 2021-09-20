const VLaunch = ( async function() { // eslint-disable-line no-unused-vars

  /* ============== user interface strings ============== */

  const ui = {
    ledgerLoad: 'Connecting to ledger',
    themeLoad: 'Setting up the theme',
    pluginsLoad: 'Initializing network\'s plugins',
  };

  function getString( string, scope ) {
    return V.i18n( string, 'launch', scope || 'launch content' ) + ' ';
  }

  /**
    * Launch ledger-specific VCore scripts and methods
    */

  V.setNode( 'loader', getString( ui.ledgerLoad ) );

  await VLedger.launch();

  /**
   * Also load the canvas script (the first theme script)
   * to enable theme-initialization
   *
   */

  V.setNode( 'loader', getString( ui.themeLoad ) );

  if( V.getSetting( 'useBuilds' ) ) {
    await Promise.all( [
      V.setScript( V.getSetting( 'sourceEndpoint' ) + '/theme/builds/vtheme.min.js' ),
    ] )
      .then( () => console.log( 'Success loading theme build' ) )
      .catch( () => console.error( 'Error loading theme build' ) );
  }
  else {
    await Promise.all( [
      V.setScript( V.getSetting( 'sourceEndpoint' ) + '/theme/src/canvas/canvas.js' ),
    ] );
  }

  /**
    * Launch the Canvas
    *
    */

  V.setNode( 'loader', getString( ui.pluginsLoad ) );

  clearTimeout( preloaderTimeout );

  await Canvas.launch();

  /**
    * Draw the first view
    *
    */

  Canvas.draw( {
    path: window.location.pathname,
  } );

} )();
