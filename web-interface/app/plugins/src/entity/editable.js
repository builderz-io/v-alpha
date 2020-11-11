const User = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the entity edit page
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( path ) {
    if ( !V.aE() ) {
      return {
        success: false,
        status: ''
      };
    }
    else if ( path == '/me/profile' ) {
      V.setState( 'active', { lastViewed: V.aE().fullId } );

      return {
        success: true,
        status: 'active entity retrieved',
        data: [{
          entity: V.aE(),
          drawNav: true,
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
    else {
      const query = await V.getEntity( V.castPathOrId( path ) );
      if ( query.success ) {

        const entity = query.data[0];

        V.setState( 'active', { lastViewed: entity.fullId } );

        return {
          success: true,
          status: 'entities retrieved',
          data: [{
            entity: entity,
            mapData: {
              type: 'Feature',
              geometry: entity.geometry,
              profile: entity.profile,
              thumbnail: entity.thumbnail,
              path: entity.path
            },
          }]
        };
      }
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
        // InteractionComponents.onboardingCard(),
        UserComponents.entityCard(),
        UserComponents.socialCard(),
        UserComponents.addOrChangeImage(),
        UserComponents.descriptionCard(),
        UserComponents.questionnaireCard(),
        UserComponents.locationCard(),
        UserComponents.preferredLangsCard(),
        UserComponents.financialCard(),
        UserComponents.evmAddressCard(),
        UserComponents.evmReceiverAddressCard(),
        UserComponents.uPhraseCard(),
      ] );

      // if( viewData.data.drawNav ) {
      //   Navigation.draw( viewData.data[0].entity );
      // }

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

    if ( path == '/me/profile' ) {
      Navigation.draw( path );
    }

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
      presenter( path ).then( viewData => { view( viewData ) } );
    }
  }

  return {
    draw: draw,
    launch: launch
  };

} )();
