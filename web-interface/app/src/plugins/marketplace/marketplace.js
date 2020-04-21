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

    if ( which && which != 'marketplace' ) {
      // force the removal of plural
      whichRole = which.substring( 0, which.length - 1 );
    }

    const query = await V.getEntity( whichRole );

    if ( query.success ) {
      query.data.forEach( entity => {
        mapData.push( { type: 'Feature', geometry: entity.geometry } );
      } );
      return {
        success: true,
        status: 'entities retrieved',
        data: [{
          which: which,
          entities: query.data,
          mapData: mapData,
        }]
      };
    }
    else {
      return {
        success: false,
        status: 'cound not retrieve any entities',
        data: [{
          which: which,
          entities: query.data,
          mapData: mapData,
        }]
      };
    }

  }

  function view( data ) {

    const $slider = CanvasComponents.slider();
    const $list = CanvasComponents.list();

    const viewData = data.data[0];

    if ( data.success ) {
      viewData.entities.reverse().forEach( cardData => {
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

    if ( viewData.which ) {
      Navigation.animate( viewData.which );
    }
    else {
      Navigation.draw( 'all', { reset: true } );
    }

    Page.draw( {
      topslider: $slider,
      listings: $list,
      position: 'peek',
    } );

    VMap.draw( viewData.mapData );
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
    presenter( which ).then( data => { view( data ) } );
  }

  return {
    launch: launch,
    draw: draw,
  };

} )();
