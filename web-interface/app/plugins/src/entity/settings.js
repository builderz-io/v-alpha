const Settings = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the app settings page
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( path ) {

    if ( !V.aE() ) {
      return {
        success: false,
        status: '',
      };
    }
    else {
      return {
        success: true,
        status: 'active entity retrieved',
        data: [{
          path: path,
          entity: V.aE(),
        }],
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

      $list = CanvasComponents.list();
      $topcontent = UserComponents.topcontent();

      V.setNode( $list, [
        UserComponents.appLanguageCard(),
      ] );

      Navigation.draw( viewData.data[0].path );

      Page.draw( {
        topcontent: $topcontent,
        listings: $list,
        position: 'top',
      } );

    }
    else {
      Page.draw( {
        topcontent: CanvasComponents.notFound( 'entity' ),
      } );
    }
  }

  /* ============ public methods and exports ============ */

  function draw( path ) {
    presenter( path ).then( viewData => { view( viewData ) } );
  }

  return {
    draw: draw,
  };

} )();
