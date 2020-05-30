const Search = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to search entities
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( data ) {

    // const aE = V.getState( 'activeEntity' );
    // if ( aE && fullId == aE.fullId ) {
    //   V.setBrowserHistory( { path: '/me/profile' } );
    //   User.draw();
    //   return {
    //     success: false,
    //     status: 'diverted to User.draw'
    //   };
    // }

    const query = await V.getQuery( data );

    const mapData = [];

    if ( query.success ) {
      for ( let i = 0; i < query.data.length; i++ ) {
        mapData.push( { type: 'Feature', geometry: query.data[i].geometry } );
      }

      return {
        success: true,
        status: 'entities retrieved',
        data: [{
          which: '/search',
          entities: query.data,
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
    console.log( viewData );
  }

  /* ============ public methods and exports ============ */

  function draw( data ) {
    presenter( data ).then( viewData => { view( viewData ) } );
  }

  return {
    draw: draw
  };

} )();
