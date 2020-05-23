const UserComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V User Plugin (display user's tx history and editable profile)
   *
   */

  'use strict';

  // function handleViewAccount( e ) {
  //   e.stopPropagation();
  //   V.setBrowserHistory( { path: '/me/account' } );
  //   Account.draw();
  // }

  function topcontent( fullId ) {
    return V.cN( {
      t: 'div',
      h: [
        V.cN( {
          tag: 'h1',
          class: 'font-bold txt-center pxy',
          html: /* V.i18n( 'Your Profile', 'account' ) + '<br>' + */ fullId,
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
