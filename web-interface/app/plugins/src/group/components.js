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
      researchCohort: 'Research Cohort',
      researchPurpose: 'Research purpose',
      sharingScope: 'Sharing scope',
      fullPlotData: 'Full plot data',
      aggregatedOnly: 'Aggregated only',
      saveResearchSettings: 'Save research settings',
      inviteFarmer: 'Invite farmer',
      invitePlaceholder: 'Farmer full ID (e.g. Dev Tester #1001)',
      sendInvite: 'Send invite',
      pendingInvites: 'Pending invites',
      noInvites: 'No invites yet',
      acceptInvite: 'Accept',
      declineInvite: 'Decline',
      inviteSent: 'Invite sent',
      inviteUpdated: 'Invite updated',
      membersResearchView: 'Research members overview',
      exportCsv: 'Export CSV',
      exportJson: 'Export JSON',
      noResearchPlots: 'No shared plots available for research',
      roleResearchOwner: 'Research owner',
      roleResearchCollaborator: 'Research collaborator',
      roleFarmerMember: 'Farmer member',
      roleViewer: 'Viewer',
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

  function fieldName( field ) {
    return `servicefields.${V.castServiceField( field )}`;
  }

  function getServicefieldJson( group, field, fallback ) {
    const servicefields = group && group.servicefields ? group.servicefields : {};
    const raw = servicefields[V.castServiceField( field )];
    const cast = V.castJson( raw );
    return cast == null ? fallback : cast;
  }

  function updateGroupField( group, field, value ) {
    return V.setEntity( group.fullId, {
      field: fieldName( field ),
      data: typeof value === 'string' ? value : V.castJson( value ),
      activeProfile: group.uuidP,
    } );
  }

  function setGroupFieldLocal( group, field, value ) {
    const key = V.castServiceField( field );
    group.servicefields = group.servicefields || {};
    group.servicefields[key] = typeof value === 'string' ? value : V.castJson( value );
  }

  function getResearchMeta( group ) {
    const fallback = {
      title: group.title,
      description: group.properties && group.properties.description ? group.properties.description : '',
      purpose: '',
      sharingScope: 'full_plot_data',
      ownerUuid: V.aE() ? V.aE().uuidE : undefined,
      ownerFullId: V.aE() ? V.aE().fullId : undefined,
      createdAt: V.castUnix(),
      roles: {
        researchOwner: V.aE() ? [V.aE().uuidE] : [],
        researchCollaborator: [],
        farmerMember: [],
        viewer: [],
      },
    };
    const meta = getServicefieldJson( group, 'researchCohortMeta', fallback );
    if ( !meta.roles ) {
      meta.roles = fallback.roles;
    }
    return meta;
  }

  function getResearchInvites( group ) {
    return getServicefieldJson( group, 'researchGroupInvites', [] ) || [];
  }

  function getConsentRecords( group ) {
    return getServicefieldJson( group, 'researchConsentRecords', [] ) || [];
  }

  function getAuditLog( group ) {
    return getServicefieldJson( group, 'researchAuditLog', [] ) || [];
  }

  function createAuditEntry( action, details ) {
    const actor = V.aE();
    return Object.assign( {
      id: V.castUuid().base64Url.substr( 1, 12 ),
      action: action,
      at: V.castUnix(),
      actorUuid: actor ? actor.uuidE : undefined,
      actorFullId: actor ? actor.fullId : undefined,
    }, details || {} );
  }

  function appendAuditEntry( group, entry ) {
    const next = getAuditLog( group ).concat( [entry] ).slice( -200 );
    setGroupFieldLocal( group, 'researchAuditLog', next );
    return updateGroupField( group, 'researchAuditLog', next );
  }

  function isResearchOwner( group ) {
    const active = V.aE();
    if ( !active ) { return false }
    const meta = getResearchMeta( group );
    const owners = meta.roles && Array.isArray( meta.roles.researchOwner )
      ? meta.roles.researchOwner
      : [];
    return owners.includes( active.uuidE ) || meta.ownerUuid === active.uuidE;
  }

  function hasCohortPermission( group, permission ) {
    const active = V.aE();
    if ( !active ) { return false }
    const meta = getResearchMeta( group );
    const roles = meta.roles || {};

    const owner = ( roles.researchOwner || [] ).includes( active.uuidE )
      || meta.ownerUuid === active.uuidE;
    const collaborator = ( roles.researchCollaborator || [] ).includes( active.uuidE );
    const farmerMember = ( roles.farmerMember || [] ).includes( active.uuidE );
    const viewer = ( roles.viewer || [] ).includes( active.uuidE );

    if ( permission === 'manage' ) {
      return owner || collaborator;
    }
    if ( permission === 'view_full_data' ) {
      return owner || collaborator || farmerMember;
    }
    if ( permission === 'view_aggregate' ) {
      return owner || collaborator || farmerMember || viewer;
    }
    return false;
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
            h: `${member.fullId} (${V.getString( member.role )})`,
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
              h: held.fullId + ' (' + V.getString( held.role ) + ')',
            },
          ],
        } ) ),
      ] );
    } ).catch( () => {
      setContainerContent( manageContainer, '' );
    } );
  }

  function setConsentStatus( group, consentData ) {
    const records = getConsentRecords( group );
    const withoutCurrent = records.filter(
      item => !( item.farmerUuid === consentData.farmerUuid && item.groupUuid === consentData.groupUuid ),
    );
    const next = withoutCurrent.concat( [consentData] );
    setGroupFieldLocal( group, 'researchConsentRecords', next );
    return updateGroupField( group, 'researchConsentRecords', next );
  }

  function invitePayload( farmerFullId, farmerUuid, token, scope ) {
    return {
      id: V.castUuid().base64Url.substr( 1, 12 ),
      token: token,
      farmerFullId: farmerFullId,
      farmerUuid: farmerUuid,
      status: 'pending',
      sharingScope: scope || 'full_plot_data',
      createdAt: V.castUnix(),
      expiresAt: V.castUnix() + 60 * 60 * 24 * 14, // 14 days
      invitedByUuid: V.aE() ? V.aE().uuidE : undefined,
      invitedByFullId: V.aE() ? V.aE().fullId : undefined,
    };
  }

  function saveInvites( group, invites ) {
    setGroupFieldLocal( group, 'researchGroupInvites', invites );
    if ( typeof V.setResearchInviteState === 'function' && V.getSetting( 'entityLedger' ) === 'MongoDB' ) {
      return V.setResearchInviteState( {
        groupFullId: group.fullId,
        invites: invites,
        groupedEntities: getGroupedUuids( group ),
        meta: getResearchMeta( group ),
        consentRecords: getConsentRecords( group ),
        actorUuid: V.aE() ? V.aE().uuidE : undefined,
        actorFullId: V.aE() ? V.aE().fullId : undefined,
        action: 'invite_state_sync',
      }, 'research invite state' );
    }
    return updateGroupField( group, 'researchGroupInvites', invites );
  }

  async function handleInviteAction( group, inviteId, nextStatus ) {
    const invites = getResearchInvites( group );
    const invite = invites.find( item => item.id === inviteId );
    if ( !invite ) { return }

    const now = V.castUnix();
    const active = V.aE();
    const isTarget = active
      && ( active.fullId === invite.farmerFullId || active.uuidE === invite.farmerUuid );

    if ( !isTarget && !hasCohortPermission( group, 'manage' ) ) {
      return;
    }

    if ( invite.expiresAt && invite.expiresAt < now ) {
      invite.status = 'expired';
      await saveInvites( group, invites );
      return;
    }

    invite.status = nextStatus;
    invite.decidedAt = now;
    invite.decidedByUuid = active ? active.uuidE : undefined;

    if ( nextStatus === 'accepted' ) {
      const targetEntity = await V.getEntity( invite.farmerFullId );
      if ( targetEntity.success && targetEntity.data[0] ) {
        const farmer = targetEntity.data[0];
        invite.farmerUuid = farmer.uuidE;

        const plotUuids = ( farmer.holderOf || [] )
          .filter( item => V.castRole( item.c ) === 'Plot' )
          .map( item => item.a );

        const uniquePlotUuids = [ ...new Set( getGroupedUuids( group ).concat( plotUuids ) ) ];
        await updateGroupedEntities( group, uniquePlotUuids );
        setGroupedUuidsOnGroup( group, uniquePlotUuids );

        const meta = getResearchMeta( group );
        meta.roles = meta.roles || {};
        meta.roles.farmerMember = [ ...( meta.roles.farmerMember || [] ) ];
        if ( !meta.roles.farmerMember.includes( farmer.uuidE ) ) {
          meta.roles.farmerMember.push( farmer.uuidE );
        }
        setGroupFieldLocal( group, 'researchCohortMeta', meta );
        await updateGroupField( group, 'researchCohortMeta', meta );

        await setConsentStatus( group, {
          id: V.castUuid().base64Url.substr( 1, 12 ),
          farmerUuid: farmer.uuidE,
          farmerFullId: farmer.fullId,
          groupUuid: group.uuidE,
          groupFullId: group.fullId,
          scope: invite.sharingScope || 'full_plot_data',
          status: 'active',
          grantedAt: now,
          expiresAt: null,
          grantedByUuid: farmer.uuidE,
        } );
      }
    }
    else if ( nextStatus === 'declined' ) {
      await setConsentStatus( group, {
        id: V.castUuid().base64Url.substr( 1, 12 ),
        farmerUuid: invite.farmerUuid,
        farmerFullId: invite.farmerFullId,
        groupUuid: group.uuidE,
        groupFullId: group.fullId,
        scope: invite.sharingScope || 'full_plot_data',
        status: 'revoked',
        grantedAt: null,
        revokedAt: now,
        grantedByUuid: active ? active.uuidE : undefined,
      } );
    }

    await saveInvites( group, invites );
    await appendAuditEntry( group, createAuditEntry( 'invite_' + nextStatus, {
      inviteId: invite.id,
      farmerFullId: invite.farmerFullId,
      farmerUuid: invite.farmerUuid,
    } ) );
  }

  async function handleSendInvite( group, $input, renderCallback ) {
    const farmerFullId = $input.value.trim();
    if ( !farmerFullId ) { return }

    const farmerRes = await V.getEntity( farmerFullId );
    if ( !farmerRes.success || !farmerRes.data[0] ) { return }
    const farmer = farmerRes.data[0];

    const meta = getResearchMeta( group );
    const invite = invitePayload(
      farmer.fullId,
      farmer.uuidE,
      V.castUuid().base64Url.substr( 1, 16 ),
      meta.sharingScope || 'full_plot_data',
    );

    const invites = getResearchInvites( group );
    invites.push( invite );
    await saveInvites( group, invites );
    await appendAuditEntry( group, createAuditEntry( 'invite_created', {
      inviteId: invite.id,
      farmerFullId: farmer.fullId,
      farmerUuid: farmer.uuidE,
    } ) );
    $input.value = '';
    if ( renderCallback ) {
      renderCallback();
    }
  }

  function castInviteNode( group, invite, rerender ) {
    const status = invite.status || 'pending';
    const isPending = status === 'pending';
    const isTarget = V.aE()
      && ( V.aE().uuidE === invite.farmerUuid || V.aE().fullId === invite.farmerFullId );
    const allowManage = hasCohortPermission( group, 'manage' );

    return V.cN( {
      c: 'pxy flex justify-between items-center',
      h: [
        V.cN( {
          h: `${invite.farmerFullId} (${status})`,
        } ),
        isPending && ( isTarget || allowManage )
          ? V.cN( {
            c: 'flex',
            h: [
              V.cN( {
                t: 'button',
                c: 'txt-gray fs-s mr-rr',
                h: V.getString( ui.acceptInvite ),
                k: async () => {
                  await handleInviteAction( group, invite.id, 'accepted' );
                  rerender();
                },
              } ),
              V.cN( {
                t: 'button',
                c: 'txt-gray fs-s',
                h: V.getString( ui.declineInvite ),
                k: async () => {
                  await handleInviteAction( group, invite.id, 'declined' );
                  rerender();
                },
              } ),
            ],
          } )
          : '',
      ],
    } );
  }

  function buildResearchDataset( plots ) {
    return plots.map( plot => {
      const yearly = plot.servicefields[V.castServiceField( 'yearsAverageSequence' )];
      const average = plot.servicefields[V.castServiceField( 'averageSequence' )];
      const sequence = V.castJson( yearly || average ) || [];
      const balance = SoilCalculator.getAccumulatedSequenceResults( [ sequence ] );
      return {
        uuidE: plot.uuidE,
        fullId: plot.fullId,
        role: plot.role,
        geometry: plot.geometry,
        servicefields: plot.servicefields,
        humusBalance: balance,
      };
    } );
  }

  function downloadResearchFile( filename, payload, type ) {
    const blob = new Blob( [ payload ], { type: type } );
    const link = document.createElement( 'a' );
    link.href = URL.createObjectURL( blob );
    link.download = filename;
    document.body.appendChild( link );
    link.click();
    document.body.removeChild( link );
    URL.revokeObjectURL( link.href );
  }

  async function renderResearchPanel( group, container ) {
    const groupedUuids = getGroupedUuids( group );
    if ( !groupedUuids.length ) {
      setContainerContent( container, V.cN( {
        c: 'pxy fs-s',
        h: V.getString( ui.noResearchPlots ),
      } ) );
      return;
    }

    if ( !hasCohortPermission( group, 'view_full_data' ) ) {
      setContainerContent( container, '' );
      return;
    }

    const result = await V.getEntity( groupedUuids );
    if ( !result.success || !result.data ) {
      setContainerContent( container, '' );
      return;
    }

    const dataset = buildResearchDataset( result.data );
    const rows = dataset.map( item => V.cN( {
      c: 'pxy fs-s',
      h: `${item.fullId}: C ${item.humusBalance.C.toFixed( 1 )}, N ${item.humusBalance.N.toFixed( 1 )}`,
    } ) );

    setContainerContent( container, [
      V.cN( {
        c: 'pxy font-bold fs-s',
        h: V.getString( ui.membersResearchView ),
      } ),
      ...rows,
      V.cN( {
        c: 'pxy flex',
        h: [
          V.cN( {
            t: 'button',
            c: 'txt-gray fs-s mr-rr',
            h: V.getString( ui.exportJson ),
            k: async () => {
              let payload = {
                exportedAt: new Date().toISOString(),
                group: {
                  uuidE: group.uuidE,
                  fullId: group.fullId,
                },
                scope: getResearchMeta( group ).sharingScope,
                dataset: dataset,
              };

              if ( typeof V.getResearchCohortExport === 'function' && V.getSetting( 'entityLedger' ) === 'MongoDB' ) {
                const exportRes = await V.getResearchCohortExport( {
                  groupFullId: group.fullId,
                  actorUuid: V.aE() ? V.aE().uuidE : undefined,
                  actorFullId: V.aE() ? V.aE().fullId : undefined,
                  scope: getResearchMeta( group ).sharingScope,
                } );
                if ( exportRes && exportRes.success && exportRes.data[0] ) {
                  payload = exportRes.data[0];
                }
              }

              downloadResearchFile(
                `research-${group.uuidE}-${V.castUnix()}.json`,
                JSON.stringify( payload, null, 2 ),
                'application/json',
              );
              await appendAuditEntry( group, createAuditEntry( 'export_json', {
                count: dataset.length,
              } ) );
            },
          } ),
          V.cN( {
            t: 'button',
            c: 'txt-gray fs-s',
            h: V.getString( ui.exportCsv ),
            k: async () => {
              const rows = dataset.map( item => [
                item.uuidE,
                `"${item.fullId.replace( /"/g, '""' )}"`,
                item.role,
                item.humusBalance.C,
                item.humusBalance.N,
                `"${JSON.stringify( item.servicefields ).replace( /"/g, '""' )}"`,
              ].join( ',' ) );

              const csv = [
                'uuidE,fullId,role,humusC,humusN,servicefields',
                ...rows,
              ].join( '\n' );

              downloadResearchFile(
                `research-${group.uuidE}-${V.castUnix()}.csv`,
                csv,
                'text/csv;charset=utf-8',
              );
              await appendAuditEntry( group, createAuditEntry( 'export_csv', {
                count: dataset.length,
              } ) );
            },
          } ),
        ],
      } ),
    ] );
  }

  function renderResearchCohortCard( group ) {
    const meta = getResearchMeta( group );
    const invites = getResearchInvites( group );
    const canManage = hasCohortPermission( group, 'manage' ) || isResearchOwner( group );
    const sharingScope = meta.sharingScope || 'full_plot_data';
    const inviteContainer = V.cN( { c: 'research-invites' } );
    const researchDataContainer = V.cN( { c: 'research-dataset' } );

    const rerenderInvites = () => {
      const currentInvites = getResearchInvites( group );
      setContainerContent( inviteContainer, currentInvites.length
        ? currentInvites.map( invite => castInviteNode( group, invite, rerenderInvites ) )
        : V.cN( { c: 'pxy fs-s', h: V.getString( ui.noInvites ) } ),
      );
      renderResearchPanel( group, researchDataContainer );
    };

    const inputPurpose = V.cN( {
      t: 'textarea',
      c: 'w-full pxy',
      a: { rows: 3, placeholder: V.getString( ui.researchPurpose ) },
      h: meta.purpose || '',
    } );

    const scopeSelect = V.cN( {
      t: 'select',
      c: 'w-full pxy',
      h: [
        V.cN( {
          t: 'option',
          a: { value: 'full_plot_data', selected: sharingScope === 'full_plot_data' ? 'selected' : undefined },
          h: V.getString( ui.fullPlotData ),
        } ),
        V.cN( {
          t: 'option',
          a: { value: 'aggregated_only', selected: sharingScope === 'aggregated_only' ? 'selected' : undefined },
          h: V.getString( ui.aggregatedOnly ),
        } ),
      ],
    } );

    const inviteInput = V.cN( {
      t: 'input',
      c: 'w-full pxy',
      a: {
        placeholder: V.getString( ui.invitePlaceholder ),
      },
    } );

    const content = [
      V.cN( {
        c: 'pxy font-bold fs-s',
        h: V.getString( ui.researchCohort ),
      } ),
      V.cN( {
        c: 'pxy fs-s',
        h: `${V.getString( ui.sharingScope )}: ${V.getString( sharingScope === 'full_plot_data' ? ui.fullPlotData : ui.aggregatedOnly )}`,
      } ),
      canManage
        ? V.cN( {
          c: 'pxy',
          h: [
            V.cN( { c: 'fs-s mb-rr', h: V.getString( ui.researchPurpose ) } ),
            inputPurpose,
            scopeSelect,
            V.cN( {
              t: 'button',
              c: 'txt-gray fs-s mt-rr',
              h: V.getString( ui.saveResearchSettings ),
              k: async () => {
                const nextMeta = getResearchMeta( group );
                nextMeta.purpose = inputPurpose.value;
                nextMeta.sharingScope = scopeSelect.value;
                nextMeta.updatedAt = V.castUnix();
                setGroupFieldLocal( group, 'researchCohortMeta', nextMeta );
                await updateGroupField( group, 'researchCohortMeta', nextMeta );
                await appendAuditEntry( group, createAuditEntry( 'cohort_meta_updated', {
                  sharingScope: nextMeta.sharingScope,
                } ) );
                rerenderInvites();
              },
            } ),
          ],
        } )
        : '',
      canManage
        ? V.cN( {
          c: 'pxy',
          h: [
            V.cN( { c: 'fs-s mb-rr', h: V.getString( ui.inviteFarmer ) } ),
            inviteInput,
            V.cN( {
              t: 'button',
              c: 'txt-gray fs-s mt-rr',
              h: V.getString( ui.sendInvite ),
              k: () => handleSendInvite( group, inviteInput, rerenderInvites ),
            } ),
          ],
        } )
        : '',
      V.cN( {
        c: 'pxy font-bold fs-s',
        h: V.getString( ui.pendingInvites ),
      } ),
      inviteContainer,
      researchDataContainer,
    ];

    rerenderInvites();

    return CanvasComponents.card(
      V.cN( { c: 'group-research-cohort', h: content } ),
      V.getString( ui.researchCohort ),
    );
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

  function drawResearchCohortWidget() {
    const entity = V.getState( 'active' ).lastViewedEntity;

    if ( !isGroupEntity( entity ) ) { return '' }

    return renderResearchCohortCard( entity );
  }

  return {
    drawGroupWidget: drawGroupWidget,
    drawGroupPlotWidget: drawGroupPlotWidget,
    drawGroupTotalBalanceWidget: drawGroupTotalBalanceWidget,
    drawResearchCohortWidget: drawResearchCohortWidget,
  };
} )();
