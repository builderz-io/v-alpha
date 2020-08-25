const EntityList = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the entity list page
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter() {

    if ( !V.aE() ) {
      return {
        success: false,
        status: ''
      };
    }

    const adminOf = V.aE().adminOf; // query.data[0].adminOf;

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
          entity: V.aE(),
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

  function view( viewData ) {

    let $topcontent, $list;

    if ( viewData.success ) {

      UserComponents.setData( {
        entity: viewData.data[0].entity,
        editable: true
      } );

      $list = CanvasComponents.list( 'narrow' );
      $topcontent = UserComponents.topcontent();

      for ( let i = 0; i < viewData.data[0].entitiesAdmined.length; i++ ) {
        V.setNode( $list, [
          UserComponents.entityListCard( viewData.data[0].entitiesAdmined[i].data[0] )
        ] );
      }

      Page.draw( {
        topcontent: $topcontent,
        listings: $list,
      } );

      VMap.draw( viewData.data[0].mapData );
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

  function draw( path ) {
    preview( path );
    presenter().then( viewData => { view( viewData ) } );
  }

  return {
    draw: draw,
  };

} )();
