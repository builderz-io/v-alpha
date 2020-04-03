const Media = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Module driving the display of media items, currently videos
   *
   *
   */

  'use strict';

  V.setNavItem( [
    {
      title: 'Media',
      role: 'media',
      use: {
        button: 'plus search',
        form: 'new entity'
      },
      draw: function() { Media.draw( 'media', { feature: 'https://youtu.be/XQEDw6IKTK8' } ) }
    },
    {
      title: 'Moocs',
      role: 'mooc',
      use: {
        button: 'plus search',
        form: 'new entity'
      },
      draw: function() { Media.draw( 'mooc', { feature: 'https://youtu.be/ygJ4uu4XNM8' } ) }
    }
  ] );

  /* ================== private methods ================= */

  async function presenter( which ) {

    const $listingsUl = MediaComponents.listingsUl();

    const entities = await V.getEntity( which );

    if ( entities.data ) {
      entities.data.forEach( cardData => {
        const $card = MediaComponents.mediaCard( cardData );
        V.setNode( $listingsUl, $card );
      } );
    }
    else {
      V.setNode( $listingsUl, V.sN( {
        t: 'p',
        h: 'No entities found'
      } ) );

    }

    const pageData = {
      // feature: $featureUl,
      listings: $listingsUl,
      // position: 'feature'
    };

    return pageData;
  }

  function featurePresenter( options ) {
    const $featureUl = MediaComponents.featureUl();
    const $videoFeature = MediaComponents.videoFeature( options.feature );
    V.setNode( $featureUl, $videoFeature );

    const pageData = {
      feature: $featureUl,
      // listings: $listingsUl,
      position: 'feature'
    };

    return Promise.resolve( pageData );
  }

  function view( pageData ) {
    Page.draw( pageData );
    if ( pageData.feature ) {
      Feature.draw( pageData.feature );
    }
  }

  function delayContentLoad( which ) {
    presenter( which ).then( viewData => { view( viewData ) } );
  }

  /* ============ public methods and exports ============ */

  function draw( which, options ) {
    featurePresenter( options ).then( viewData => { view( viewData ) } );

    setTimeout( delayContentLoad, 2000, which );

  }

  return {
    draw: draw,
  };

} )();
