const Settings = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the entity list page
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
    else {
      return {
        success: true,
        status: 'active entity retrieved',
        data: [{
          which: which,
          entity: V.getState( 'activeEntity' ),
        }]
      };
    }

    /*
    const fullId = V.getState( 'activeEntity' ).fullId;
    const query = await V.getEntity( fullId ); // query again for changes

    if ( query.success ) {
      return {
        success: true,
        status: 'user retrieved',
        data: [{
          which: which,
          entity: query.data[0],
        }]
      };
    }
    else {
      return {
        success: null,
        status: 'cound not retrieve user'
      };
    }
    */
  }

  function view( data ) {

    let $topcontent, $list;

    if ( data.success ) {

      UserComponents.setData( {
        entity: data.data[0].entity,
        editable: true
      } );

      $list = CanvasComponents.list( 'narrow' );
      $topcontent = UserComponents.topcontent();

      V.setNode( $list, [
        UserComponents.appLanguageCard(),
      ] );

      Navigation.draw( data.data[0].which );

      Page.draw( {
        topcontent: $topcontent,
        listings: $list,
        position: 'top',
      } );

      Chat.drawMessageForm( 'clear' );

      // VMap.draw( data.data[0].mapData );
    }
    else {
      Page.draw( {
        topcontent: CanvasComponents.notFound( 'entity' ),
      } );
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
