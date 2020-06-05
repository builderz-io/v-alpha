const Marketplace = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the Marketplace
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( whichPath, search ) {

    // let whichRole;
    //
    // if ( whichPath && whichPath != '/market/all' ) {
    //   // remove the plural from slug
    //   whichRole = whichPath.substring( 0, whichPath.length - 1 ).replace( '/market/', '' );
    //
    // }

    const split = whichPath ? whichPath.split( '/' ) : ['all']; // default to 'all'
    let whichRole = split.pop();
    if ( whichRole != 'all' ) {
      whichRole = whichRole.slice( 0, -1 ); // remove plural
    }

    let query, isSearch = false;
    if ( search && search.query ) {
      Object.assign( search, { role: whichRole } );
      isSearch = true;
      query = await V.getQuery( search );
    }
    else {
      query = await V.getEntity( whichRole );
    }

    const mapData = [];

    if ( query.success ) {
      query.data.forEach( entity => {
        mapData.push( { type: 'Feature', geometry: entity.geometry } );
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
      V.setNode( $slider, CanvasComponents.notFound( 'marketplace items' ) );
    }

    if ( viewData.whichPath ) {
      Navigation.draw( viewData.whichPath );
      Button.draw( V.getNavItem( 'active', ['serviceNav', 'entityNav'] ).use.button, { delay: 2 } );
      // Button.draw( 'plus search', { delay: 2 } );
      // if ( V.getState( 'activeEntity' ) ) {
      // }
      // else {
      //   Button.draw( 'search', { delay: 2 } );
      // }
    }
    else {
      Navigation.draw();
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
        path: '/market/all',
        use: {
          button: 'search',
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
        path: '/events',
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
    presenter( whichPath, search ).then( viewData => { view( viewData ) } );
  }

  return {
    launch: launch,
    draw: draw,
  };

} )();
