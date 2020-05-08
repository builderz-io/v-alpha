const ProfileComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for Profiles
   *
   */

  'use strict';

  function topcontent( fullId ) {
    return V.sN( {
      t: 'h2',
      c: 'font-bold fs-l leading-snug txt-center w-screen pxy',
      h: `Profile<br>${ fullId }`
    } );
  }

  function locationCard( entity ) {
    return V.castNode( {
      tag: 'div',
      c: 'contents',
      html: `${entity.properties.location}`
    } );
  }

  function brightIdCard( entity ) {
    return V.castNode( {
      tag: 'div',
      c: 'flex w-full items-center justify-evenly',
      html: `<p>Connect your</p> <a href="brightid://link-verification/http:%2f%2fnode.brightid.org/VALUE/${ entity.private.base64Url }"><img src="/assets/img/brightID-logo_sm.png"></a>`
    } );
  }

  return {
    topcontent: topcontent,
    locationCard: locationCard,
    brightIdCard: brightIdCard
  };

} )();
