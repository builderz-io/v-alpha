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

  async function presenter() {

    const mediaPoints = V.getCache( 'points' ).data
      .filter( item => item.role == 'al' );

    if ( !mediaPoints ) {
      return {
        success: false,
      };
    }

    const entities = await V.getEntity( mediaPoints.map( item => item.uuidE ) );

    return entities;
  }

  function view( mediaData ) {
    const $list = CanvasComponents.list();
    if ( mediaData.data[0] ) {
      mediaData.data.forEach( cardData => {
        const $cardContent = MediaComponents.mediaCard( cardData );
        const $card = CanvasComponents.card( $cardContent );
        V.setNode( $list, $card );

      } );
    }
    else {
      V.setNode( $list, CanvasComponents.notFound( 'media' ) );
    }

    Page.draw( {
      listings: $list,
      position: 'feature',
    } );
  }

  function preview( path ) {
    Button.draw( V.getNavItem( 'active', 'serviceNav' ).use.button, { delay: 2 } );
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
      position: 'feature',
    } );
  }

  function featurePresenterAndView() {
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
        divertFundsToOwner: true,
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
        divertFundsToOwner: true,
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

  function draw( path ) {
    preview( path );
    setTimeout( delayContentLoad, 2000 );
  }

  V.setState( 'availablePlugins', { media: function() { Media.launch() } } );

  return {
    launch: launch,
    draw: draw,
  };

} )();
