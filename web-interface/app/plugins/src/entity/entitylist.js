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
        status: '',
      };
    }

    let entitiesAdmined = [];

    const cache = V.getCache( 'managedEntities' );
    const now = Date.now();

    if (
      cache &&
      ( now - cache.timestamp ) < ( 1 * 60 * 1000 )
    ) {
      entitiesAdmined = cache.data;
    }
    else {
      for ( let i = 0; i < V.aE().adminOf.length; i++ ) {
        const query = await V.getEntity( V.aE().adminOf[i] );
        entitiesAdmined.push( query.data[0] );
      }

      entitiesAdmined.reverse();
      const own = entitiesAdmined.pop();
      entitiesAdmined.splice( 0, 0, own );

      V.setCache( 'managedEntities', entitiesAdmined );
    }

    if ( entitiesAdmined[0] ) {
      return {
        success: true,
        status: 'entities retrieved',
        data: [{
          entity: V.aE(),
          entitiesAdmined: entitiesAdmined,
        }],
      };
    }
    else {
      return {
        success: null,
        status: 'cound not retrieve entities',
      };
    }
  }

  function view( viewData ) {

    let $topcontent, $list;

    if ( viewData.success ) {

      UserComponents.setData( {
        entity: viewData.data[0].entity,
        editable: true,
      } );

      $list = CanvasComponents.list( 'narrow' );
      $topcontent = UserComponents.topcontent();

      for ( let i = 0; i < viewData.data[0].entitiesAdmined.length; i++ ) {
        V.setNode( $list, [
          UserComponents.entityListCard( viewData.data[0].entitiesAdmined[i] ),
        ] );
      }

      Page.draw( {
        topcontent: $topcontent,
        listings: $list,
      } );

      VMap.draw( viewData.data[0].entitiesAdmined );
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
