const EntityList = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the entity list page
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( which ) {

    // const fullId = V.getState( 'activeEntity' ).fullId;
    // const query = await V.getEntity( fullId ); // query again for changes

    if ( !V.getState( 'activeEntity' ) ) {
      return {
        success: false,
        status: ''
      };
    }

    const adminOf = V.getState( 'activeEntity' ).adminOf; // query.data[0].adminOf;

    const entitiesAdmined = [];
    const mapData = [];

    for ( let i = 0; i < adminOf.length; i++ ) {
      const query = await V.getEntity( adminOf[i] );
      entitiesAdmined.push( query );
      mapData.push( {
        type: 'Feature',
        geometry: query.data[0].geometry,
        profile: query.data[0].profile,
        thumbnail: query.data[0].thumbnail,
        path: query.data[0].path
      } );
    }

    if ( entitiesAdmined[0] && entitiesAdmined[0].success ) {
      return {
        success: true,
        status: 'entities retrieved',
        data: [{
          which: which,
          entity: V.getState( 'activeEntity' ),
          entitiesAdmined: entitiesAdmined,
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

      UserComponents.setData( {
        entity: data.data[0].entity,
        editable: true
      } );

      $list = CanvasComponents.list( 'narrow' );
      $topcontent = UserComponents.topcontent();

      for ( let i = 0; i < data.data[0].entitiesAdmined.length; i++ ) {
        V.setNode( $list, [
          UserComponents.entityListCard( data.data[0].entitiesAdmined[i].data[0] )
        ] );
      }

      // Navigation.draw( data.data[0].which );

      Page.draw( {
        topcontent: $topcontent,
        listings: $list,
        // position: 'top',
      } );

      // Chat.drawMessageForm( 'clear' );

      // VMap.draw( data.data[0].mapData );
    }
    else {
      Page.draw( {
        topcontent: CanvasComponents.notFound( 'entity' ),
      } );
    }
  }
  function preview( path ) {
    Navigation.draw( path );

    Page.draw( {
      position: 'top',
    } );
  }

  /* ============ public methods and exports ============ */

  function draw( which ) {
    preview( which );
    presenter( which ).then( data => { view( data ) } );
  }

  return {
    draw: draw,
  };

} )();
