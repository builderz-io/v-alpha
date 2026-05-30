const Group = ( function() { // eslint-disable-line no-unused-vars

  'use strict';

  function launch() {
    V.setNavItem( 'serviceNav', [{
      title: 'Groups',
      path: '/groups',
      use: {
        form: 'new entity',
        privacy: 2,
        join: 5,
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
    V.getQuery( {
      query: '',
      role: 'Group',
    } ).then( res => {
      if ( !res.success || !res.data || !res.data.length ) {
        Page.draw( {
          topcontent: CanvasComponents.notFound( 'group' ),
        } );
        return;
      }
      const list = CanvasComponents.list();
      res.data.forEach( group => {
        V.setNode( list, [
          UserComponents.entityListCard( group ),
        ] );
      } );
      Page.draw( {
        listings: list,
      } );
      VMap.draw( res.data );
    } );
  }

  /**
   * Programmatic, API-style helper to create a network/community group.
   * Creates the Group entity first, then writes the membership UUIDs into
   * servicefields.s30 ('groupedEntities'). Returns the created group.
   */
  async function createGroup( {
    title,
    description,
    privacy = 2,
    memberUuids = [],
  } ) {
    const created = await V.setEntity( {
      role: 'Group',
      title,
      description,
      privacy,
    } );

    if ( !created.success ) {
      throw new Error( created.status || 'Could not create group' );
    }

    const group = created.data[0];

    if ( memberUuids.length ) {
      const field = V.castServiceField( 'groupedEntities' );
      const uniqueMembers = [ ...new Set( memberUuids ) ];
      await V.setEntity( group.fullId, {
        field: `servicefields.${field}`,
        data: V.castJson( uniqueMembers ),
        activeProfile: group.uuidP,
      } );
      group.servicefields = group.servicefields || {};
      group.servicefields[field] = V.castJson( uniqueMembers );
    }

    document.dispatchEvent(
      new CustomEvent( 'ENTITY_CREATED', {
        detail: { entity: group },
      } ),
    );

    return group;
  }

  V.setState( 'availablePlugins', { group: launch } );

  return {
    launch,
    preview,
    draw,
    createGroup,
  };

} )();
