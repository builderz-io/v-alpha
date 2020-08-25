const User = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the entity edit page
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
    else {
      return {
        success: true,
        status: 'active entity retrieved',
        data: [{
          entity: V.aE(),
          mapData: [
            {
              type: 'Feature',
              geometry: V.aE().geometry,
              profile: V.aE().profile,
              thumbnail: V.aE().thumbnail,
              path: V.aE().path
            }
          ]
        }]
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

      V.setNode( $list, [
        InteractionComponents.onboardingCard(),
        UserComponents.entityCard(),
        UserComponents.socialCard(),
        UserComponents.addOrChangeImage(),
        UserComponents.descriptionCard(),
        UserComponents.locationCard(),
        UserComponents.preferredLangsCard(),
        UserComponents.financialCard(),
        UserComponents.evmAddressCard(),
        UserComponents.evmReceiverAddressCard(),
        UserComponents.uPhraseCard(),
      ] );

      Page.draw( {
        topcontent: $topcontent,
        listings: $list,
      } ).then( () => {
        Google.launch().then( () => { // adds places lib script
          Google.initAutocomplete( 'user' );
        } );
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
    Button.draw( 'all', { fade: 'out' } );

    Navigation.draw( path );

    Page.draw( {
      position: 'top',
    } );
  }

  /* ============ public methods and exports ============ */

  function launch() {
    V.setNavItem( 'userNav', [
      {
        title: 'Transfers',
        path: '/me/transfers',
        use: {
          button: 'search',
        },
        draw: function( path ) {
          Account.draw( path );
        }
      },
      {
        title: 'Profile',
        path: '/me/profile',
        use: {
          button: 'plus search',
        },
        draw: function( path ) {
          User.draw( path );
        }
      },
      {
        title: 'Settings',
        path: '/me/settings',
        use: {
          button: 'plus search',
        },
        draw: function( path ) {
          Settings.draw( path );
        }
      },
      {
        title: 'Entities',
        path: '/me/entities',
        use: {
          button: 'plus search',
        },
        draw: function( path ) {
          EntityList.draw( path );
        }
      },
      {
        title: 'Disconnect',
        path: '/me/disconnect',
        draw: function( path ) {
          User.draw( path );
        }
      }
    ] );
  }

  function draw( path ) {
    if ( path == '/me/disconnect' ) {
      Modal.draw( 'disconnect' );
    }
    else {
      preview( path );
      presenter().then( viewData => { view( viewData ) } );
    }
  }

  return {
    draw: draw,
    launch: launch
  };

} )();
