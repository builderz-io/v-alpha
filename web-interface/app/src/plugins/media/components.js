const MediaComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for Media Plugin
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
    const $li = V.cN( { t: 'li', c: 'pxy w-screen' } );
    const $card = V.cN( {
      t: 'card',
      s: {
        mediacard__container: {
          'height': '230px',
          'max-width': '360px',
          'flex-wrap': 'wrap'
        }
      },
      c: 'mediacard__container flex card-shadow rounded bkg-white pxy',
    } );
    const $title = V.cN( { t: 'p', c: 'font-medium pxy', h: cardData.fullId } );
    const $video = videoFeature( cardData.properties.description );
    V.setNode( $card, $title );
    V.setNode( $card, $video );
    V.setNode( $li, $card );

    return $li;
  }

  function listingsUl() {
    return V.castNode( {
      tag: 'ul',
      classes: 'listings__ul flex flex-wrap content-start justify-evenly overflow-y-scroll',
      setStyle: {
        listings__ul: {
          height: '530px'
        }
      },
    } );
  }

  function featureUl() {
    return V.cN( {
      tag: 'ul'
    } );
  }

  return {
    videoFeature: videoFeature,
    mediaCard: mediaCard,
    listingsUl: listingsUl,
    featureUl: featureUl
  };

} )();
