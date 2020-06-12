const MediaComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Media Plugin
   *
   */

  'use strict';

  V.setStyle( {
    'feature__video-wrapper': {
      'position': 'relative',
      'padding-bottom': '56.25%'
    },
    'feature__video-wrapper iframe': {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%'
    }
  } );

  function videoFeature( link ) {
    return V.castNode( {
      t: 'div',
      c: 'feature__video-wrapper w-full',
      h: V.castLinks( link ).iframes
    } );
  }

  function mediaCard( cardData ) {

    const $cardContent = V.cN( {
      t: 'media',
      c: 'contents',
    } );

    const $title = V.cN( {
      t: 'p',
      c: 'font-medium pxy',
      h: cardData.fullId
    } );

    const $video = V.castNode( {
      t: 'div',
      h: V.castLinks( cardData.properties.description.replace( /\n/g, ' <br>' ) ).iframes
    } );

    V.setNode( $cardContent, [$title, $video] );

    return $cardContent;
  }

  function featureUl() {
    return V.cN( {
      tag: 'ul'
    } );
  }

  return {
    videoFeature: videoFeature,
    mediaCard: mediaCard,
    featureUl: featureUl
  };

} )();
