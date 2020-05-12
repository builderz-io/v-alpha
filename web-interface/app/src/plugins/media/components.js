const MediaComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Media Plugin
   *
   */

  'use strict';

  function videoFeature( link ) {
    const $feature = V.castLinks( link );
    return V.castNode( {
      tag: 'div',
      classes: 'feature__video-wrapper w-full',
      setStyle: {
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
      },
      html: $feature
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

    const $video = videoFeature( cardData.properties.description );

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
