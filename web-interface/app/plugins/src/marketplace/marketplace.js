const Marketplace = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the Marketplace
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( whichPath, search ) {

    const whichRole = whichPath ? V.getState( 'serviceNav' )[ whichPath ].use.role : 'all'; // default to 'all'

    let query, isSearch = false;

    const cache = V.getCache( 'preview' );
    const now = Date.now();

    if ( search && search.query ) {
      Object.assign( search, { role: whichRole } );
      isSearch = true;
      query = await V.getQuery( search ).then( res => {
        if ( res.success ) {
          res.data.forEach( entity => {
            entity.type = 'Feature'; // needed to populate entity on map
            entity.properties ? null : entity.properties = {};
          } );
        }
        return res;
      } );
    }
    else if ( cache && !cache.data.length ) {
      const polledCache = await new Promise( resolve => {
        const polling = setInterval( () => {
          const cache = V.getCache( 'preview' );
          if ( cache.data.length ) {
            clearInterval( polling );
            resolve( cache );
          }
        }, 70 );
      } );
      query = {
        success: true,
        status: 'polled cache used',
        elapsed: now - cache.timestamp,
        data: V.castJson( polledCache.data, 'clone' )
      };
    }
    else if (
      cache &&
      ( now - cache.timestamp ) < ( V.getSetting( 'marketCacheDuration' ) * 60 * 1000 )
    ) {
      query = {
        success: true,
        status: 'cache used',
        elapsed: now - cache.timestamp,
        data: V.castJson( cache.data, 'clone' )
      };
    }
    else {
      query = await V.getEntity( 'preview' ).then( res => {
        if ( res.success ) {
          res.data.forEach( entity => {
            entity.path = V.castPathOrId( entity.fullId );
            entity.type = 'Feature'; // needed to populate entity on map
            entity.properties ? null : entity.properties = {};
          } );
          V.setCache( 'preview', res.data );
        }

        return res;
      } );
    }

    if ( query.success ) {

      let filtered = query.data;

      if ( whichRole != 'all' ) {
        filtered = query.data.filter( item => {
          return item.profile.role == whichRole;
        } );
      }

      return {
        success: true,
        status: 'entities retrieved and filtered',
        isSearch: isSearch,
        data: [{
          whichPath: whichPath,
          entities: filtered,
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
        Button.draw( 'search' );
      }

      if ( !( ['/network/all', '/network/members'].includes( viewData.whichPath ) ) ) {
        const $addcard = MarketplaceComponents.entitiesAddCard();
        V.setNode( $slider, $addcard );
      }

      if ( viewData.entities.length > 10 ) {
        const last = viewData.entities.pop();
        const secondLast = viewData.entities.pop();
        setListContent( last );
        setListContent( secondLast );

        setSliderContent( last );

        const hasThumbnail = viewData.entities.filter( item => {return item.thumbnail != undefined} );
        const hasNoThumbnail = viewData.entities.filter( item => { return item.thumbnail === undefined } );

        hasThumbnail.reverse().sort( compareDesc ).forEach( cardData => {
          setListContent( cardData );
        } );

        shuffleArray( hasThumbnail ).forEach( cardData => {
          setSliderContent( cardData );
        } );

        hasNoThumbnail.reverse().forEach( cardData => {
          if ( hasThumbnail.length < 8 ) {
            setSliderContent( cardData );
          }
          setListContent( cardData );
        } );
      }
      else {
        viewData.entities.reverse().forEach( cardData => {
          setSliderContent( cardData );
          setListContent( cardData );
        } );
      }

    }
    else {
      V.setNode( $slider, CanvasComponents.notFound( 'marketplace' ) );
    }

    Page.draw( {
      topslider: $slider,
      listings: $list,
    } );

    VMap.draw( viewData.entities );

    // View methods

    function setListContent( cardData ) { // eslint-disable-line no-inner-declarations
      const $cardContent = MarketplaceComponents.cardContent( cardData );
      const $card = CanvasComponents.card( $cardContent );
      V.setNode( $list, $card );
    }

    function setSliderContent( cardData ) { // eslint-disable-line no-inner-declarations
      const $smallcard = MarketplaceComponents.entitiesSmallCard( cardData );
      V.setNode( $slider, $smallcard );
    }

    function compareDesc( a, b ) { // eslint-disable-line no-inner-declarations
      const c = a.properties ? a.properties.description ? 1 : 0 : 0;
      const d = b.properties ? b.properties.description ? 1 : 0 : 0;
      return c < d ? 1 : c > d ? -1 : 0;
    }

    /* Randomize array in-place using Durstenfeld shuffle algorithm
     * from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     * only for demo
     */

    function shuffleArray( array ) { // eslint-disable-line no-inner-declarations
      for ( let i = array.length - 1; i > 0; i-- ) {
        const j = Math.floor( Math.random() * ( i + 1 ) );
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    }

  } // end view

  function preview( whichPath, search ) {
    const $slider = CanvasComponents.slider();
    for ( let i = 0; i < 12; i++ ) {
      const $ph = MarketplaceComponents.entitiesPlaceholder();
      V.setNode( $slider, $ph );
    }
    if ( whichPath ) {
      Navigation.draw( whichPath );
      if ( !search ) {
        Button.draw( V.getNavItem( 'active', ['serviceNav', 'entityNav'] ).use.button, { delay: 2 } );
      }
    }
    else {
      Navigation.draw();
    }
    Page.draw( {
      topslider: $slider,
      position: whichPath ? 'peek' : 'closed',
    } );

  }

  /* ============ public methods and exports ============ */

  function launch() {
    const navArray = [
      {
        title: 'Local Economy',
        path: '/network/all',
        divertFundsToOwner: false,
        use: {
          button: 'search',
          role: 'all', // 'all' is used here to enable search within all entities
        },
        draw: function( path ) {
          Marketplace.draw( path );
        }
      },
      {
        title: 'People',
        path: '/network/members',
        divertFundsToOwner: false,
        use: {
          button: 'search',
          role: 'member',
        },
        draw: function( path ) {
          Marketplace.draw( path );
        }
      },
      {
        title: 'Businesses',
        path: '/network/businesses',
        use: {
          button: 'search',
          form: 'new entity',
          role: 'business'
        },
        draw: function( path ) {
          Marketplace.draw( path );
        }
      },
      {
        title: 'NGO',
        path: '/network/non-profits',
        use: {
          button: 'search',
          form: 'new entity',
          role: 'nonprofit'
        },
        draw: function( path ) {
          Marketplace.draw( path );
        }
      },
      {
        title: 'Public Sector',
        path: '/network/public-sector',
        use: {
          button: 'search',
          form: 'new entity',
          role: 'publicsector'
        },
        draw: function( path ) {
          Marketplace.draw( path );
        }
      },
      {
        title: 'Anchor Institutions',
        path: '/network/institutions',
        use: {
          button: 'search',
          form: 'new entity',
          role: 'institution'
        },
        draw: function( path ) {
          Marketplace.draw( path );
        }
      },
      {
        title: 'Networks',
        path: '/network/networks',
        use: {
          button: 'search',
          form: 'new entity',
          role: 'network'
        },
        draw: function( path ) {
          Marketplace.draw( path );
        }
      },
      {
        title: 'Skills',
        path: '/network/skills',
        use: {
          button: 'search',
          form: 'new entity',
          role: 'skill'
        },
        draw: function( path ) {
          Marketplace.draw( path );
        }
      },
      {
        title: 'Tasks',
        path: '/network/tasks',
        use: {
          button: 'search',
          form: 'new entity',
          role: 'task'
        },
        draw: function( path ) {
          Marketplace.draw( path );
        }
      },
      // {
      //   title: 'Crowdfunding',
      //   path: '/pools',
      //   use: {
      //     button: 'search',
      //     form: 'new entity',
      //     role: 'pool'
      //   },
      //   draw: function( path ) {
      //     Marketplace.draw( path );
      //   }
      // },
      {
        title: 'Places',
        path: '/network/places',
        use: {
          button: 'search',
          form: 'new entity',
          role: 'place'
        },
        draw: function( path ) {
          Marketplace.draw( path );
        }
      },
      {
        title: 'Events',
        path: '/network/events',
        use: {
          button: 'search',
          form: 'new entity',
          role: 'event'
        },
        draw: function( path ) {
          Marketplace.draw( path );
        }
      }
    ];
    V.setNavItem( 'serviceNav', navArray );

    const routeFundsForRoles = {};
    navArray.forEach( navItem => {
      if ( navItem.divertFundsToOwner === false ) { return }
      routeFundsForRoles[navItem.use.role] = navItem.use.role;
    } );
    V.setState( 'rolesWithReceivingAddress', routeFundsForRoles );
  }

  function draw( whichPath, search ) {
    preview( whichPath, search );
    presenter( whichPath, search ).then( viewData => { view( viewData ) } );
  }

  return {
    launch: launch,
    draw: draw,
  };

} )();
