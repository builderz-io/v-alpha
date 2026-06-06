const GroupComponents = ( function() {

  const ui = ( () => {
    const strings = {
      newGroup: 'Add new group',
      noGroups: 'No groups available',
      groups: 'Groups',
      grouping: 'Grouping',
      noAssignedEntities: 'No entities assigned to group',
      plots: 'Plots',
      soilBalanceTitle: 'Soil Balance',
      inviteHandleTitle: 'Invite Handle',
      inviteHandleCopy: 'Copy',
      inviteHandleCopied: 'Copied',
      inviteHandleInvalid: 'Invalid invite code',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ================== private methods ================= */

  function canEditPlot( plot ) {
    const active = V.aE();
    if ( !active || !plot ) { return false }
    if ( active.uuidE === plot.uuidE || active.uuidP === plot.uuidP ) { return true }
    if ( active.holderOf && active.holderOf.some( item => item.a === plot.uuidE ) ) { return true }
    return false;
  }

  function copyTextToClipboard( text ) {
    if ( navigator.clipboard && navigator.clipboard.writeText ) {
      return navigator.clipboard.writeText( text );
    }

    const textarea = document.createElement( 'textarea' );
    textarea.value = text;
    textarea.setAttribute( 'readonly', '' );
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild( textarea );
    textarea.select();
    document.execCommand( 'copy' );
    document.body.removeChild( textarea );
    return Promise.resolve();
  }

  function getMemberOfGroup( entity ) {
    const value = entity.servicefields[V.castServiceField( 'memberOfGroup' )];
    return value && value !== 'undefined' ? String( value ).trim() : '';
  }

  function getGroupedEntityIds( groupEntity ) {
    const grouped = V.castJson( groupEntity.servicefields[V.castServiceField( 'groupedEntities' )] );
    return Array.isArray( grouped ) ? grouped.filter( Boolean ) : [];
  }

  function sequenceWithBal( raw ) {
    if ( !raw ) {
      return null;
    }

    const sequence = V.castJson( raw );
    if (
      !sequence
      || !sequence.BAL
      || typeof sequence.BAL.C !== 'number'
      || typeof sequence.BAL.N !== 'number'
    ) {
      return null;
    }

    return sequence;
  }

  function getPlotSequenceData( plot ) {
    if ( !plot || !plot.servicefields ) {
      return null;
    }

    const yearsField = V.castServiceField( 'yearsAverageSequence' );
    const averageField = V.castServiceField( 'averageSequence' );

    return sequenceWithBal( plot.servicefields[yearsField] )
      || sequenceWithBal( plot.servicefields[averageField] );
  }

  function getPlotsSoilBalances( plotEntities ) {
    const sequences = ( plotEntities || [] )
      .map( getPlotSequenceData )
      .filter( Boolean );

    if ( !sequences.length ) {
      return { C: 0, N: 0 };
    }

    return SoilCalculator.getAccumulatedSequenceResults( sequences );
  }

  function filterValidPlotEntities( plotEntities ) {
    return ( plotEntities || [] ).filter( plot => plot && plot.uuidE );
  }

  function cachePlotEntitiesForView( plotEntities ) {
    if ( !plotEntities.length ) {
      return;
    }

    V.setCache( 'viewed', plotEntities );
    V.setCache( 'points', plotEntities );
  }

  function getGroupedEntitiesFromElement( groupElement ) {
    const raw = groupElement.dataset.groupedEntities;
    if ( !raw ) {
      return [];
    }

    const parsed = V.castJson( raw );
    return Array.isArray( parsed ) ? parsed.filter( Boolean ) : [];
  }

  function syncGroupElementDataset( groupUuidE, plotIds, plotInGroup ) {
    const groupElement = V.gN( `[data-plot-group="${groupUuidE}"]` );
    if ( !groupElement ) {
      return;
    }

    groupElement.dataset.groupedEntities = V.castJson( plotIds );

    if ( plotInGroup ) {
      groupElement.dataset.plotInGroup = 'true';
    }
    else {
      delete groupElement.dataset.plotInGroup;
    }
  }

  function refreshGroupBalanceWidget( groupElement, plotIds ) {
    if ( !groupElement.querySelector( '[data-group-calc]' ) ) {
      return Promise.resolve();
    }

    return fetchPlotsByIds( plotIds )
      .then( plotEntities => {
        const avgBalance = getPlotsSoilBalances( plotEntities );
        const balC = groupElement.querySelector( '#s-calc-result__T_BAL_C' );
        const balN = groupElement.querySelector( '#s-calc-result__T_BAL_N' );
        if ( balC ) { balC.textContent = avgBalance.C.toFixed( 1 ) }
        if ( balN ) { balN.textContent = avgBalance.N.toFixed( 1 ) }
      } );
  }

  function fetchPlotsByIds( plotIds ) {
    if ( !plotIds.length ) {
      console.log( '[GroupComponents.fetchPlotsByIds] s30', { plotIds, plots: [] } );
      return Promise.resolve( [] );
    }
  
    console.log( '[GroupComponents.fetchPlotsByIds] s30 request', { plotIds } );
  
    return V.getEntity( plotIds )
      .then( res => {
        const plots = !res.success || !res.data
          ? []
          : filterValidPlotEntities( res.data );
  
        console.log( '[GroupComponents.fetchPlotsByIds] s30 response', plots );
  
        return plots;
      } )
      .catch( err => {
        console.log( '[GroupComponents.fetchPlotsByIds] s30 error', err );
        return [];
      } );
  }

  function getGroupPlots( groupEntity ) {
    const fromOwner = getGroupedEntityIds( groupEntity );

    if ( fromOwner.length ) {
      return fetchPlotsByIds( [ ...new Set( fromOwner ) ] );
    }

    return V.getPlotsByGroup( groupEntity.uuidE )
    .then( res => {
      const plots = !res.success || !res.data
        ? []
        : filterValidPlotEntities( res.data );
      console.log( '[GroupComponents.getGroupPlots] s27 response', plots );
      cachePlotEntitiesForView( plots );
      return plots;
    } )
      .catch( () => [] );
  }

  function updateGroupTotalBalance( plotEntities ) {
    const plotAccumulatedData = getPlotsSoilBalances( plotEntities );
    const balN = document.querySelector( '#s-calc-result__T_BAL_N' );
    const balC = document.querySelector( '#s-calc-result__T_BAL_C' );
    if ( balN ) { balN.textContent = plotAccumulatedData.N.toFixed( 1 ) }
    if ( balC ) { balC.textContent = plotAccumulatedData.C.toFixed( 1 ) }
  }

  function renderGroupPlotList( plotEntities ) {
    const container = V.getNode( '.group-plots__list' );
    if ( !container ) { return }

    V.setNode( container, '' );

    if ( !plotEntities.length ) {
      container.append( V.cN( {
        c: 'pxy',
        h: V.getString( ui.noAssignedEntities ),
      } ) );
      return;
    }

    const plots = V.cN( {
      c: 'group-plots pxy',
      h: plotEntities.map( plot => V.cN( {
        t: 'p',
        c: 'pxy',
        y: {
          cursor: 'pointer',
        },
        h: plot.fullId,
        k: () => handleProfileDraw( plot ),
      } ) ),
    } );
    container.append( plots );
  }

  function loadGroupPlots( groupEntity ) {
    return getGroupPlots( groupEntity )
      .then( plotEntities => {
        updateGroupTotalBalance( plotEntities );
        renderGroupPlotList( plotEntities );
      } );
  }

  function handleProfileDraw( plot ) {
    cachePlotEntitiesForView( [ plot ] );
    const path = V.castPathOrId( plot.fullId );
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

  function handleGroupSelection( group, entity ) {
    return ( event ) => {
      event.target.disabled = true;

      const groupFields = new Set( V.castJson( group.servicefields[V.castServiceField( 'groupedEntities' )] ) ||  [] );

      if ( event.target.checked ) {
        if ( !groupFields.has( entity.uuidE ) ) {
          groupFields.add( entity.uuidE );
        }

        const plotIds = [...groupFields.values()];
        syncGroupElementDataset( group.uuidE, plotIds, true );
        updateGroupedEntities( group, plotIds );

        drawCheckboxGroupTotalBalanceWidget( group.uuidE, plotIds )
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

          const plotIds = [...groupFields.values()];
          syncGroupElementDataset( group.uuidE, plotIds, false );

          updateGroupedEntities( group, plotIds )
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

  function drawCheckboxGroupTotalBalanceWidget( groupId, plotIds ) {
    return fetchPlotsByIds( plotIds )
      .then( plotEntities => {
        const plotAccumulatedData = getPlotsSoilBalances( plotEntities );
        return V.cN( {
          a: { 'data-group-calc': groupId },
          h: SoilCalculatorComponents.drawTotalBalance( plotAccumulatedData, 'isGroup' ),
        } );
      } );
  }

  function drawGroupCheckbox( group, entity, entityInGroup ) {
    const plotsInGroup = V.castJson( group.servicefields[V.castServiceField( 'groupedEntities' )] ) || [];

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
        plotsInGroup,
      ).then( widget => V.setNode( `[data-plot-group=${group.uuidE}]`, widget ) );
    }

    const groupAttrs = {
      'data-plot-group': group.uuidE,
      'data-grouped-entities': V.castJson( plotsInGroup ),
    };

    if ( entityInGroup ) {
      groupAttrs['data-plot-in-group'] = 'true';
    }

    return V.cN( { c: 'pxy', a: groupAttrs, h: children } );
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
    if ( !canEditPlot( entity ) ) {return ''}

    const groupsOfUser = V.aE() ? V.aE().holderOf
      .filter( item => item.c === 'Group' )
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

  function drawGroupPlotWidget() {
    const entity = V.getState( 'active' ).lastViewedEntity;

    if ( entity.role !== 'Group' ) { return '' }

    const node = V.cN( {
      c: 'group-plots__list',
      h: [ InteractionComponents.confirmClickSpinner( { color: 'black' } ) ],
    } );

    return CanvasComponents.card( node, V.getString( ui.plots ) );
  }

  function drawGroupInviteHandleWidget() {
    const entity = V.getState( 'active' ).lastViewedEntity;

    if ( entity.role !== 'Group' ) { return '' }

    let copyFeedbackTimeout;

    const copyIconSize = '16px';

    const copyButton = V.cN( {
      t: 'button',
      c: 'invite-handle-copy',
      a: {
        type: 'button',
        title: V.getString( ui.inviteHandleCopy ),
        'aria-label': V.getString( ui.inviteHandleCopy ),
      },
      h: V.getIcon( 'copy', copyIconSize ),
      k: ( event ) => {
        const button = event.currentTarget;
        copyTextToClipboard( entity.uuidE )
          .then( () => {
            V.setNode( button, '' );
            V.setNode( button, V.getIcon( 'done', copyIconSize ) );
            button.setAttribute( 'aria-label', V.getString( ui.inviteHandleCopied ) );
            button.setAttribute( 'title', V.getString( ui.inviteHandleCopied ) );
            clearTimeout( copyFeedbackTimeout );
            copyFeedbackTimeout = setTimeout( () => {
              V.setNode( button, '' );
              V.setNode( button, V.getIcon( 'copy', copyIconSize ) );
              button.setAttribute( 'aria-label', V.getString( ui.inviteHandleCopy ) );
              button.setAttribute( 'title', V.getString( ui.inviteHandleCopy ) );
            }, 2000 );
          } );
      },
    } );

    const inner = V.cN( {
      c: 'pxy invite-handle-display',
      h: [
        V.cN( {
          t: 'span',
          c: 'invite-handle-code',
          h: entity.uuidE,
        } ),
        copyButton,
      ],
    } );

    return CanvasComponents.card( inner, V.getString( ui.inviteHandleTitle ) );
  }

  function savePlotMemberOfGroup( plot, trimmed, responseNode, inputEl ) {
    const nextValue = trimmed == null ? '' : trimmed;
    if ( nextValue === getMemberOfGroup( plot ) ) {
      return Promise.resolve();
    }

    responseNode.textContent = '';
    if ( inputEl ) { inputEl.disabled = true }

    return V.setEntity( plot.fullId, {
      field: `servicefields.${V.castServiceField( 'memberOfGroup' )}`,
      data: trimmed == null ? null : trimmed,
      activeProfile: plot.uuidP,
    } )
      .then( ( res ) => {
        if ( res.success ) {
          if ( trimmed == null ) {
            delete plot.servicefields[V.castServiceField( 'memberOfGroup' )];
          }
          else {
            plot.servicefields[V.castServiceField( 'memberOfGroup' )] = trimmed;
          }
          if ( inputEl ) { inputEl.value = nextValue }
        }
        else {
          responseNode.textContent = res.message || V.getString( ui.inviteHandleInvalid );
        }
      } )
      .catch( () => {
        responseNode.textContent = V.getString( ui.inviteHandleInvalid );
      } )
      .finally( () => {
        if ( inputEl ) { inputEl.disabled = false }
      } );
  }

  function drawPlotInviteHandleWidget() {
    const entity = V.getState( 'active' ).lastViewedEntity;

    if ( entity.role !== 'Plot' ) { return '' }
    if ( !canEditPlot( entity ) ) { return '' }

    const responseNode = V.cN( { c: 'plot-invite-handle__response pxy txt-gray' } );
    const uuidLength = V.getSetting( 'uuidStringLength' );

    const handleInviteInput = V.debounce( ( event ) => {
      const trimmed = event.target.value.trim();

      if ( trimmed.length === 0 ) {
        if ( getMemberOfGroup( entity ) ) {
          savePlotMemberOfGroup( entity, null, responseNode, event.target );
        }
        else {
          responseNode.textContent = '';
        }
        return;
      }

      if ( trimmed.length !== uuidLength ) {
        responseNode.textContent = '';
        return;
      }

      savePlotMemberOfGroup( entity, trimmed, responseNode, event.target );
    }, 400 );

    const inputElement = V.cN( {
      t: 'input',
      c: 'w-full plot-invite-handle__input',
      a: {
        type: 'text',
        value: getMemberOfGroup( entity ),
      },
      e: { input: handleInviteInput },
    } );

    const inner = V.cN( {
      c: 's-calc-form-background pxy plot-invite-handle w-full',
      y: { width: '100%' },
      h: [
        inputElement,
        responseNode,
      ],
    } );

    const card = CanvasComponents.card( inner, V.getString( ui.inviteHandleTitle ) );
    if ( card && card.classList ) {
      card.classList.add( 'w-full' );
    }
    return card;
  }

  document.addEventListener( 'ENTITY_CREATED', ( { detail } ) => {
    const { entity: group } = detail;

    if ( group.role !== 'Group' ) {
      return;
    }

    const activeEntity = V.getState( 'active' ).lastViewedEntity;
    if ( !activeEntity || activeEntity.role !== 'Plot' || !canEditPlot( activeEntity ) ) {
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

    const groups = document.querySelectorAll( '[data-plot-group][data-plot-in-group="true"]' );
    for ( const groupElement of groups ) {
      const plotIds = getGroupedEntitiesFromElement( groupElement );
      if ( !plotIds.includes( activeEntity.uuidE ) ) {
        continue;
      }

      refreshGroupBalanceWidget( groupElement, plotIds );
    }
  } );

  function drawGroupTotalBalanceWidget() {
    const entity = V.getState( 'active' ).lastViewedEntity;

    if ( entity.role != 'Group' ) { return '' }

    loadGroupPlots( entity );

    return CanvasComponents.card( SoilCalculatorComponents.drawTotalBalance(), V.getString( ui.soilBalanceTitle ) );
  }

  return {
    drawGroupWidget: drawGroupWidget,
    drawGroupPlotWidget: drawGroupPlotWidget,
    drawGroupInviteHandleWidget: drawGroupInviteHandleWidget,
    drawPlotInviteHandleWidget: drawPlotInviteHandleWidget,
    drawGroupTotalBalanceWidget: drawGroupTotalBalanceWidget,
  };
} )();
