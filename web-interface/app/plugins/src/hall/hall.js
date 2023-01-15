const Hall = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the display of hall items
   *
   * Note: Currently for DEMO PURPOSE only
   *
   */

  'use strict';

  const featureVideos = {
    builderz: 'https://youtu.be/kJbto4TISKA',
  };

  let legalDocs;
  const sourceLegalDocs = `${ V.getSetting( 'sourceEndpoint' ) }/plugins/src/hall/legal/legal-${ V.getSetting( 'locale' ) }.json`;
  V.getData( '', sourceLegalDocs, 'api' ).then( res => legalDocs = Object.assign( res.data[0], { networkImprint: V.getSetting( 'imprint' ) } ) );

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      hall: 'Hall',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ================== private methods ================= */

  async function presenter() {

    let vips;
    const now = Date.now();

    /* Get vip cache */

    const cachedVips = V.getCache( 'vips' );

    if (
      cachedVips
      && ( now - cachedVips.timestamp ) < ( V.getSetting( 'entityCachesDuration' ) * 60 * 1000 )
    ) {
      vips = {
        success: true,
        status: 'cachedVips used',
        elapsed: now - cachedVips.timestamp,
        data: V.castJson( cachedVips.data, 'clone' ),
      };
    }
    else {
      V.setCache( 'vips', 'clear' );
      vips = await V.getEntity( 'vip' ).then( res => {
        if ( res.success ) {
          V.setCache( 'vips', res.data );
        }
        return res;
      } );
    }

    if ( vips.success ) {
      const networkE = vips.data.find( item => item.role == 'Network' );
      if ( !networkE ) {
        return vips;
      }
      await V.getEntity( networkE.uuidE ).then( res => {
        if ( res.success ) {
          V.setCache( 'vips', res.data );
        }
        return res;
      } );

      return vips;
    }
    else {
      return {
        success: false,
        status: 'cound not retrieve any entities',
        data: [],
      };
    }
  }

  function view() {

    const cachedVips = V.getCache( 'vips' );

    const $list = CanvasComponents.list();

    if ( cachedVips && cachedVips.data[0] ) {
      setVipTitle();
      cachedVips.data.forEach( cardData => {
        if ( 'Network' == cardData.role ) {
          setNetworkContent( cardData );
          VMap.draw( [cardData] );
        }
        else {
          setVipContent( cardData );
        }
      } );
      setLegalBlabla();
      // setCallToActions();
    }
    else {
      V.setNode( $list, CanvasComponents.notFound( 'vips' ) );
    }

    Page.draw( {
      listings: $list,
      position: 'feature',
    } );

    // View methods

    function setLegalBlabla() {
      const $legalBlabla = HallComponents.legalBlabla( legalDocs );
      V.setNode( $list, $legalBlabla );
    }

    function setNetworkContent( cardData ) { // eslint-disable-line no-inner-declarations
      const $networkLayout = HallComponents.networkLayout( cardData );
      V.setNode( $list, [$networkLayout], 'prepend' );
    }

    function setVipTitle() {
      const $vipTitle = HallComponents.vipTitle();
      V.setNode( $list, $vipTitle );
    }

    function setVipContent( cardData ) { // eslint-disable-line no-inner-declarations
      const $cardContent = MarketplaceComponents.cardContent( cardData );
      const $card = CanvasComponents.card( $cardContent );
      V.setNode( $list, $card );
    }

    function setCallToActions() {
      if ( !V.aE() ) {return}
      const $callsToAction = HallComponents.callsToAction( V.aE() );
      V.setNode( $list, $callsToAction, 'prepend' );
    }
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
    which = V.getSetting( 'featureVideo' ),
  ) {
    return featureVideos[which];
  }

  /* ============ public methods and exports ============ */

  function launch() {
    const navItems = {
      hall: {
        title: ui.hall,
        path: '/network/hall',
        use: {
          // button: 'plus',
          // form: 'new entity',
          // role: 'Hall',
        },
        draw: function() {
          Hall.draw( '/network/hall' );
        },
      },
    };
    V.setNavItem( 'serviceNav', V.getSetting( 'plugins' ).hall.map( item => navItems[item] ) );
  }

  function draw( path ) {
    preview( path );
    setTimeout( delayContentLoad, 2000 );
  }

  V.setState( 'availablePlugins', { hall: launch } );

  return {
    launch: launch,
    draw: draw,
  };

} )();
