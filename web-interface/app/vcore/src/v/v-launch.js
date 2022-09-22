const VLaunch = ( async function() { // eslint-disable-line no-unused-vars

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      ledgerLoad: 'Connecting to ledger',
      themeLoad: 'Setting up the theme',
      pluginsLoad: 'Initializing network\'s plugins',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /**
    * Launch language file
    */

  V.setNode( 'loader', 'Loading language ...' );

  await VTranslation.launch();

  /**
    * Launch ledger-specific VCore scripts and methods
    */

  V.setNode( 'loader', V.getString( ui.ledgerLoad ) );

  await VLedger.launch();

  /**
   * Also load the canvas script (the first theme script)
   * to enable theme-initialization
   *
   */

  V.setNode( 'loader', V.getString( ui.themeLoad ) );

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

  V.setNode( 'loader', V.getString( ui.pluginsLoad ) );

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
