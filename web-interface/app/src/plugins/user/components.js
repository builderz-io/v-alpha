const UserComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V User Plugin (display user's tx history and editable profile)
   *
   */

  'use strict';

  function handleViewAccount( e ) {
    e.stopPropagation();
    V.setBrowserHistory( { path: '/me/account' } );
    Account.draw();
  }

  function topcontent( fullId ) {
    return V.cN( {
      t: 'div',
      h: [
        V.cN( {
          tag: 'h1',
          class: 'font-bold fs-xl leading-snug txt-center w-screen pxy',
          html: V.i18n( 'Your Profile', 'account' ) + '<br>' + fullId,
        } ),
        V.cN( {
          tag: 'p',
          class: 'pxy txt-center',
          html: V.i18n( 'View account', 'account' ),
          k: handleViewAccount
        } )
      ]
    } );
  }

  function locationCard( entity ) {
    return V.castNode( {
      tag: 'div',
      c: 'contents',
      html: `${entity.properties.location}`
    } );
  }

  return {
    topcontent: topcontent,
    locationCard: locationCard,
  };

} )();
