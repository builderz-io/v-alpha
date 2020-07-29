const Marketplace = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the Marketplace
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( whichPath, search ) {

    const split = whichPath ? whichPath.split( '/' ) : ['all']; // default to 'all'
    let whichRole = split.pop();
    if ( !['all', 'media'].includes( whichRole ) ) {
      whichRole = whichRole.slice( 0, -1 ); // remove plural
    }

    let query, isSearch = false;

    const cache = V.getCache( whichRole );
    const now = Date.now();

    if (
      cache &&
      ( now - cache.timestamp ) < ( V.getSetting( 'marketCacheDuration' ) * 60 * 1000 )
    ) {
      query = {
        success: true,
        status: 'cache used',
        elapsed: now - cache.timestamp,
        data: V.castJson( cache.data, 'clone' ).reverse()
      };
    }
    else if ( search && search.query ) {
      Object.assign( search, { role: whichRole } );
      isSearch = true;
      query = await V.getQuery( search );
      V.setCache( whichRole, query.data );
    }
    else {
      query = await V.getEntity( whichRole );
      V.setCache( whichRole, query.data );
    }

    const mapData = [];

    if ( query.success ) {

      query.data.forEach( entity => {
        mapData.push( {
          type: 'Feature',
          geometry: entity.geometry,
          profile: entity.profile,
          thumbnail: entity.thumbnail,
          path: entity.path
        } );
      } );
      return {
        success: true,
        status: 'entities retrieved',
        isSearch: isSearch,
        data: [{
          whichPath: whichPath,
          entities: query.data,
          mapData: mapData,
        }]
      };
    }
    else {
      return {
        success: false,
        status: 'cound not retrieve any entities',
        isSearch: isSearch,
        data: [{
          whichPath: whichPath,
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
      if ( data.isSearch ) {
        Form.draw( 'all', { fade: 'out' } );
        Button.draw( 'all', { fade: 'out' } );
      }
      viewData.entities.reverse().forEach( cardData => {
        const $smallcard = MarketplaceComponents.entitiesSmallCard( cardData );
        const $cardContent = MarketplaceComponents.cardContent( cardData );
        const $card = CanvasComponents.card( $cardContent );
        V.setNode( $slider, $smallcard );
        V.setNode( $list, $card );
      } );
    }
    else {
      if ( data.isSearch ) {
        Button.draw( 'all', { fade: 'out' } );
        Button.draw( 'close query' );
      }
      V.setNode( $slider, CanvasComponents.notFound( 'marketplace items' ) );
    }

    Page.draw( {
      topslider: $slider,
      listings: $list,
    } );

    VMap.draw( viewData.mapData );
  }

  function preview( whichPath ) {
    const $slider = CanvasComponents.slider();
    for ( let i = 0; i < 20; i++ ) {
      const $ph = MarketplaceComponents.entitiesPlaceholder();
      V.setNode( $slider, $ph );
    }
    if ( whichPath ) {
      Navigation.draw( whichPath );
      Button.draw( V.getNavItem( 'active', ['serviceNav', 'entityNav'] ).use.button, { delay: 2 } );
    }
    else {
      Navigation.draw();
    }
    Page.draw( {
      topslider: $slider,
      position: whichPath ? 'peek' : 'closed',
    } );

    // VMap.draw();

  }

  /* ============ public methods and exports ============ */

  function launch() {
    V.setNavItem( 'serviceNav', [
      {
        title: 'Marketplace',
        path: '/market/all',
        use: {
          button: 'search',
        },
        draw: function( path ) {
          Marketplace.draw( path );
        }
      },
      {
        title: 'Places',
        path: '/market/places',
        use: {
          button: 'plus search',
          form: 'new entity',
          role: 'place',
        },
        draw: function( path ) {
          Marketplace.draw( path );
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
        draw: function( path ) {
          Marketplace.draw( path );
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
        draw: function( path ) {
          Marketplace.draw( path );
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
        draw: function( path ) {
          Marketplace.draw( path );
        }
      },
      {
        title: 'Crowdfunding',
        path: '/pools',
        use: {
          button: 'plus search',
          form: 'new entity',
          role: 'pool',
        },
        draw: function( path ) {
          Marketplace.draw( path );
        }
      }
    ] );
  }

  function draw( whichPath, search ) {
    preview( whichPath );
    presenter( whichPath, search ).then( viewData => { view( viewData ) } );
  }

  return {
    launch: launch,
    draw: draw,
  };

} )();
