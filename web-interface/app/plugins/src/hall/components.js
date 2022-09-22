const HallComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Hall Plugin
   *
   */

  'use strict';

  V.setStyle( {
    'iframe-wrapper': {
      'position': 'relative',
      'padding-bottom': '56.25%',
    },
    'paragraph .iframe-wrapper': {
      'margin-bottom': '20px',
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
    if ( link.match( /youtu/ ) ) {
      return V.castYouTubeIframe( link );
    }
    else if ( link.match( /vimeo/ ) ) {
      return V.castVimeoIframe( link );
    }
  }

  function mediaCard( cardData ) {

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

    const $feature = V.castDescription( cardData.properties.description ).$feature;
    const $descr = V.castDescription( cardData.properties.description ).$description;

    if ( $feature ) {
      V.setNode( $cardContent, [$title, $feature, $descr ] );
    }
    else {
      V.setNode( $cardContent, [$title, $descr ] );
    }

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
