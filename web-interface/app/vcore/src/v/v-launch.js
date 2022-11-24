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

  const returningUser = async () => V.setAuth()
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
        return true;
      }
      else {
        throw new Error( 'could not get entity after set auth' );
      }
    } )
    .catch( err =>  {
      V.setTempRefreshToken(); // clears temp_refresh
      console.log( 'auth unsuccessful -', err );
    } );

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

  await returningUser();

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
