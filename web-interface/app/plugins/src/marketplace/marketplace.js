const Marketplace = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the Marketplace
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( whichPath, search ) {

    let whichRole = whichPath ? V.getState( 'serviceNav' )[ whichPath ].use.role : 'all'; // default to 'all'

    /** Combines 'PersonMapped' with 'Person' */
    whichRole = whichRole.replace( 'Mapped', '' );

    let query, isSearch = false;

    const cachedHighlights = V.getCache( 'highlights' );
    const now = Date.now();

    /* Mixin a few extra highlighted points on first load */
    if ( !cachedHighlights ) {
      let counter = 0;
      const polledPointsCache = await new Promise( resolve => {
        const polling = setInterval( () => {
          counter += 1;
          const cache = V.getCache( 'points' );
          if ( cache && cache.data.length ) {
            clearInterval( polling );
            resolve( cache );
          }
          else if ( counter > 299 ) {
            clearInterval( polling );
            resolve( false );
          }
        }, 70 );
      } );

      if ( polledPointsCache ) {
        V.setCache( 'mixin-highlights', polledPointsCache.data.slice( 0, 10 ).map( item => item.uuidE ) );
      }
    }

    if ( search && search.query ) {
      Object.assign( search, { role: whichRole } );
      isSearch = true;
      query = await V.getQuery( search ).then( res => {
        if ( res.success ) {
          V.setCache( 'highlights', res.data );
        }
        return res;
      } );
    }
    else if (
      cachedHighlights
      && ( now - cachedHighlights.timestamp ) < ( V.getSetting( 'highlightsCacheDuration' ) * 60 * 1000 )
    ) {
      query = {
        success: true,
        status: 'cachedHighlights used',
        elapsed: now - cachedHighlights.timestamp,
        data: V.castJson( cachedHighlights.data, 'clone' ),
      };
    }
    else {
      V.setCache( 'highlights', 'clear' );
      query = await V.getEntity( 'highlight' ).then( res => {
        if ( res.success ) {
          V.setCache( 'highlights', res.data );
        }
        return res;
      } );
    }

    if ( query.success ) {

      let filtered = query.data;

      if ( whichRole != 'all' ) {
        filtered = query.data.filter( item => item.role == whichRole );
      }

      return {
        success: true,
        status: 'entities retrieved and filtered',
        isSearch: isSearch,
        data: [{
          whichRole: whichRole,
          whichPath: whichPath,
          entities: filtered,
        }],
      };
    }
    else {
      return {
        success: false,
        status: 'cound not retrieve any entities',
        isSearch: isSearch,
        data: [{
          whichRole: whichRole,
          whichPath: whichPath,
          entities: query.data,
        }],
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

      if ( !( ['/network/all'].includes( viewData.whichPath ) ) ) {
        const $addcard = MarketplaceComponents.entitiesAddCard();
        V.setNode( $slider, $addcard );
      }

      if ( viewData.entities.length > 10 ) {
        const last = viewData.entities.pop();
        const secondLast = viewData.entities.pop();
        setListContent( last );
        setListContent( secondLast );

        setSliderContent( last );

        const hasThumbnail = viewData.entities.filter( item => item.images.thumbnail != undefined );
        const hasNoThumbnail = viewData.entities.filter( item => item.images.thumbnail === undefined );

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
      if ( !( [undefined, '/network/all'].includes( viewData.whichPath ) ) ) {
        const $addcard = MarketplaceComponents.entitiesAddCard();
        V.setNode( $slider, $addcard );
      }
      V.setNode( $slider, CanvasComponents.notFound( 'marketplace' ) );
    }

    Page.draw( {
      topslider: $slider,
      listings: $list,
    } );

    if ( data.isSearch ) {
      VMap.draw( viewData.entities, { isSearch: true } );
    }
    else {
      VMap.draw( viewData.whichRole );
    }

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
      navReset: false,
    } );

  }

  /* ============ public methods and exports ============ */

  function launch() {
    const navItems = {
      tagEnergyTransportation: {
        title: 'Energy & Transportation',
        path: '/tag/energy-transportation',
        use: {
          button: 'search',
          role: 'all',
        },
        draw: function( path ) {
          Marketplace.draw( path, {
            query: '#Energy',
          } );
        },
      },
      tagIndigenousValues: {
        title: 'Indigenous Values',
        path: '/tag/indigenous-values',
        use: {
          button: 'search',
          role: 'all',
        },
        draw: function( path ) {
          Marketplace.draw( path, {
            query: '#IndigenousValues',
          } );
        },
      },
      tagCommonsCommunitiesGovernance: {
        title: 'Commons, Communities & Governance',
        path: '/tag/commons-communities-governance',
        use: {
          button: 'search',
          role: 'all',
        },
        draw: function( path ) {
          Marketplace.draw( path, {
            query: '#Governance',
          } );
        },
      },
      tagEducationCollectiveIntelligence: {
        title: 'Education & Collective Intelligence',
        path: '/tag/education-collective-intelligence',
        use: {
          button: 'search',
          role: 'all',
        },
        draw: function( path ) {
          Marketplace.draw( path, {
            query: '#Education',
          } );
        },
      },
      tagEconomicsCurrencies: {
        title: 'Economics & Currencies',
        path: '/tag/economics-currencies',
        use: {
          button: 'search',
          role: 'all',
        },
        draw: function( path ) {
          Marketplace.draw( path, {
            query: '#Economics',
          } );
        },
      },
      tagCounteringAnthropogenicMindsets: {
        title: 'Countering Anthropogenic Mindsets',
        path: '/tag/countering-anthropogenic-mindsets',
        use: {
          button: 'search',
          role: 'all',
        },
        draw: function( path ) {
          Marketplace.draw( path, {
            query: '#CounteringAnthropogenicMindsets',
          } );
        },
      },
      tagNewNarratives: {
        title: 'New Narratives',
        path: '/tag/new-narratives',
        use: {
          button: 'search',
          role: 'all',
        },
        draw: function( path ) {
          Marketplace.draw( path, {
            query: '#NewNarratives',
          } );
        },
      },
      tagBiosphereRegeneration: {
        title: 'Biosphere Regeneration',
        path: '/tag/biosphere-regeneration',
        use: {
          button: 'search',
          role: 'all',
        },
        draw: function( path ) {
          Marketplace.draw( path, {
            query: '#BiosphereRegeneration',
          } );
        },
      },
      tagCounteringIdentityPolitics: {
        title: 'Countering Identity Politics',
        path: '/tag/countering-identity-politics',
        use: {
          button: 'search',
          role: 'all',
        },
        draw: function( path ) {
          Marketplace.draw( path, {
            query: '#CounteringIdentityPolitics',
          } );
        },
      },
      tagGlobalIntegralHealth: {
        title: 'Global Integral Health',
        path: '/tag/global-integral-health',
        use: {
          button: 'search',
          role: 'all',
        },
        draw: function( path ) {
          Marketplace.draw( path, {
            query: '#GlobalIntegralHealth',
          } );
        },
      },
      tagFoodWater: {
        title: 'Food & Water',
        path: '/tag/food-water',
        use: {
          button: 'search',
          role: 'all',
        },
        draw: function( path ) {
          Marketplace.draw( path, {
            query: '#Food',
          } );
        },
      },
      tagEmergentOther: {
        title: 'Emergent Other',
        path: '/tag/emergent-other',
        use: {
          button: 'search',
          role: 'all',
        },
        draw: function( path ) {
          Marketplace.draw( path, {
            query: '#EmergentOther',
          } );
        },
      },
      tagSystemicApproaches: {
        title: 'Systemic Approaches',
        path: '/tag/systemic-approaches',
        use: {
          button: 'search',
          role: 'all',
        },
        draw: function( path ) {
          Marketplace.draw( path, {
            query: '#SystemicApproaches',
          } );
        },
      },
      localEconomy: {
        title: 'Local Economy',
        path: '/network/all',
        use: {
          button: 'search',
          role: 'all', // 'all' is used here to enable search within all entities
        },
        draw: function( path ) {
          Marketplace.draw( path );
        },
      },
      people: {
        title: 'People',
        path: '/network/people',
        use: {
          button: 'search',
          form: 'new entity',
          role: 'PersonMapped',
        },
        draw: function( path ) {
          Marketplace.draw( path );
        },
      },
      businesses: {
        title: 'Businesses',
        path: '/network/businesses',
        divertFundsToOwner: true,
        use: {
          button: 'search',
          form: 'new entity',
          role: 'Business',
        },
        draw: function( path ) {
          Marketplace.draw( path );
        },
      },
      ngos: {
        title: 'NGO',
        path: '/network/non-profits',
        use: {
          button: 'search',
          form: 'new entity',
          role: 'NGO',
        },
        draw: function( path ) {
          Marketplace.draw( path );
        },
      },
      publicSector: {
        title: 'Public Sector',
        path: '/network/public-sector',
        use: {
          button: 'search',
          form: 'new entity',
          role: 'GOV',
        },
        draw: function( path ) {
          Marketplace.draw( path );
        },
      },
      anchors: {
        title: 'Anchor Institutions',
        path: '/network/institutions',
        use: {
          button: 'search',
          form: 'new entity',
          role: 'Institution',
        },
        draw: function( path ) {
          Marketplace.draw( path );
        },
      },
      networks: {
        title: 'Networks',
        path: '/network/networks',
        use: {
          button: 'search',
          form: 'new entity',
          role: 'Network',
        },
        draw: function( path ) {
          Marketplace.draw( path );
        },
      },
      skills: {
        title: 'Skills',
        path: '/network/skills',
        divertFundsToOwner: true,
        use: {
          button: 'search',
          form: 'new entity',
          role: 'Skill',
        },
        draw: function( path ) {
          Marketplace.draw( path );
        },
      },
      tasks: {
        title: 'Tasks',
        path: '/network/tasks',
        divertFundsToOwner: true,
        use: {
          button: 'search',
          form: 'new entity',
          role: 'Task',
        },
        draw: function( path ) {
          Marketplace.draw( path );
        },
      },
      pools: {
        title: 'Crowdfunding',
        path: '/network/pools',
        use: {
          button: 'search',
          form: 'new entity',
          role: 'ResourcePool',
        },
        draw: function( path ) {
          Marketplace.draw( path );
        },
      },
      places: {
        title: 'Places',
        path: '/network/places',
        use: {
          button: 'search',
          form: 'new entity',
          role: 'Place',
        },
        draw: function( path ) {
          Marketplace.draw( path );
        },
      },
      events: {
        title: 'Events',
        path: '/network/events',
        use: {
          button: 'search',
          form: 'new entity',
          role: 'Event',
        },
        draw: function( path ) {
          Marketplace.draw( path );
        },
      },
    };

    V.setNavItem( 'serviceNav', V.getSetting( 'plugins' ).marketplace.map( item => navItems[item] ) );

  }

  function draw( whichPath, search ) {
    preview( whichPath, search );
    presenter( whichPath, search ).then( viewData => { view( viewData ) } );
  }

  V.setState( 'availablePlugins', { marketplace: function() { Marketplace.launch() } } );

  return {
    launch: launch,
    draw: draw,
  };

} )();
