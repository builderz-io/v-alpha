const DevBootstrap = ( function() {

  'use strict';

  const DEV_UPHRASE = 'dev-soil-tester-key';
  const DEV_PLOT_PATH = '/profile/demo-field-2121';

  function castMongoEntity( doc ) {
    if ( !doc ) { return null }
    return typeof V.castMongoEntity === 'function'
      ? V.castMongoEntity( doc )
      : doc;
  }

  async function loadDevSession() {
    if ( !V.getSetting( 'devSeedPlot' ) ) { return false }

    try {
      await V.waitForLedgerReady( 15000 );
    }
    catch ( e ) {
      console.warn( '[dev-bootstrap] MongoDB socket not ready:', e.message );
      return false;
    }

    let personRes;
    try {
      personRes = await V.getMongoDB( DEV_UPHRASE, 'entity by uPhrase' );
    }
    catch ( e ) {
      console.warn( '[dev-bootstrap] MongoDB not connected:', e );
      return false;
    }

    if ( !personRes || !personRes.success || !personRes.data[0] ) {
      console.warn(
        '[dev-bootstrap] Dev user not found. Run: cd mongodb-entity-store && node seed-dev-plot.js',
      );
      return false;
    }

    const person = castMongoEntity( personRes.data[0] );
    let plot = null;

    if ( person.holderOf && person.holderOf[0] ) {
      const plotRef = person.holderOf[0];
      const plotRes = await V.getMongoDB(
        plotRef.fullId || plotRef.a,
        plotRef.fullId ? 'entity by fullId' : 'entity by uuidE',
      );
      if ( plotRes.success && plotRes.data[0] ) {
        plot = castMongoEntity( plotRes.data[0] );
      }
    }

    if ( !plot ) {
      const plotRes = await V.getMongoDB( 'Demo Field #2121', 'entity by fullId' );
      if ( plotRes.success && plotRes.data[0] ) {
        plot = castMongoEntity( plotRes.data[0] );
      }
    }

    if ( !plot ) {
      console.warn( '[dev-bootstrap] Demo plot not found in database.' );
      return false;
    }

    V.setActiveEntity( person );
    V.setState( 'active', {
      lastViewed: plot.fullId,
      lastViewedUuidE: plot.uuidE,
      lastViewedUuidP: plot.uuidP,
      lastViewedRoleCode: plot.roleCode,
      lastLngLat: plot.geometry.coordinates,
      lastViewedEntity: plot,
    } );
    V.setCache( 'viewed', [plot] );
    V.setCache( 'points', [plot] );

    console.log( '[dev-bootstrap] Loaded', person.fullId, '→', plot.fullId );
    return plot;
  }

  function verifyCastRoleGroup() {
    if ( V.castRole( 'Group' ) !== 'aq' || V.castRole( 'aq' ) !== 'Group' ) {
      console.error( '[dev-bootstrap] castRole Group/aq mapping failed' );
      return false;
    }
    return true;
  }

  async function launch() {
    verifyCastRoleGroup();

    const plot = await loadDevSession();
    if ( !plot ) { return }

    const goPlot = () => {
      V.setBrowserHistory( plot.path );
      Profile.draw( plot.path );
    };

    const path = window.location.pathname;

    if ( path === '/groups' ) {
      V.setState( 'active', { navItem: '/groups' } );
      Group.draw( '/groups' );
      return;
    }

    if ( path === '/' || path === '' ) {
      goPlot();
    }
  }

  return { launch, loadDevSession, castMongoEntity };

} )();
