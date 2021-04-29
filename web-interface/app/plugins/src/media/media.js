const Media = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the display of media items
   *
   * Note: Currently for DEMO PURPOSE only
   *
   */

  'use strict';

  const featureVideos = {
    faithfinance: 'https://vimeo.com/236725407',
    builderz: 'https://youtu.be/kJbto4TISKA',
  };

  /* ================== private methods ================= */

  async function presenter( which ) {

    const $list = CanvasComponents.list();

    const entities = await V.getEntity( which == '/media/moocs' ? 'Mooc' : 'MediaObject' );

    if ( entities.data ) {
      entities.data.forEach( cardData => {
        const $cardContent = MediaComponents.mediaCard( cardData );
        const $card = CanvasComponents.card( $cardContent );
        V.setNode( $list, $card );
      } );
    }
    else {
      V.setNode( $list, CanvasComponents.notFound( 'media' ) );
    }

    const pageData = {
      which: which,
      listings: $list,
    };

    return pageData;
  }

  function featurePresenter( options ) {
    const $featureUl = MediaComponents.featureUl();
    const $videoFeature = MediaComponents.videoFeature( options && options.feature ? options.feature : getFeatureVideo() );
    V.setNode( $featureUl, $videoFeature );

    const pageData = {
      feature: $featureUl,
      position: 'feature',
    };

    return Promise.resolve( pageData );
  }

  function view( pageData ) {
    if ( pageData.which ) {
      // Navigation.draw( pageData.which );
      Button.draw( V.getNavItem( 'active', 'serviceNav' ).use.button, { delay: 2 } );
    }
    if ( pageData.feature ) {
      Feature.draw( pageData.feature );
    }
    // else {
    //   Navigation.draw();
    // }
    Page.draw( pageData );
    VMap.draw();
  }

  function preview( path ) {
    // Button.draw( V.getNavItem( 'active', 'serviceNav' ).use.button, { delay: 2 } );
    Navigation.draw( path );

    // Page.draw( {
    //   position: 'feature',
    // } );
  }

  function delayContentLoad( which ) {
    presenter( which ).then( viewData => { view( viewData ) } );
  }

  function getFeatureVideo(
    which = V.getSetting( 'featureVideo' )
  ) {
    return featureVideos[which];
  }

  /* ============ public methods and exports ============ */

  function launch() {
    const navItems = {
      media: {
        title: 'Media',
        path: '/media',
        use: {
          button: 'plus search',
          form: 'new entity',
          role: 'MediaObject',
        },
        draw: function() {
          Media.draw( '/media', { feature: getFeatureVideo() } );
        },
      },
      moocs: {
        title: 'Moocs',
        path: '/media/moocs',
        use: {
          button: 'plus search',
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

  function draw( which, options ) {
    preview( which );

    featurePresenter( options ).then( viewData => { view( viewData ) } );

    setTimeout( delayContentLoad, 2000, which );

  }

  V.setState( 'availablePlugins', { media: function() { Media.launch() } } );

  return {
    launch: launch,
    draw: draw,
  };

} )();
