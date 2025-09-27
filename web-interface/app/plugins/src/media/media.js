const Media = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the display of media items
   *
   * Note: Currently for DEMO PURPOSE only
   *
   */

  'use strict';

  const featureVideos = {
    builderz: 'https://youtu.be/kJbto4TISKA',
  };

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      media: 'Media',
      moocs: 'Moocs',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ================== private methods ================= */

  async function presenter() {
    const pointsCache = V.getCache( 'points' );
    
    if ( !pointsCache || !pointsCache.data ) {
      return {
        success: false,
        message: 'Points cache not available'
      };
    }
  
    const mediaPoints = pointsCache.data
      .filter( item => item.role == 'al' );
  
    if ( !mediaPoints || !mediaPoints.length ) {
      return {
        success: false,
        message: 'No media points found'
      };
    }
  
    const entities = await V.getEntity( mediaPoints.map( item => item.uuidE ) );
  
    return entities;
  }

  function view( mediaData ) {
    const $slider = CanvasComponents.slider();
    const $list = CanvasComponents.list();

    // const $addcard = MarketplaceComponents.entitiesAddCard();
    // V.setNode( $slider, $addcard );

    const $cardPDFContent = MediaComponents.pdfCard();
    const $cardPDF = CanvasComponents.card( $cardPDFContent );

    if ( mediaData?.data?.[0] ) {
      V.setNode( $list, $cardPDF );

      mediaData.data.forEach( cardData => {
        const $cardContent = MediaComponents.mediaCard( cardData );
        const $card = CanvasComponents.card( $cardContent );
        V.setNode( $list, $card );

      } );
    }
    else {
      V.setNode( $list, $cardPDF );

      //V.setNode( $list, CanvasComponents.notFound( 'media' ) );
    }

    Page.draw( {
      topslider: $slider,
      listings: $list,
    } );
  }

  function preview( path ) {
    // Button.draw( V.getNavItem( 'active', 'serviceNav' ).use.button, { delay: 2 } );
    Navigation.draw( path );

    featurePresenterAndView();

    const $list = CanvasComponents.list();

    for ( let i = 0; i < 8; i++ ) {
      const $ph = AccountComponents.accountPlaceholderCard();
      const $card = CanvasComponents.card( $ph );

      V.setNode( $list, $card );
    }

    Page.draw( {
      listings: $list,
      position: getFeatureVideo() ? 'feature' : 'top',
    } );
  }

  function featurePresenterAndView() {
    if ( !getFeatureVideo() ) { return }
    // presenter
    const $featureUl = MediaComponents.featureUl();
    const $videoFeature = MediaComponents.videoFeature( getFeatureVideo() );
    V.setNode( $featureUl, $videoFeature );
    // view
    Feature.draw( $featureUl );
  }

  function delayContentLoad() {
    presenter().then( viewData => { view( viewData ) } );
  }

  function getFeatureVideo(
    which = V.getSetting( 'featureVideo' ),
  ) {
    if ( which.includes( 'http' ) ) { return which }
    return featureVideos[which];
  }

  /* ============ public methods and exports ============ */

  function launch() {
    const navItems = {
      media: {
        title: ui.media,
        path: '/media',
        divertFundsToOwner: true,
        use: {
          form: 'new entity',
          role: 'Media',
        },
        draw: function() {
          Media.draw( '/media', { feature: getFeatureVideo() } );
        },
      },
      moocs: {
        title: ui.moocs,
        path: '/media/moocs',
        divertFundsToOwner: true,
        use: {
          form: 'new entity',
          role: 'Mooc',
        },
        draw: function() {
          Media.draw( '/media/moocs', { feature: getFeatureVideo() } );
        },
      },
    };
    V.setNavItem( 'serviceNav', V.getSetting( 'plugins' ).media.map( item => navItems[item] ) );
  }

  function draw( path ) {
    preview( path );
    setTimeout( delayContentLoad, 2000 );
  }

  V.setState( 'availablePlugins', { media: launch } );

  return {
    launch: launch,
    draw: draw,
  };

} )();
