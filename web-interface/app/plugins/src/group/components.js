const GroupComponents = ( function() {

  const ui = ( () => {
    const strings = {
      newGroup: 'New group',
      noGroups: 'No groups available',
      groups: 'Groups',
      noAssignedEntities: 'No entities assigned to group',
      plots: 'Plots',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ================== private methods ================= */

  function sortGroupsByPlotExistence( entity ) {
    return ( a, b ) => {
      const groupedEntitiesA = a.servicefields[V.castServiceField( 'groupedEntities' )];
      const groupedEntitiesB = b.servicefields[V.castServiceField( 'groupedEntities' )];

      if ( groupedEntitiesA && groupedEntitiesA.includes( entity.uuidE ) && ( !groupedEntitiesB || !groupedEntitiesB.includes( entity.uuidE ) ) ) {
        return -1;
      }

      if ( groupedEntitiesB && groupedEntitiesB.includes( entity.uuidE ) && ( !groupedEntitiesA || !groupedEntitiesA.includes( entity.uuidE ) ) ) {
        return 1;
      }

      return 0;
    };
  }

  function updateGroupedEntities( group, groupedEntities ) {
    return V.setEntity( group.fullId, {
      field: `servicefields.${V.castServiceField( 'groupedEntities' )}`,
      data: V.castJson( groupedEntities ),
      activeProfile: group.uuidP,
    } );
  }

  function handleGroupSelection( group, entity ) {
    return ( event ) => {
      event.target.disabled = true;

      const groupFields = V.castJson( group.servicefields[V.castServiceField( 'groupedEntities' )] ) || [];

      if ( event.target.checked ) {
        groupFields.push( entity.uuidE );

        updateGroupedEntities( group, groupFields );

        setTimeout( () => {
          const loadingElement = V.gN( `[data-plot-group=${group.uuidE}] .calculator-loader` );
          if ( loadingElement ) {loadingElement.remove()}

          const totalBalanceWidget = V.cN( {
            a: {
              'data-group-calc': group.uuidE,
            },
            h: SoilCalculatorComponents.drawTotalBalance(),
          } );

          event.target.disabled = false;
          V.setNode( `[data-plot-group=${group.uuidE}]`, totalBalanceWidget );
        }, 1000 );

        V.setNode( `[data-plot-group=${group.uuidE}]`, V.cN( {
          c: 'zero-auto pxy calculator-loader',
          a: { style: 'max-width: fit-content;' },
          h: InteractionComponents.confirmClickSpinner( { color: 'black' } ),
        } ) );
      }
      else {
        const totalBalanceWidget = V.gN( `[data-group-calc=${group.uuidE}]` );
        if ( totalBalanceWidget ) {
          if ( groupFields.includes( entity.uuidE ) ) {
            const idx = groupFields.indexOf( entity.uuidE );
            groupFields.splice( idx, 1 );
          }

          updateGroupedEntities( group, groupFields )
            .then( () =>  ( event.target.disabled = false )  );

          totalBalanceWidget.remove();
        }
      }
    };
  }

  function drawGroupCheckboxes( groups ) {
    const entity = V.getState( 'active' ).lastViewedEntity;

    return groups.sort( sortGroupsByPlotExistence( entity ) ).map( group => {
      const plotsInGroup = V.castJson( group.servicefields[V.castServiceField( 'groupedEntities' )] ) || [];
      const entityInGroup = plotsInGroup.includes( entity.uuidE );

      const children = [
        V.cN( {
          c: 'plot-group-selection__item',
          h: [
            {
              c: 'mr-rr',
              t: 'input',
              a: {
                type: 'checkbox',
                id: group.uuidE,
                value: group.uuidE,
                checked: entityInGroup,
              },
              k: handleGroupSelection( group, entity ),
            },
            {
              t: 'label',
              a: { for: group.uuidE },
              h: group.fullId,
            },
          ] } ),
      ];

      if ( entityInGroup ) {
        setTimeout( () => {
          const groupTotalBalanceWidget =  V.cN( {
            a: {
              'data-group-calc': group.uuidE,
            },
            h: SoilCalculatorComponents.drawTotalBalance(),
          } );
          V.setNode( `[data-plot-group=${group.uuidE}]`, groupTotalBalanceWidget );
        }, 2000 );
      }

      return V.cN( {
        c: 'pxy',
        a: {
          'data-plot-group': group.uuidE,
        },
        h: children,
      } );
    } );
  }

  /* ============ public methods and exports ============ */

  function drawGroupWidget() {
    const entity = V.getState( 'active' ).lastViewedEntity;

    if ( entity.role !== 'Plot' ) {return ''}

    const groupsOfUser = V.aE().holderOf
      .filter( item => item.c === 'Group' )
      .map( item => item.a );

    if ( groupsOfUser.length > 0 ) {
      V.getEntity( groupsOfUser ).then( ( { data } ) => {
        const groupSelection = V.getNode( '.plot-group-selection' );
        groupSelection.classList.remove( 'zero-auto' );
        groupSelection.classList.add( 'w-full' );
        V.setNode( '.plot-group-selection', '' );

        groupSelection.append(
          V.cN(
            {
              h: [
                ...drawGroupCheckboxes( data ),
                V.cN(
                  {
                    t: 'button',
                    c: 'w-full pxy text-left bkg-lightblue txt-gray',
                    h: V.getString( ui.newGroup ),
                    k: () => {
                      Page.draw( { position: 'closed', reset: false, navReset: false } );
                      V.setNode( 'body', JoinRoutine.draw( V.getNavItem( '/group', 'serviceNav' ).use ) );
                    },
                  },
                ),
              ],
            },
          ),
        );
      } );
    }

    const parent = V.cN( {
      c: `pxy plot-group-selection ${groupsOfUser.length > 0 ? 'zero-auto' : ''}`,
      h: [
        groupsOfUser.length > 0
          ? InteractionComponents.confirmClickSpinner( { color: 'black' } )
          : V.cN( { h: V.getString( ui.noGroups ) } ),
      ],
    } );

    return CanvasComponents.card( parent, V.getString( ui.groups ) );
  }

  function drawGroupPlotWidget() {
    const entity = V.getState( 'active' ).lastViewedEntity;

    if ( entity.role !== 'Group' ) { return '' }

    const groupedEntities = V.castJson( entity.servicefields[V.castServiceField( 'groupedEntities' )] );

    if ( !groupedEntities[0] ) {
      return CanvasComponents.card( V.cN( {
        c: 'pxy',
        h: V.getString( ui.noAssignedEntities ),
      } ), V.getString( ui.plots ) );
    }

    V.getEntity( groupedEntities )
      .then( result => {
        const plots = V.cN( {
          c: 'pxy',
          h: result.data
            .map( plot => V.cN( { h: plot.fullId } ) ),
        } );

        const container = V.getNode( `[data-assigned-plots=${entity.uuidE}]` );
        container.classList.remove( 'zero-auto' );
        V.setNode( `[data-assigned-plots=${entity.uuidE}]`, '' );
        container.append( plots );
      } );

    const node = V.cN( {
      c: 'zero-auto',
      a: {
        'data-assigned-plots': entity.uuidE,
      },
      h: [ InteractionComponents.confirmClickSpinner( { color: 'black' } ) ],
    } );

    return CanvasComponents.card( node, V.getString( ui.plots ) );
  }

  return {
    drawGroupWidget: drawGroupWidget,
    drawGroupPlotWidget: drawGroupPlotWidget,
  };
} )();
