const Profile = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module driving the profile pages,
  * including the logged in user profile
  *
  */

  'use strict';

  const DOM = {};

  /* ================== private methods ================= */

  async function presenter( which ) {

    const $topcontent = ProfileComponents.topcontent();
    const $list = CanvasComponents.list( 'narrow' );

    if ( which == 'active entity' ) {
      const aE = V.getState( 'activeEntity' );
      if ( aE ) {
        const eB = await V.getEntityBalance( aE );
        V.setNode( $list, InteractionComponents.entityFound( aE, eB ) );

      }
      else {

        V.setNode( $list, V.cN( { t: 'p', h: 'please join first' } ) );
      }
    }

    const pageData = {
      topcontent: $topcontent,
      listings: $list,
      position: 'top',
    };

    return pageData;
  }

  function view( pageData ) {
    Page.draw( pageData );
  }

  /* ============ public methods and exports ============ */

  function launch() {

    V.setNavItem( 'entityNav', [
      // c = count  d = display Name  l = latest position (menu index)   s = short name   o = online
      {
        cid: '1001',
        c: 0,
        l: -1,
        f: 'Me',
        title: 'Me',
        // role: 'member',
        // draw: function() { Chat.draw() },
        o: true,
        draw: function() {
          V.setBrowserHistory( '/profile/me' );
          Profile.draw( 'me' );
        }
      },
      // {
      //   cid: '1002',
      //   c: 0,
      //   l: -1,
      //   f: 'Me2',
      //   title: 'Me2',
      //   // role: 'member',
      //   // draw: function() { Chat.draw() },
      //   o: true,
      // }
    ] );

  }

  function draw( which ) {
    presenter( which ).then( viewData => { view( viewData ) } );
  }

  return {
    draw: draw,
    launch: launch
  };

} )();
