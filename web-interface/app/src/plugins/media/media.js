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
      draw: function() { Media.draw( { role: 'media', feature: 'https://youtu.be/XQEDw6IKTK8' } ) }
    },
    {
      title: 'Moocs',
      role: 'mooc',
      use: {
        button: 'plus search',
        form: 'new entity'
      },
      draw: function() { Media.draw( { role: 'mooc', feature: 'https://youtu.be/ygJ4uu4XNM8' } ) }
    }
  ] );

  /* ================== private methods ================= */

  async function presenter( options ) {

    const $listingsUl = MediaComponents.listingsUl();

    const entities = await V.getEntity( options, 'by role' );

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

  function previewPresenter( options ) {
    const $featureUl = MediaComponents.featureUl();
    const $videoFeature = MediaComponents.videoFeature( options.feature );
    V.setNode( $featureUl, $videoFeature );

    const pageData = {
      feature: $featureUl,
      // listings: $listingsUl,
      position: 'feature'
    };

    return pageData;
  }

  function view( pageData ) {
    Page.draw( pageData );
    if ( pageData.feature ) {
      Feature.draw( pageData.feature );
    }
  }

  /* ============ public methods and exports ============ */

  function draw( options ) {
    V.setPipe(
      previewPresenter,
      view
    )( options );

    setTimeout( lazyLoadContent, 2000 );

    function lazyLoadContent() {
      presenter( options ).then( viewData => { view( viewData ) } );
    }
  }

  return {
    draw: draw,
  };

} )();
