const Group = ( function() { // eslint-disable-line no-unused-vars

  'use strict';

  function launch() {
    V.setNavItem( 'serviceNav', [{
      title: 'Group',
      path: '/group',
      use: {
        form: 'new entity', // this is still unknown
        privacy: 2,
        join: 6,
        role: 'Group',
      },
      draw: function( path ) {
        Group.draw( path );
      },
    }] );
  }

  function preview( path ) {
    Navigation.draw( path );
    Page.draw( {
      position: 'peek',
    } );
  }

  function draw( path ) {
    preview( path );
    Marketplace.draw( path );
  }

  V.setState( 'availablePlugins', { group: launch } );

  return {
    launch,
    preview,
    draw,
  };

} )();
