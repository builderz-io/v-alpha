const Marketplace = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Module driving the Marketplace
   *
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( which ) {

    const mapData = [];

    const $slider = CanvasComponents.slider();
    const $list = CanvasComponents.list();

    if ( which ) {
      // force the removal of plural
      which = which.substring( 0, which.length - 1 );
    }

    const entities = await V.getEntity( which );

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
      mapData: mapData,
      pageData: {
        topslider: $slider,
        listings: $list,
        position: 'peek',
      }
    };
  }

  function view( data ) {
    Page.draw( data.pageData );
    VMap.draw( data.mapData );
  }

  /* ============ public methods and exports ============ */

  function launch() {
    V.setNavItem( 'serviceNav', [
      {
        title: 'Marketplace',
        use: {
          button: 'search',
        },
        draw: function() {
          V.setBrowserHistory( '/market' );
          Marketplace.draw();
        }
      },
      {
        title: 'Jobs',
        role: 'job',
        use: {
          button: 'plus search',
          form: 'new entity'
        },
        draw: function() {
          V.setBrowserHistory( '/market/jobs' );
          Marketplace.draw( 'jobs' );
        }
      },
      {
        title: 'Skills',
        role: 'skill',
        use: {
          button: 'plus search',
          form: 'new entity'
        },
        draw: function() {
          V.setBrowserHistory( '/market/skills' );
          Marketplace.draw( 'skills' );
        }
      },
      {
        title: 'Events',
        role: 'event',
        use: {
          button: 'plus search',
          form: 'new entity'
        },
        draw: function() {
          V.setBrowserHistory( '/market/events' );
          Marketplace.draw( 'events' );
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
