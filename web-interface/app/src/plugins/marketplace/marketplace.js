const Marketplace = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Module driving the Marketplace
   *
   *
   */

  'use strict';

  V.setNavItem( [
    {
      title: 'Marketplace',
      use: {
        button: 'search',
      },
      draw: function() { Marketplace.draw() }
    },
    {
      title: 'Jobs',
      role: 'job',
      use: {
        button: 'plus search',
        form: 'new entity'
      },
      draw: function() {  Marketplace.draw( { role: 'job' } ) }
    },
    {
      title: 'Skills',
      role: 'skill',
      use: {
        button: 'plus search',
        form: 'new entity'
      },
      draw: function() {  Marketplace.draw( { role: 'skill' } ) }
    },
    {
      title: 'Events',
      role: 'event',
      use: {
        button: 'plus search',
        form: 'new entity'
      },
      draw: function() {  Marketplace.draw( { role: 'event' } ) }
    }
  ] );

  /* ================== private methods ================= */

  async function presenter( options ) {

    const mapData = [];

    const $topsliderUl = MarketplaceComponents.topSliderUl();
    const $listingsUl = MarketplaceComponents.listingsUl();

    const entities = await V.getEntity( 'by role', options );

    if ( entities.data ) {
      entities.data.reverse().forEach( cardData => {
        mapData.push( { type: 'Feature', geometry: cardData.geometry } );
        const $smallcard = MarketplaceComponents.entitiesSmallCard( cardData );
        const $card = MarketplaceComponents.entitiesCard( cardData );
        V.setNode( $topsliderUl, $smallcard );
        V.setNode( $listingsUl, $card );
      } );
    }
    else {
      V.setNode( $topsliderUl, {
        t: 'p',
        h: 'No entities found'
      } );

    }

    return {
      mapData: mapData,
      pageData: {
        topslider: $topsliderUl,
        listings: $listingsUl,
        position: 'peek',
      }
    };
  }

  function view( data ) {
    Page.draw( data.pageData );
    VMap.draw( data.mapData );
  }

  /* ============ public methods and exports ============ */

  function draw( options ) {
    presenter( options ).then( viewData => { view( viewData ) } );
  }

  function drawHelloWorld() {
    Page.draw( {
      topcontent: V.cN( {
        tag: 'p',
        html: 'I am feeling happy!'
      } ),
      position: 'top'
    } );

    V.setMessage( 'Peter', 'Hi server 5?' );
  }

  return {
    draw: draw,
    drawHelloWorld: drawHelloWorld
  };

} )();
