const VRoute = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module for routing
   *
   */

  'use strict';

  window.onpopstate = () => {
    V.setState( 'active', window.history.state );
    Canvas.draw( window.history.state );
  };

  const routes = [
    {
      path: '',
      action: () => ( {
        status: 'home',
        data: [ '/network/all' ],
      } ),
    },
    {
      path: '/profile',
      children: [
        {
          path: '/:rawentity',
          action: ( context ) => ( {
            status: 'profile',
            data: [ context.params.rawentity ],
          } ),
        },
      ],
    },
    {
      path: '/chat',
      children: [
        {
          path: '/everyone',
          action: () => ( {
            status: 'chat everyone',
            data: [ '/chat/everyone' ],
          } ),
        },
        {
          path: '/:id',
          action: ( context ) => ( {
            status: 'chat id',
            data: [ context.params.id ],
          } ),
        },
      ],
    },
    {
      path: '/network',
      children: [
        {
          path: '',
          action: () => ( {
            status: 'market',
            data: [ '/network' ],
          } ),
        },
        {
          path: '/:id',
          action: ( context ) => ( {
            status: 'market category',
            data: [ '/network/' + context.params.id ],
          } ),
        },
      ],
    },
    {
      path: '/me',
      children: [
        {
          path: '/transfers',
          action: () => ( {
            status: 'user account',
            data: [ '/me/transfers' ],
          } ),
        },
        {
          path: '/profile',
          action: () => ( {
            status: 'user profile',
            data: [ '/me/profile' ],
          } ),
        },
        {
          path: '/settings',
          action: () => ( {
            status: 'user settings',
            data: [ '/me/settings' ],
          } ),
        },
        {
          path: '/entities',
          action: () => ( {
            status: 'user entities',
            data: [ '/me/edit' ],
          } ),
        },
      ],
    },
    {
      path: '/media',
      children: [
        {
          path: '',
          action: () => ( {
            status: 'media',
            data: [ '/media' ],
          } ),
        },
        {
          path: '/:id',
          action: ( context ) => ( {
            status: 'media category',
            data: [ '/media/' + context.params.id ],
          } ),
        },
      ],
    },
    {
      path: '/data',
      action: () => ( {
        status: 'data',
        data: [ '/data' ],
      } ),
    },
    {
      path: '/pools',
      action: () => ( {
        status: 'pool',
        data: [ '/pools' ],
      } ),
    },
    // {
    //   path: '/events',
    //   action: () => {
    //     return {
    //       status: 'events',
    //       data: [ '/events' ]
    //     };
    //   }
    // }
  ];

  const Router = new UniversalRouter( routes );

  /* ================== public methods ================== */

  function castRoute( route ) {
    return Router.resolve( route );
  }

  function setRoute() {
    // todo
  }

  function setBrowserHistory( path ) {
    const data = { path: path };
    if( V.getState( 'active' ).path != data.path ) {
      window.history.pushState(
        data,
        data.path,
        window.location.origin + data.path,
      );
      V.setState( 'active', { path: data.path } );
    }
  }

  /* ====================== export ====================== */

  V.castRoute = castRoute;
  V.setRoute = setRoute;
  V.setBrowserHistory = setBrowserHistory;

  return {
    castRoute: castRoute,
    setRoute: setRoute,
    setBrowserHistory: setBrowserHistory,
  };

} )();
