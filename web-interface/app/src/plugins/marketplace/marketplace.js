const Marketplace = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Module driving the Marketplace
   *
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( which ) {

    let whichRole;
    const mapData = [];

    const $slider = CanvasComponents.slider();
    const $list = CanvasComponents.list();

    if ( which && which != 'marketplace' ) {
      // force the removal of plural
      whichRole = which.substring( 0, which.length - 1 );
    }

    const entities = await V.getEntity( whichRole );

    if ( entities.data ) {
      entities.data.reverse().forEach( cardData => {
        mapData.push( { type: 'Feature', geometry: cardData.geometry } );
        const $smallcard = MarketplaceComponents.entitiesSmallCard( cardData );
        const $cardContent = MarketplaceComponents.cardContent( cardData );
        const $card = CanvasComponents.card( $cardContent );
        V.setNode( $slider, $smallcard );
        V.setNode( $list, $card );
      } );
    }
    else {
      V.setNode( $slider, CanvasComponents.notFound( 'marketplace items' ) );
    }

    return {
      which: which,
      mapData: mapData,
      pageData: {
        topslider: $slider,
        listings: $list,
        position: 'peek',
      }
    };
  }

  function view( data ) {
    if ( data.which ) {
      Navigation.animate( data.which );
    }
    else {
      Navigation.draw( 'all', { reset: true } );
    }
    Page.draw( data.pageData );
    VMap.draw( data.mapData );
  }

  /* ============ public methods and exports ============ */

  function launch() {
    V.setNavItem( 'serviceNav', [
      {
        title: 'Marketplace',
        path: '/market',
        use: {
          button: 'search',
        },
        draw: function() {
          Marketplace.draw( 'marketplace' );
        }
      },
      {
        title: 'Jobs',
        path: '/market/jobs',
        use: {
          button: 'plus search',
          form: 'new entity',
          role: 'job',
        },
        draw: function( slug ) {
          Marketplace.draw( slug );
        }
      },
      {
        title: 'Skills',
        path: '/market/skills',
        use: {
          button: 'plus search',
          form: 'new entity',
          role: 'skill',
        },
        draw: function( slug ) {
          Marketplace.draw( slug );
        }
      },
      {
        title: 'Events',
        path: '/market/events',
        use: {
          button: 'plus search',
          form: 'new entity',
          role: 'event',
        },
        draw: function( slug ) {
          Marketplace.draw( slug );
        }
      }
    ] );
  }

  function draw( which ) {
    presenter( which ).then( viewData => { view( viewData ) } );
  }

  return {
    launch: launch,
    draw: draw,
  };

} )();
