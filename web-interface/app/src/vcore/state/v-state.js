const VState = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V State
   *
   */

  'use strict';

  const state = {};

  function getState( which ) {
    return which == 'all' ? state : state[which];
  }

  function setState( which, data ) {

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

  function getNavItem( whichItem, whichNav ) {
    if ( whichItem == 'active' ) {
      const converted = V.castCamelCase( getState( 'menu' ).activeTitle );
      return getState( whichNav )[ converted ];
    }
    else {
      return getState( whichNav )[ whichItem ];
    }
  }

  function setNavItem( whichNav, data ) {
    Array.isArray( data ) ? null : data = [ data ];
    data.forEach( item => {
      try {
        const maxLength = 20;
        if ( item.title.length <= maxLength ) {
          const state = getState( whichNav );
          const titleKey = V.castCamelCase( item.title );
          if ( state && state[titleKey] ) {
            throw new Error( item.title + ' already set' );
          }
          const obj = {};

          obj[titleKey] = item;
          setState( whichNav, obj );
        }
        else {
          throw new Error( 'Title too long (max ' + maxLength + ', has ' + item.title.length + '): ' + item.title );
        }
      }
      catch ( e ) {
        console.log( e );
      }
    } );

  }

  function getCookie( which ) {
    return Cookies.get( which );
  }
  function setCookie( which, data ) {
    Cookies.set( which, JSON.stringify( data ) );
  }

  return {
    getState: getState,
    setState: setState,
    getNavItem: getNavItem,
    setNavItem: setNavItem,
    getCookie: getCookie,
    setCookie: setCookie
  };

} )();
