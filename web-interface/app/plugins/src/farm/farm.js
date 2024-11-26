const Farm = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the display of farms, plots and other related data
   *
   */

  'use strict';

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      farm: 'Farm',
      farms: 'Farms',
      plot: 'Plot',
      plots: 'Plots',
      widgetTitle: '',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ================== private methods ================= */

  // async function presenter() {
  //
  //   const poolPoints = V.getCache( 'points' ).data
  //     .filter( item => item.role == 'an' );
  //
  //   if ( !poolPoints ) {
  //     return {
  //       success: false,
  //     };
  //   }
  //
  //   const entities = await V.getEntity( poolPoints.map( item => item.uuidE ) );
  //
  //   return entities;
  // }

  // function view( poolData ) {
  //   const $slider = CanvasComponents.slider();
  //   const $list = CanvasComponents.list();
  //
  //   const $addcard = MarketplaceComponents.entitiesAddCard();
  //   V.setNode( $slider, $addcard );
  //
  //   if ( poolData.data[0] ) {
  //     poolData.data.forEach( cardData => {
  //       const $cardContent = MediaComponents.mediaCard( cardData );
  //       const $card = CanvasComponents.card( $cardContent );
  //       V.setNode( $list, $card );
  //
  //     } );
  //   }
  //   else {
  //     V.setNode( $list, CanvasComponents.notFound( 'pool' ) );
  //   }
  //
  //   Page.draw( {
  //     topslider: $slider,
  //     listings: $list,
  //     // position: 'top',
  //   } );
  // }

  function preview( whichPath ) {
    Navigation.draw( whichPath );
    Page.draw( {
      position: 'peek',
    } );
  }

  /* ============ public methods and exports ============ */

  function launch() {
    const navItems = {
      farms: {
        title: ui.farms,
        path: '/farms',
        use: {
          form: 'new entity',
          role: 'Farm',
          join: 5,
          privacy: 2,
        },
        draw: function( path ) {
          Farm.draw( path );
        },
      },
      plots: {
        title: ui.plots,
        path: '/farms/plots',
        use: {
          form: 'new entity',
          role: 'Plot',
          join: 4,
          privacy: 1,
          noKeyDwnl: true,
        },
        draw: function( path ) {
          Farm.draw( path );
        },
      },
    };
    V.setNavItem( 'serviceNav', V.getSetting( 'plugins' ).farm.map( item => navItems[item] ) );
  }

  function draw( which ) {
    preview( which );
    Marketplace.draw( which );
    // presenter( which ).then( viewData => { view( viewData ) } );
  }

  function drawPlotWidget( display ) {

    const entity = V.getState( 'active' ).lastViewedEntity;

    if ( entity.role != 'Plot' ) { return ''}

    /* replaces preview with retrieved data */

    setTimeout( function datasetRetrieval() {
      SoilCalculatorComponents.drawWidgetContent( display, entity.servicefields );
    }, 800 );

    /* draws the preview */

    const $inner = SoilCalculatorComponents.widget( display );

    // return CanvasComponents.card( $inner, V.getString( ui.widgetTitle ) );
    return $inner;

  }

  V.setState( 'availablePlugins', { farm: launch } );

  return {
    launch: launch,
    draw: draw,
    drawPlotWidget: drawPlotWidget,
  };

} )();
