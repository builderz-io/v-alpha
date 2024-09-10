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

      const groupFields = new Set( V.castJson( group.servicefields[V.castServiceField( 'groupedEntities' )] ) ||  [] );

      if ( event.target.checked ) {
        if ( !groupFields.has( entity.uuidE ) ) {
          groupFields.add( entity.uuidE );
        }

        updateGroupedEntities( group, [...groupFields.values()] );

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
          if ( groupFields.has( entity.uuidE ) ) {
            groupFields.delete( entity.uuidE );
          }

          updateGroupedEntities( group, [...groupFields.values()] )
            .then( () =>  ( event.target.disabled = false )  );

          totalBalanceWidget.remove();
        }
      }
    };
  }

  function handleInputType( group, inputType ) {
    const selectGroupNodes = V.getNodes( `[data-plot-group=${group.uuidE}] .group-selection-element`  );
    const editTitleNodes = V.getNodes( `[data-plot-group=${group.uuidE}] .group-title-edit-element`  );

    for ( const el of selectGroupNodes ) {
      el.classList.toggle( 'hide', inputType === 'editTitle' );
    }

    for ( const el of editTitleNodes ) {
      el.classList.toggle( 'hide', inputType === 'selectGroup' );
    }
  }

  function toggleChangeTitleLoading( element, inputElement, isLoading, elementAfterLoad ) {
    element.innerHTML = '';
    element.append(
      isLoading
        ? InteractionComponents.confirmClickSpinner( { color: 'black' } )
        : elementAfterLoad || '',
    );
    inputElement.disabled = isLoading;
  }

  function drawGroupCheckbox( group, entity, entityInGroup ) {
    const selectGroupLabel = V.cN( {
      t: 'button',
      c: 'group-selection-element w-full text-left',
      h: group.title,
      k: () => handleInputType( group, 'editTitle' ),
    } );

    const selectGroupComponent = [
      V.cN( {
        c: 'group-selection-element w-full flex',
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
          selectGroupLabel,
        ],
      } ),
    ];

    const inputTitleElement = V.cN( {
      t: 'input',
      c: 'w-full',
      a: { value: group.title },
    } );

    const doneImageComponent = V.cN( {
      t: 'span',
      a: { style: 'pointer-events: none' },
      h: V.getIcon( 'done' ),
    } );

    const titleChangeButtonComponent =  V.cN( {
      c: 'hide group-title-edit-element',
      t: 'button',
      h: [doneImageComponent],
      k: ( event ) => {
        const inputElement = V.getNode( `[data-plot-group="${group.uuidE}"] .group-title-edit-element input` );
        const newValue = inputElement.value;

        if ( group.title === newValue ) {
          handleInputType( group, 'selectGroup' );
          return;
        }

        toggleChangeTitleLoading( event.target, inputElement, true );

        V.setEntity( group.fullId, {
          field: 'profile.title',
          data: newValue,
          activeProfile: group.uuidE,
        } ).then( () =>  {
          inputTitleElement.value = newValue;
          selectGroupLabel.textContent = newValue;
          toggleChangeTitleLoading( event.target, inputElement, false, doneImageComponent );
          handleInputType( group, 'selectGroup' );
        } );
      },
    } );

    const editTitleComponent = [
      V.cN( {
        c: 'w-full hide group-title-edit-element',
        h: [inputTitleElement],
      } ),
      titleChangeButtonComponent,
    ];

    const children = [
      V.cN( { c: 'plot-group-selection__item flex justify-between', h: [ ...selectGroupComponent, ...editTitleComponent ] } ),
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

    return V.cN( { c: 'pxy', a: { 'data-plot-group': group.uuidE }, h: children } );
  }

  function drawGroupCheckboxes( groups ) {
    const entity = V.getState( 'active' ).lastViewedEntity;

    return groups.sort( sortGroupsByPlotExistence( entity ) ).map( group => {
      const plotsInGroup = V.castJson( group.servicefields[V.castServiceField( 'groupedEntities' )] ) || [];
      const entityInGroup = Array.isArray( plotsInGroup ) && plotsInGroup.includes( entity.uuidE );
      return drawGroupCheckbox( group, entity, entityInGroup );
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

        V.setNode( '.plot-group-selection', '' );

        groupSelection.append(
          V.cN(
            {
              h: [
                ...drawGroupCheckboxes( data ),
                V.cN(
                  {
                    t: 'button',
                    c: 'w-full pxy text-left bkg-lightblue txt-gray new-group-button',
                    h: V.getString( ui.newGroup ),
                    k: () => {
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
      c: 'plot-group-selection w-full',
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

    if ( !groupedEntities || groupedEntities.length <= 0 ) {
      return CanvasComponents.card( V.cN( {
        c: 'pxy',
        h: V.getString( ui.noAssignedEntities ),
      } ), V.getString( ui.plots ) );
    }

    V.getEntity( groupedEntities )
      .then( result => {
        const plots = V.cN( {
          c: 'group-plots pxy',
          h: result.data
            .map( plot => V.cN( { h: plot.fullId } ) ),
        } );

        const container = V.getNode( '.group-plots__list' );
        V.setNode( container, '' );
        container.append( plots );
      } );

    const node = V.cN( {
      c: 'group-plots__list',
      h: [ InteractionComponents.confirmClickSpinner( { color: 'black' } ) ],
    } );

    return CanvasComponents.card( node, V.getString( ui.plots ) );
  }

  document.addEventListener( 'ENTITY_CREATED', ( { detail } ) => {
    const { entity: group } = detail;

    if ( group.role !== 'Group' ) {
      return;
    }

    const activeEntity = V.getState( 'active' ).lastViewedEntity;
    if ( !activeEntity || activeEntity.role !== 'Plot' ) {
      return;
    }

    const plotsInEntity = V.castJson( group.servicefields[V.castServiceField( 'groupedEntities' )] );

    const isActivePlotInGroup = !plotsInEntity || plotsInEntity.length <= 0
      ? false
      : plotsInEntity.includes( activeEntity.uuidE );

    const groupsContainer = V.getNode( '.plot-group-selection div' );

    const newGroupCheckbox = drawGroupCheckbox( group, activeEntity, isActivePlotInGroup );

    if ( isActivePlotInGroup ) {
      groupsContainer.insertAdjacentElement( 'afterbegin', newGroupCheckbox );
    }
    else {
      groupsContainer.insertBefore( newGroupCheckbox, V.getNode( '.new-group-button' ) );
    }
  } );

  return {
    drawGroupWidget: drawGroupWidget,
    drawGroupPlotWidget: drawGroupPlotWidget,
  };
} )();
