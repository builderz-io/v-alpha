const Marketplace = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the Marketplace
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( whichPath, search ) {

    let whichRole = whichPath
      ? V.getState( 'serviceNav' )[ whichPath ]
        ? V.getState( 'serviceNav' )[ whichPath ].use.role
        : 'all' // fallback to 'all'
      : 'all'; // default to 'all'

    /** Combines 'PersonMapped' with 'Person' */
    whichRole = whichRole.replace( 'Mapped', '' );

    let query, isSearch = false, features;
    const now = Date.now();

    /* Get features cache */

    const cachedFeatures = V.getCache( 'features' );

    if (
      cachedFeatures
      && ( now - cachedFeatures.timestamp ) < ( V.getSetting( 'entityCachesDuration' ) * 60 * 1000 )
    ) {
      features = {
        success: true,
        status: 'cachedFeatures used',
        elapsed: now - cachedFeatures.timestamp,
        data: V.castJson( cachedFeatures.data, 'clone' ),
      };
    }

    /* Get highlights cache */

    const cachedHighlights = V.getCache( 'highlights' );

    /* Mixin a few extra highlighted points on first load */
    if ( !cachedHighlights ) {
      let counter = 0;
      const polledPointsCache = await new Promise( resolve => {
        const polling = setInterval( () => {
          counter += 1;
          const cache = V.getCache( 'permitted' );
          if ( cache && cache.data.length ) {
            clearInterval( polling );
            resolve( cache );
          }
          else if ( counter > 115 ) {
            clearInterval( polling );
            resolve( false );
          }
        }, 70 );
      } );

      if ( polledPointsCache ) {
        V.setCache( 'mixin-highlights', polledPointsCache.data.slice( 0, V.getSetting( 'highlights' ) ).map( item => item.uuidE ) );
      }
    }

    if ( search && search.query ) {
      isSearch = true;

      Object.assign( search, {
        role: whichRole,
        mapState: V.castJson( VMap.getState() ),
      } );

      query = await V.getQuery( search ).then( res => {
        if ( res.success ) {
          V.setCache( 'highlights', res.data );
        }
        return res;
      } );
    }
    else if (
      cachedHighlights
      && ( now - cachedHighlights.timestamp ) < ( V.getSetting( 'entityCachesDuration' ) * 60 * 1000 )
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
      V.setCache( 'features', 'clear' );
      features = await V.getEntity( 'feature' ).then( res => {
        if ( res.success ) {
          V.setCache( 'features', res.data );
        }
        return res;
      } );

      query = await V.getEntity( 'highlight' ).then( res => {
        console.log( res );
        if ( res.success ) {
          V.setCache( 'highlights', res.data );
        }
        return res;
      } );

      if( V.aE() ) {
        let heldUuidEs = V.aE().holderOf.map( item => item.a );

        heldUuidEs = heldUuidEs.length > 15 ? heldUuidEs.slice( 0, 15 ) : heldUuidEs;

        for ( let i = 0; i < heldUuidEs.length; i++ ) {
          await V.getEntity( heldUuidEs[i] ).then( res => {
            if ( res.success ) {
              V.setCache( 'highlights', res.data );
            }
            return res;
          } );
        }
      }
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
          features: features && features.data || features,
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

      // previous version of search form
      // if ( data.isSearch ) {
      //   Form.draw( 'all', { fade: 'out' } );
      //  // Button.draw( 'all', { fade: 'out' } );
      //  // Button.draw( 'search' );
      // }

      if ( !( [undefined, '/network/all'].includes( viewData.whichPath ) ) ) {
        const $addcard = MarketplaceComponents.entitiesAddCard();
        V.setNode( $slider, $addcard );
      }

      if ( viewData.features && viewData.features[0] ) {
        viewData.features.forEach( cardData => {
          setSliderContent( cardData );
        } );
      }
      else {
        shuffleArray( viewData.entities ).forEach( cardData => {
          setSliderContent( cardData );
        } );
      }

      if ( viewData.entities.length > 10 ) {
        const last = viewData.entities.pop();
        const secondLast = viewData.entities.pop();
        setListContent( last );
        setListContent( secondLast );

        // setSliderContent( last );

        const hasThumbnail = viewData.entities.filter( item => item.images.thumbnail != undefined );
        const hasNoThumbnail = viewData.entities.filter( item => item.images.thumbnail === undefined );

        hasThumbnail.reverse().sort( compareDesc ).forEach( cardData => {
          setListContent( cardData );
        } );

        // shuffleArray( hasThumbnail ).forEach( cardData => {
        //   setSliderContent( cardData );
        // } );

        hasNoThumbnail.reverse().forEach( cardData => {
          if ( hasThumbnail.length < 8 ) {
            // setSliderContent( cardData );
          }
          setListContent( cardData );
        } );
      }
      else {
        viewData.entities.reverse().forEach( cardData => {
          // setSliderContent( cardData );
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

    if ( data.isSearch ) {
      VMap.draw( viewData.entities, { isSearch: true } );
    }
    else {
      VMap.draw( viewData.whichRole );
    }

    if ( V.getNode( '.is-single-entity-view' ) ) {

      /**
       The is-single-entity-view class is found in the UI, if the
       user requested to view a single entity.
       In that case highlights must not be placed into the page

       */
      return;
    }

    Page.draw( {
      topslider: $slider,
      listings: $list,
    } );

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
        // Button.draw( V.getNavItem( 'active', ['serviceNav', 'entityNav'] ).use.button, { delay: 2 } );
      }
    }
    else {
      Navigation.draw();
    }

    Chat.drawMessageForm( 'clear' );

    Page.draw( {
      topslider: $slider,
      position: whichPath || search ? 'peek' : 'closed',
      navReset: false,
    } );

  }

  /* ============ public methods and exports ============ */

  function launch() {
    V.setNavItem( 'serviceNav', V.getSetting( 'plugins' ).marketplace.map( item => MarketplaceDefinitions[item] ) );
  }

  function draw( whichPath, search ) {
    preview( whichPath, search );
    presenter( whichPath, search ).then( viewData => { view( viewData ) } );
  }

  V.setState( 'availablePlugins', { marketplace: launch } );

  return {
    launch: launch,
    draw: draw,
  };

} )();
