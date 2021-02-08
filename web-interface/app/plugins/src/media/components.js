const MediaComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Media Plugin
   *
   */

  'use strict';

  V.setStyle( {
    'iframe-wrapper': {
      'position': 'relative',
      'padding-bottom': '56.25%',
    },
    'iframe-wrapper iframe': {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
    },
    'media-text a': {
      color: 'rgba(var(--link), 1)',
    },
  } );

  function handleProfileDraw() {
    const path = V.castPathOrId( this.textContent );
    V.setState( 'active', { navItem: path } );
    V.setBrowserHistory( path );
    Profile.draw( path );
  }

  function videoFeature( link ) {
    return V.castNode( {
      t: 'div',
      h: V.castLinks( link ).iframes,
    } );
  }

  function mediaCard( cardData ) {

    const linkedContent = V.castLinks( cardData.properties.description.replace( /\n/g, ' <br>' ) );

    const $cardContent = V.cN( {
      t: 'media',
      c: 'contents',
    } );

    const $title = V.cN( {
      t: 'h2',
      c: 'font-bold fs-l pxy cursor-pointer',
      h: cardData.fullId,
      k: handleProfileDraw,
    } );

    const $video = V.castNode( {
      t: 'div',
      c: 'w-full',
      h: linkedContent.firstIframe,
    } );

    const $text = V.castNode( {
      t: 'div',
      c: 'media-text pt-r',
      h: linkedContent.links,
    } );

    V.setNode( $cardContent, [$title, $video, $text] );

    return $cardContent;
  }

  function featureUl() {
    return V.cN( {
      tag: 'ul',
    } );
  }

  return {
    videoFeature: videoFeature,
    mediaCard: mediaCard,
    featureUl: featureUl,
  };

} )();
