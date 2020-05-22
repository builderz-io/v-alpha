const User = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the user profile/edit page
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( which ) {

    if ( !V.getState( 'activeEntity' ) ) {
      return {
        success: false,
        status: ''
      };
    }

    const fullId = V.getState( 'activeEntity' ).fullId;
    const query = await V.getEntity( fullId );

    const mapData = [];

    if ( query.success ) {

      mapData.push( { type: 'Feature', geometry: query.data[0].geometry } );

      return {
        success: true,
        status: 'entities retrieved',
        data: [{
          which: which,
          entity: query.data[0],
          mapData: mapData,
        }]
      };
    }
    else {
      return {
        success: null,
        status: 'cound not retrieve entities'
      };
    }
  }

  function view( data ) {

    let $topcontent, $list;

    if ( data.success ) {
      const entity = data.data[0].entity;

      $topcontent = UserComponents.topcontent( entity.fullId );
      $list = CanvasComponents.list( 'narrow' );
      const $loc = UserComponents.locationCard( entity );
      const $locCard = CanvasComponents.card( $loc );
      const $onboardingCard = Join.onboardingCard();

      V.setNode( $list, [ $onboardingCard, $locCard ] );

      Navigation.draw();

      Page.draw( {
        topcontent: $topcontent,
        listings: $list,
        position: 'top',
      } );

      Chat.drawMessageForm( 'clear' );

      VMap.draw( data.mapData );
    }
    else if ( data.success === null ) {
      Page.draw( {
        topcontent: CanvasComponents.notFound( 'entity' ),
      } );
    }
    else {
      Marketplace.draw();
    }
  }

  /* ============ public methods and exports ============ */

  function draw( which ) {
    presenter( which ).then( data => { view( data ) } );
  }

  return {
    draw: draw,
  };

} )();
