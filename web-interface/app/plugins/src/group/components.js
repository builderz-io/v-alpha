const GroupComponents = ( function() {

  const ui = ( () => {
    const strings = {
      newGroup: 'Add new group',
      noGroups: 'No groups available',
      groups: 'Groups',
      grouping: 'Grouping',
      noAssignedEntities: 'No entities assigned to group',
      plots: 'Plots',
      members: 'Members',
      addMembers: 'Add from your entities',
      removeMember: 'Remove',
      noHeldEntitiesToAdd: 'No other entities in your account to add',
      soilBalanceTitle: 'Soil Balance',
      groupIncompleteRollup: 'Some plots have incomplete season data; group totals may be understated.',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ================== private methods ================= */

  function setContainerContent( container, content ) {
    if ( !container ) {
      return;
    }

    if ( typeof container === 'string' ) {
      container = V.getNode( container );
    }

    if ( !container ) {
      return;
    }

    container.textContent = '';

    if ( content === '' || content == null ) {
      return;
    }

    V.setNode( container, content );
  }

  function isGroupEntity( entity ) {
    if ( !entity ) { return false }
    return entity.role === 'Group'
      || entity.roleCode === 'aq'
      || entity.role === 'aq';
  }

  function handleProfileDraw() {
    const path = V.castPathOrId( this.textContent );
    V.setState( 'active', { navItem: path } );
    V.setBrowserHistory( path );
    Profile.draw( path );
  }

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

  function getGroupedUuids( group ) {
    const raw = group.servicefields[V.castServiceField( 'groupedEntities' )];
    return V.castJson( raw ) || [];
  }

  function userHoldsGroup( group ) {
    if ( !group || !V.aE() ) {
      return false;
    }

    const active = V.aE();

    if ( active.holderOf && active.holderOf.some( item => {
      const holdsThisGroup = item.a === group.uuidE || item.fullId === group.fullId;
      const isGroupRef = item.c === 'aq'
        || item.c === 'Group'
        || V.castRole( item.c ) === 'Group';
      return holdsThisGroup && isGroupRef;
    } ) ) {
      return true;
    }

    if (
      group.holders
      && group.holders.includes( active.fullId )
    ) {
      return true;
    }

    const tmpEditable = V.getState( 'tmpEditable' );

    return !!( tmpEditable && tmpEditable.includes( group.fullId ) );
  }

  function getHeldEntityRefs( holderOf ) {
    return ( holderOf || [] )
      .filter( item => {
        const role = V.castRole( item.c );
        return role !== 'Group' && item.c !== 'aq';
      } );
  }

  function setGroupedUuidsOnGroup( group, uuids ) {
    const field = V.castServiceField( 'groupedEntities' );
    group.servicefields = group.servicefields || {};
    group.servicefields[field] = V.castJson( uuids );
  }

  function refreshGroupMembersList( group, listContainer ) {
    const uuids = getGroupedUuids( group );

    if ( !uuids.length ) {
      setContainerContent( listContainer, V.cN( {
        c: 'pxy',
        h: V.getString( ui.noAssignedEntities ),
      } ) );
      return;
    }

    const canManage = userHoldsGroup( group );

    V.getEntity( uuids ).then( result => {
      if ( !result.success || !result.data || !result.data.length ) {
        setContainerContent( listContainer, V.cN( {
          c: 'pxy',
          h: V.getString( ui.noAssignedEntities ),
        } ) );
        return;
      }

      setContainerContent( listContainer, result.data.map( member => V.cN( {
        c: 'group-member-row flex justify-between items-center pxy',
        h: [
          {
            t: 'p',
            c: 'cursor-pointer',
            h: `${member.fullId} (${member.role})`,
            k: handleProfileDraw,
          },
          canManage
            ? V.cN( {
              t: 'button',
              c: 'txt-gray fs-s',
              h: V.getString( ui.removeMember ),
              k: ( event ) => {
                event.stopPropagation();
                event.target.disabled = true;
                const next = getGroupedUuids( group ).filter( u => u !== member.uuidE );
                updateGroupedEntities( group, next ).then( () => {
                  setGroupedUuidsOnGroup( group, next );
                  event.target.disabled = false;
                  refreshGroupMembersList( group, listContainer );
                  const manageEl = V.getNode( '.group-members-manage' );
                  if ( manageEl ) {
                    refreshGroupMembersManage( group, manageEl );
                  }
                } );
              },
            } )
            : '',
        ],
      } ) ) );
    } ).catch( () => {
      setContainerContent( listContainer, V.cN( {
        c: 'pxy',
        h: V.getString( ui.noAssignedEntities ),
      } ) );
    } );
  }

  function refreshGroupMembersManage( group, manageContainer, holderOfSource ) {
    const heldRefs = getHeldEntityRefs(
      holderOfSource || ( V.aE() && V.aE().holderOf ),
    );

    if ( !heldRefs.length ) {
      setContainerContent( manageContainer, V.cN( {
        c: 'pxy fs-s',
        h: V.getString( ui.noHeldEntitiesToAdd ),
      } ) );
      return;
    }

    const heldUuids = heldRefs.map( item => item.a );

    V.getEntity( heldUuids ).then( result => {
      if ( !result.success || !result.data ) {
        setContainerContent( manageContainer, '' );
        return;
      }

      const inGroup = new Set( getGroupedUuids( group ) );

      setContainerContent( manageContainer, [
        V.cN( {
          c: 'pxy font-bold fs-s',
          h: V.getString( ui.addMembers ),
        } ),
        ...result.data.map( held => V.cN( {
          c: 'flex pxy group-member-add-row',
          h: [
            {
              c: 'mr-rr',
              t: 'input',
              a: {
                type: 'checkbox',
                checked: inGroup.has( held.uuidE ),
              },
              k: ( event ) => {
                event.target.disabled = true;
                const next = new Set( getGroupedUuids( group ) );

                if ( event.target.checked ) {
                  next.add( held.uuidE );
                }
                else {
                  next.delete( held.uuidE );
                }

                const nextArr = [...next.values()];

                updateGroupedEntities( group, nextArr ).then( () => {
                  setGroupedUuidsOnGroup( group, nextArr );
                  event.target.disabled = false;
                  refreshGroupMembersList( group, V.getNode( '.group-members__list' ) );
                  refreshGroupMembersManage( group, manageContainer );
                } );
              },
            },
            {
              t: 'span',
              h: held.fullId + ' (' + held.role + ')',
            },
          ],
        } ) ),
      ] );
    } ).catch( () => {
      setContainerContent( manageContainer, '' );
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

        drawCheckboxGroupTotalBalanceWidget( group.uuidE, [...groupFields.values()] )
          .then( widget => {
            const loadingElement = V.gN( `[data-plot-group=${group.uuidE}] .calculator-loader` );
            if ( loadingElement ) {loadingElement.remove()}
            event.target.disabled = false;
            V.setNode( `[data-plot-group=${group.uuidE}]`, widget );
          } );

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

  function groupHasIncompletePlotData( plots ) {
    if ( !plots || !plots.length ) { return false }
    return plots.some( plot => {
      const summary = SoilCalculatorComponents.getDataQualitySummary( plot.servicefields );
      return summary.total > 0 && summary.complete < summary.total;
    } );
  }

  function groupRollupDisclaimerNode( plots ) {
    if ( !groupHasIncompletePlotData( plots ) ) { return '' }
    return V.cN( {
      c: 's-calc-validation-banner',
      h: V.getString( ui.groupIncompleteRollup ),
    } );
  }

  function drawCheckboxGroupTotalBalanceWidget( groupId, plotIds ) {
    return V.getEntity( plotIds )
      .then( result => {
        const plotAccumulatedData = SoilCalculator.getAccumulatedSequenceResults(
          result.data.map(
            plot => plot.servicefields[V.castServiceField( 'yearsAverageSequence' )]
              ? V.castJson( plot.servicefields[V.castServiceField( 'yearsAverageSequence' )] )
              : V.castJson( plot.servicefields[V.castServiceField( 'averageSequence' )] ),
          ),
        );
        return V.cN( {
          a: { 'data-group-calc': groupId },
          h: [
            SoilCalculatorComponents.drawTotalBalance( plotAccumulatedData, 'isGroup' ),
            groupRollupDisclaimerNode( result.data ),
          ],
        } );
      } );
  }

  function drawGroupCheckbox( group, entity, entityInGroup ) {
    const selectGroupLabel = V.cN( {
      t: 'button',
      c: 'group-selection-element w-full txt-left',
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
      drawCheckboxGroupTotalBalanceWidget(
        group.uuidE,
        V.castJson( group.servicefields[V.castServiceField( 'groupedEntities' )] ),
      ).then( widget => V.setNode( `[data-plot-group=${group.uuidE}]`, widget ) );
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

    const groupsOfUser = V.aE() ? V.aE().holderOf
      .filter( item => V.castRole( item.c ) === 'Group' )
      .map( item => item.a ) : [];

    const addNewGroupButton = V.cN(
      {
        t: 'button',
        y: {
          'margin-top': '0.5rem',
        },
        c: 'new-group-button w-full pxy txt-left bkg-white txt-gray',
        h: V.getString( ui.newGroup ),
        k: () => {
          V.setNode( 'body', JoinRoutine.draw( V.getNavItem( '/groups', 'serviceNav' ).use ) );
        },
      },
    );

    if ( groupsOfUser.length > 0 ) {
      V.getEntity( groupsOfUser ).then( ( { data } ) => {
        const groupSelection = V.getNode( '.plot-group-selection' );

        V.setNode( '.plot-group-selection', '' );

        groupSelection.append(
          V.cN(
            {
              c: 's-calc-form-background',
              h: [...drawGroupCheckboxes( data ), addNewGroupButton],
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
          : V.cN(
            {
              c: 's-calc-form-background',
              h: [
                addNewGroupButton,
              ],
            },
          ),
      ],
    } );

    return CanvasComponents.card( parent, SoilCalculatorComponents.castCardTitle( 'groups' ) );
  }

  function refreshGroupMembersPanel( group, listContainer, manageContainer ) {
    refreshGroupMembersList( group, listContainer );

    if ( !V.aE() || !V.aE().fullId ) {
      setContainerContent( manageContainer, '' );
      return;
    }

    setContainerContent( manageContainer, V.cN( {
      c: 'pxy',
      h: InteractionComponents.confirmClickSpinner( { color: 'black' } ),
    } ) );

    V.getEntity( V.aE().fullId ).then( res => {
      if ( res.success && res.data[0] && res.data[0].holderOf ) {
        V.setActiveEntity( Object.assign( {}, V.aE(), {
          holderOf: res.data[0].holderOf,
        } ) );
      }

      if ( !userHoldsGroup( group ) ) {
        setContainerContent( manageContainer, '' );
        return;
      }

      refreshGroupMembersManage(
        group,
        manageContainer,
        V.aE().holderOf,
      );
    } ).catch( () => {
      if ( !userHoldsGroup( group ) ) {
        setContainerContent( manageContainer, '' );
        return;
      }

      refreshGroupMembersManage(
        group,
        manageContainer,
        V.aE().holderOf,
      );
    } );
  }

  function drawGroupPlotWidget() {
    const entity = V.getState( 'active' ).lastViewedEntity;

    if ( !isGroupEntity( entity ) ) { return '' }

    const listNode = V.cN( {
      c: 'group-members__list',
    } );

    const manageNode = V.cN( {
      c: 'group-members-manage s-calc-form-background',
    } );

    refreshGroupMembersPanel( entity, listNode, manageNode );

    return CanvasComponents.card(
      V.cN( { c: 'group-members', h: [listNode, manageNode] } ),
      V.getString( ui.members ),
    );
  }

  document.addEventListener( 'ENTITY_CREATED', ( { detail } ) => {
    const { entity: group } = detail;

    if ( !isGroupEntity( group ) ) {
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

    if ( groupsContainer ) {
      if ( isActivePlotInGroup ) {
        groupsContainer.insertAdjacentElement( 'afterbegin', newGroupCheckbox );
      }
      else {
        groupsContainer.insertBefore( newGroupCheckbox, V.getNode( '.new-group-button' ) );
      }
    }
  } );

  document.addEventListener( 'DATAPOINT_CHANGED', () => {
    const activeEntity = V.getState( 'active' ).lastViewedEntity;
    if ( !activeEntity || activeEntity.role !== 'Plot' ) {
      return;
    }

    const groups = document.querySelectorAll( '[data-plot-group]' );
    for ( const groupElement of groups ) {
      const groupId = groupElement.dataset.plotGroup;
      V.getEntity( groupId )
        .then( result => V.getEntity( V.castJson( result.data[0].servicefields[V.castServiceField( 'groupedEntities' )] ) ) )
        .then( result => {
          const avgBalance = SoilCalculator.getAccumulatedSequenceResults(
            result.data.map(
              plot => plot.servicefields[V.castServiceField( 'yearsAverageSequence' )]
                ? V.castJson( plot.servicefields[V.castServiceField( 'yearsAverageSequence' )] )
                : V.castJson( plot.servicefields[V.castServiceField( 'averageSequence' )] ),
            ),
          );
          groupElement.querySelector( '#s-calc-result__T_BAL_C' ).textContent = avgBalance.C.toFixed( 1 );
          groupElement.querySelector( '#s-calc-result__T_BAL_N' ).textContent = avgBalance.N.toFixed( 1 );
        } );
    }
  } );

  function drawGroupTotalBalanceWidget() {
    const entity = V.getState( 'active' ).lastViewedEntity;

    if ( !isGroupEntity( entity ) ) { return '' }

    const groupedEntities = getGroupedUuids( entity );

    if ( !groupedEntities.length ) {
      return '';
    }

    V.getEntity( groupedEntities )
      .then( ( { data } ) => {
        const plotAccumulatedData = SoilCalculator.getAccumulatedSequenceResults(
          data.map(
            plot => plot.servicefields[V.castServiceField( 'yearsAverageSequence' )]
              ? V.castJson( plot.servicefields[V.castServiceField( 'yearsAverageSequence' )] )
              : V.castJson( plot.servicefields[V.castServiceField( 'averageSequence' )] ),
          ),
        );

        document.querySelector( '#s-calc-result__T_BAL_N' ).textContent = plotAccumulatedData.N.toFixed( 1 );
        document.querySelector( '#s-calc-result__T_BAL_C' ).textContent = plotAccumulatedData.C.toFixed( 1 );

        const disclaimer = document.querySelector( '.s-calc-group-disclaimer' );
        if ( disclaimer ) {
          disclaimer.textContent = groupHasIncompletePlotData( data )
            ? V.getString( ui.groupIncompleteRollup )
            : '';
        }
      } );

    return CanvasComponents.card(
      V.cN( {
        h: [
          SoilCalculatorComponents.drawTotalBalance(),
          V.cN( { c: 's-calc-validation-banner s-calc-group-disclaimer' } ),
        ],
      } ),
      V.getString( ui.soilBalanceTitle ),
    );
  }

  return {
    drawGroupWidget: drawGroupWidget,
    drawGroupPlotWidget: drawGroupPlotWidget,
    drawGroupTotalBalanceWidget: drawGroupTotalBalanceWidget,
  };
} )();
