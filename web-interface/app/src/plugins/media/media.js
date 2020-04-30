const Media = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Module driving the display of media items
   *
   * DEMO PURPOSE only
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( which ) {

    const $list = CanvasComponents.list();

    const entities = await V.getEntity( which == '/media/moocs' ? 'mooc' : 'media' );

    if ( entities.data ) {
      entities.data.forEach( cardData => {
        const $cardContent = MediaComponents.mediaCard( cardData );
        const $card = CanvasComponents.card( $cardContent );
        V.setNode( $list, $card );
      } );
    }
    else {
      V.setNode( $list, CanvasComponents.notFound( 'media items' ) );
    }

    const pageData = {
      which: which,
      listings: $list,
    };

    return pageData;
  }

  function featurePresenter( options ) {
    const $featureUl = MediaComponents.featureUl();
    const $videoFeature = MediaComponents.videoFeature( options && options.feature ? options.feature : 'https://youtu.be/ygJ4uu4XNM8' );
    V.setNode( $featureUl, $videoFeature );

    const pageData = {
      feature: $featureUl,
      position: 'feature'
    };

    return Promise.resolve( pageData );
  }

  function view( pageData ) {
    if ( pageData.which ) {
      Navigation.drawV2( pageData.which );
    }
    Page.draw( pageData );
    if ( pageData.feature ) {
      Feature.draw( pageData.feature );
    }
    // else {
    //   Navigation.drawV2();
    // }
    VMap.draw();
  }

  function delayContentLoad( which ) {
    presenter( which ).then( viewData => { view( viewData ) } );
  }

  /* ============ public methods and exports ============ */

  function launch() {
    V.setNavItem( 'serviceNav', [
      {
        title: 'Media',
        path: '/media',
        use: {
          button: 'plus search',
          form: 'new entity',
          role: 'media',
        },
        draw: function() {
          Media.draw( '/media', { feature: 'https://youtu.be/XQEDw6IKTK8' } );
        }
      },
      {
        title: 'Moocs',
        path: '/media/moocs',
        use: {
          button: 'plus search',
          form: 'new entity',
          role: 'mooc',
        },
        draw: function() {
          Media.draw( '/media/moocs', { feature: 'https://youtu.be/ygJ4uu4XNM8' } );
        }
      }
    ] );
  }

  function draw( which, options ) {
    featurePresenter( options ).then( viewData => { view( viewData ) } );

    setTimeout( delayContentLoad, 2000, which );

  }

  return {
    launch: launch,
    draw: draw,
  };

} )();
