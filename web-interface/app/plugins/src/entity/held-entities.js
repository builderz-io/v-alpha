const HeldEntities = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Fetch and draw entities held by the active user (holderOf).
   * All held-entity network requests go through this module.
   */

  'use strict';

  function holderUuids() {
    const aE = V.aE();

    return aE && aE.holderOf
      ? aE.holderOf.map( item => item.a ).filter( Boolean )
      : [];
  }

  function cacheIsValid( cached, uuids ) {
    const ttl = V.getSetting( 'entityCachesDuration' ) * 60 * 1000;

    if ( !cached || ( Date.now() - cached.timestamp ) >= ttl ) {
      return false;
    }

    const cachedUuids = cached.data.map( e => e.uuidE ).sort().join( ',' );
    const uuidStr = uuids.slice().sort().join( ',' );

    return cachedUuids === uuidStr;
  }

  async function fetch( options ) {
    options = options || {};
    const uuids = holderUuids();

    if ( !uuids.length ) {
      V.setCache( 'held', 'clear' );
      return { success: false, data: [] };
    }

    const cached = V.getCache( 'held' );

    if ( !options.force && cacheIsValid( cached, uuids ) ) {
      return {
        success: true,
        data: V.castJson( cached.data, 'clone' ),
        status: 'cached',
      };
    }

    const res = await V.getHeldEntities();

    if ( res.success ) {
      const entities = Array.isArray( res.data ) ? res.data : [];
      V.setCache( 'held', entities );
      return Object.assign( {}, res, { data: entities } );
    }

    return res;
  }

  function getFiltered( whichRole ) {
    const cache = V.getCache( 'held' );

    if ( !cache || !cache.data ) {
      return [];
    }

    let filtered = cache.data;

    if ( whichRole != 'all' ) {
      filtered = filtered.filter( item => item.role == whichRole );
    }

    return filtered;
  }

  function draw( whichRole ) {
    VMap.setHeld( whichRole ? whichRole : 'all' );
  }

  async function fetchAndDraw( whichRole ) {
    await fetch();
    draw( whichRole );
  }

  return {
    fetch: fetch,
    draw: draw,
    fetchAndDraw: fetchAndDraw,
    getFiltered: getFiltered,
  };

} )();
