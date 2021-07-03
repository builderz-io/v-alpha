const VState = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to manage the app's state
   *
   */

  'use strict';

  document.onkeyup = function( e ) {
    if ( e.ctrlKey && e.which == 83 ) {
      console.log( V.getState() );
    }
    else if ( e.ctrlKey && e.which == 65 ) {
      console.log( V.getCache() );
    }
  };

  const state = {};

  let cache = {};

  /* ================== public methods ================== */

  function getState( which = 'all' ) {
    return which == 'all' ? state : state[which];
  }

  function setState( which, data ) {

    if ( data == 'clear' ) {
      delete state[which];
      return;
    }

    if ( !state[which] ) {
      state[which] = {};
    }

    if ( typeof data == 'object' ) {
      Object.assign( state[which], data );
    }
    else {
      state[which] = data;
    }
  }

  function setActiveEntity( data ) {
    delete data.auth;
    V.setState( 'activeEntity', 'clear' );
    V.setState( 'activeEntity', data );
    console.log( 'set active entity' );

  }

  function aE() {
    return getState( 'activeEntity' );
  }

  function cA() {
    const cA = getLocal( 'last-connected-address' );
    return cA ? cA.replace( /"/g, '' ) : undefined;
  }

  function getViewed( which ) {
    return getCache().viewed
      ? getCache().viewed.data.find( entity =>
        which.includes( ' #' )
          ? entity.fullId == which
          : which.length == V.getSetting( 'uuidStringLength' ) && isNaN( Number( which.slice( -5 ) ) ) // checks whether which is a uuidE
            ? entity.uuidE == which
            : entity.path == which
      )
      : undefined;
  }

  function getLastViewed() {
    return getViewed( getState( 'active' ).lastViewedUuidE );
  }

  function getCache( which ) {
    return which ? cache[which] : cache;
  }

  function setCache( which, data ) {
    if ( data == 'clear' ) {
      if ( which == 'entire cache' ) {
        cache = {};
        return;
      }
      delete cache[which];
      return;
    }

    if ( !cache[which] ) {
      cache[which] = {};
    }

    if ( Array.isArray( data ) ) {
      if ( cache[which].timestamp ) {
        if ( data.length == 1 ) {
          setOrUpdateOneInCache( which, data[0] );
        }
        else {
          cache[which].data = [].concat( cache[which].data, data );
        }
      }
      else {
        setNewCache( which, data );
      }
    }
    else if ( typeof data == 'object' ) {
      if ( cache[which].timestamp ) {
        setOrUpdateOneInCache( which, data );
      }
      else {
        setNewCache( which, [data] );
      }
    }
  }

  function setOrUpdateOneInCache( which, entity ) {
    entity = V.castJson( entity, 'clone' );
    const index = cache[which].data.findIndex( item => item.uuidE == entity.uuidE );

    if ( index != -1 ) {
      if ( 'points' == which ) {
        delete entity.geometry;
      }
      Object.assign( cache[which].data[index], entity );
    }
    else {
      cache[which].data.push( entity );
    }
  }

  function setNewCache( which, data ) {
    const obj = {
      timestamp: Date.now(),
      date: new Date(),
      data: data,
    };
    Object.assign( cache[which], obj );
  }

  function getNavItem( whichItem, whichNav ) {
    if ( whichItem == 'active' ) {
      if( Array.isArray( whichNav ) ) {
        let state;
        for ( let i = 0; i < whichNav.length; i++ ) {
          const query = getState( whichNav[i] )[ getState( 'active' ).navItem ];
          if ( query ) {
            state = query;
            break;
          }
        }
        return state;
      }
      else {
        return getState( whichNav )[ getState( 'active' ).navItem ];
      }
    }
    else {
      return getState( whichNav )[ whichItem ];
    }
  }

  function setNavItem( whichNav, data ) {
    Array.isArray( data ) ? null : data = [ data ];
    data.forEach( item => {
      try {
        const maxLength = 250;
        if ( item.title.length <= maxLength ) {
          const state = getState( whichNav );
          if ( state && state[item.path] ) {
            throw new Error( '"' + item.path + '" already set' );
          }
          const obj = {};

          obj[item.path] = item;
          setState( whichNav, obj );
        }
        else {
          throw new Error( 'Title too long (max ' + maxLength + ', has ' + item.title.length + '): ' + item.title );
        }
      }
      catch ( e ) {
        console.error( e );
      }
    } );

  }

  function getLocal( which ) {
    return localStorage.getItem( which );
  }

  function setLocal( which, data ) {
    if ( data == 'clear' ) {
      localStorage.removeItem( which );
      return;
    }
    localStorage.setItem( which, JSON.stringify( data ) );
  }

  /* ====================== export ====================== */

  V.getState = getState;
  V.setState = setState;
  V.setActiveEntity = setActiveEntity;
  V.aE = aE;
  V.cA = cA;
  V.getViewed = getViewed;
  V.getLastViewed = getLastViewed;
  V.getCache = getCache;
  V.setCache = setCache;
  V.getNavItem = getNavItem;
  V.setNavItem = setNavItem;
  V.getLocal = getLocal;
  V.setLocal = setLocal;

  return {
    getState: getState,
    setState: setState,
    setActiveEntity: setActiveEntity,
    aE: aE,
    cA: cA,
    getCache: getCache,
    setCache: setCache,
    getNavItem: getNavItem,
    setNavItem: setNavItem,
    getLocal: getLocal,
    setLocal: setLocal,
  };

} )();
