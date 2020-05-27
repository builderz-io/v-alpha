const Profile = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the entity display page
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( which ) {

    const fullId = V.castPathOrId( which );

    // const aE = V.getState( 'activeEntity' );
    // if ( aE && fullId == aE.fullId ) {
    //   V.setBrowserHistory( { path: '/me/profile' } );
    //   User.draw();
    //   return {
    //     success: false,
    //     status: 'diverted to User.draw'
    //   };
    // }

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
      UserComponents.setData( {
        entity: data.data[0].entity,
        editable: false
      } );

      $list = CanvasComponents.list( 'narrow' );
      $topcontent = UserComponents.topcontent();

      V.setNode( $list, [
        UserComponents.entityCard(),
        UserComponents.locationCard(),
        UserComponents.introCard(),
        UserComponents.preferredLangsCard(),
        UserComponents.financialCard(),
        UserComponents.socialCard(),
        UserComponents.evmAddressCard(),
      ] );

      Navigation.draw( data.data[0].entity );

      Page.draw( {
        topcontent: $topcontent,
        listings: $list,
        position: 'top',
      } );

      Chat.drawMessageForm( 'clear' );

      VMap.draw( data.data[0].mapData );
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
