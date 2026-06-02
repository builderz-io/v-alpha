const systemInit = require( '../systemInit' );
const daysToZero = systemInit.tokenDyn.daysToZero;
const baseTimeToZero = systemInit.tokenDyn.baseTimeToZero * daysToZero;
const initialBalance = systemInit.tokenDyn.initialBalance; // TODO: depends on entity role

const autoFloat = require( '../lib/auto-float' ).autoFloat;
const telegramNotification = require( '../lib/telegram' ).adminNotify;

const EntityDB = require( '../models/v-entity-model' );
const TxDB = require( '../models/v-transaction-model' );
const RESEARCH_FIELDS = {
  meta: 'servicefields.s32',
  invites: 'servicefields.s33',
  consent: 'servicefields.s34',
  audit: 'servicefields.s35',
  members: 'servicefields.s30',
};

function roleFilter( role ) {
  if ( role === 'Group' ) {
    return { 'profile.role': { $in: ['Group', 'aq'] } };
  }
  return { 'profile.role': role };
}

function castJson( value, fallback ) {
  try {
    if ( value == null ) { return fallback }
    if ( typeof value === 'string' ) {
      return JSON.parse( value );
    }
    return value;
  }
  catch ( e ) {
    return fallback;
  }
}

function castResearchMeta( entity ) {
  const servicefields = entity && entity.servicefields ? entity.servicefields : {};
  return castJson( servicefields.s32, {} ) || {};
}

function castConsentRecords( entity ) {
  const servicefields = entity && entity.servicefields ? entity.servicefields : {};
  return castJson( servicefields.s34, [] ) || [];
}

function castGroupedEntities( entity ) {
  const servicefields = entity && entity.servicefields ? entity.servicefields : {};
  return castJson( servicefields.s30, [] ) || [];
}

function canManageResearch( actorUuid, meta ) {
  if ( !actorUuid || !meta ) { return false }
  const roles = meta.roles || {};
  const owners = Array.isArray( roles.researchOwner ) ? roles.researchOwner : [];
  const collaborators = Array.isArray( roles.researchCollaborator ) ? roles.researchCollaborator : [];
  return owners.includes( actorUuid )
    || collaborators.includes( actorUuid )
    || meta.ownerUuid === actorUuid;
}

function canViewFullData( actorUuid, meta ) {
  if ( !actorUuid || !meta ) { return false }
  const roles = meta.roles || {};
  const owners = Array.isArray( roles.researchOwner ) ? roles.researchOwner : [];
  const collaborators = Array.isArray( roles.researchCollaborator ) ? roles.researchCollaborator : [];
  const farmers = Array.isArray( roles.farmerMember ) ? roles.farmerMember : [];
  return owners.includes( actorUuid )
    || collaborators.includes( actorUuid )
    || farmers.includes( actorUuid )
    || meta.ownerUuid === actorUuid;
}

async function findEntity( query, filter ) {
  return new Promise( resolve => {
    // EntityDB.find( query ).sort( { $natural: -1 } ).limit( 35 ).exec( ( err, entities ) => {
    EntityDB.find( query, filter ).exec( ( err, entities ) => {
      if ( err ) {
        resolve( {
          success: false,
          status: 'error in find (entity)',
          message: err,
        } );
      }
      else if ( !entities.length ) {
        resolve( {
          success: false,
          status: 'could not find entities',
        } );
      }
      else {
        resolve( {
          success: true,
          status: 'entities retrieved',
          data: entities,
        } );
      }
    } );
  } );
}

exports.findByRole = async function( req, res ) {

  let find, filter;

  if ( req == 'preview' ) {
    find = {};
    filter = {
      'fullId': 1,
      'profile.role': 1,
      'thumbnail': 1,
      'geometry': 1,
      'properties.description': 1,
      '_id': 0,
    };
  }
  else if ( req == 'all' ) {
    find = {};
    filter = {
      private: 0,
      _id: 0,
    };
  }
  else {
    find = roleFilter( req );
    filter = {
      private: 0,
      _id: 0,
    };
  }

  // const find = req != 'all' ? { 'profile.role': req } : {};
  const query = { $and: [find, { 'status.active': true }] };

  res( await findEntity( query, filter ) );

};

exports.findByEvmAddress = async function( req, res ) {

  const find = { 'evmCredentials.address': req };

  res( await findEntity( find ) );

};

exports.findBySymbolAddress = async function( req, res ) {

  const find = { 'symbolCredentials.address': req };

  res( await findEntity( find ) );

};

exports.findByFullId = async function( req, res ) {

  const find = { fullId: req };

  res( await findEntity( find ) );

};

exports.findByUuidE = async function( req, res ) {

  const raw = Array.isArray( req ) ? req : [req];
  const uuids = raw.map( item => {
    if ( typeof item === 'object' && item ) {
      return item.uuidE || item.a;
    }
    return item;
  } ).filter( Boolean );

  const find = { 'profile.uuidV4': { $in: uuids } };
  const query = { $and: [find, { 'status.active': true }] };

  res( await findEntity( query, {
    private: 0,
    _id: 0,
  } ) );

};

exports.findByUPhrase = async function( req, res ) {

  const find = { 'private.uPhrase': req };

  res( await findEntity( find ) );

};

exports.findByQuery = async function( req, res ) {

  const roleClause = req.role == 'all' ? {} : roleFilter( req.role );
  const trimmedQuery = req.query ? String( req.query ).trim() : '';
  let find;

  if ( !trimmedQuery ) {
    find = { $and: [roleClause, { 'status.active': true }] };
  }
  else {
    const regex = { $regex: new RegExp( trimmedQuery, 'i' ) };
    find = {
      $and: [
        roleClause,
        { 'status.active': true },
        { $or: [
          { 'profile.title': regex },
          { 'properties.baseLocation': regex },
          { 'properties.description': regex },
        ] },
      ],
    };
  }

  res( await findEntity( find, {
    private: 0,
    _id: 0,
  } ) );

};

exports.findResearchCohortsByOwner = async function( req, res ) {
  const ownerUuid = typeof req === 'string' ? req : req.ownerUuid;
  if ( !ownerUuid ) {
    return res( {
      success: false,
      status: 'missing owner uuid',
    } );
  }

  const query = {
    $and: [
      roleFilter( 'Group' ),
      { 'status.active': true },
      { [`${RESEARCH_FIELDS.meta}.ownerUuid`]: ownerUuid },
    ],
  };

  res( await findEntity( query, {
    private: 0,
    _id: 0,
  } ) );
};

exports.setResearchInviteState = async function( req, cb ) {
  if ( !req || !req.groupFullId || !req.invites ) {
    return cb( {
      success: false,
      status: 'invalid invite payload',
    } );
  }

  const group = await EntityDB.findOne( { fullId: req.groupFullId } )
    .select( 'fullId profile.uuidV4 servicefields status' )
    .lean();

  if ( !group || ( group.status && group.status.active === false ) ) {
    return cb( {
      success: false,
      status: 'cohort not found',
    } );
  }

  const meta = castResearchMeta( group );
  if ( !canManageResearch( req.actorUuid, meta ) ) {
    return cb( {
      success: false,
      status: 'not authorized to update invite state',
    } );
  }

  const now = Math.floor( Date.now() / 1000 );
  const safeInvites = req.invites.map( invite => {
    const next = Object.assign( {}, invite );
    if ( !next.token ) {
      next.token = String( now ) + String( Math.floor( Math.random() * 100000 ) );
    }
    if ( !next.expiresAt ) {
      next.expiresAt = now + ( 60 * 60 * 24 * 14 );
    }
    return next;
  } );
  const auditEntry = {
    id: req.auditId || String( now ) + String( Math.floor( Math.random() * 10000 ) ),
    action: req.action || 'invite_update',
    actorUuid: req.actorUuid,
    actorFullId: req.actorFullId,
    at: now,
  };

  return EntityDB.findOneAndUpdate(
    { fullId: req.groupFullId },
    {
      $set: {
        [RESEARCH_FIELDS.invites]: safeInvites,
        [RESEARCH_FIELDS.meta]: req.meta || meta,
        [RESEARCH_FIELDS.members]: req.groupedEntities || castGroupedEntities( group ),
        [RESEARCH_FIELDS.consent]: req.consentRecords || castConsentRecords( group ),
      },
      $push: {
        [RESEARCH_FIELDS.audit]: auditEntry,
      },
    },
    { new: true },
    ( err, entity ) => {
      if ( err ) {
        return cb( {
          success: false,
          status: 'could not update invite state',
          message: err,
        } );
      }
      return cb( {
        success: true,
        status: 'invite state updated',
        data: [ entity ],
      } );
    },
  );
};

exports.exportResearchCohortData = async function( req, cb ) {
  if ( !req || !req.groupFullId ) {
    return cb( {
      success: false,
      status: 'missing groupFullId',
    } );
  }

  const group = await EntityDB.findOne( { fullId: req.groupFullId } )
    .select( 'fullId profile.uuidV4 servicefields status' )
    .lean();

  if ( !group || ( group.status && group.status.active === false ) ) {
    return cb( {
      success: false,
      status: 'cohort not found',
    } );
  }

  const meta = castResearchMeta( group );
  const hasPermission = canViewFullData( req.actorUuid, meta );
  if ( !hasPermission ) {
    return cb( {
      success: false,
      status: 'not authorized for full cohort export',
    } );
  }

  const consentRecords = castConsentRecords( group );
  const activeConsentUuids = consentRecords
    .filter( item => item.status === 'active' )
    .map( item => item.farmerUuid );
  const members = castGroupedEntities( group );

  const plots = await EntityDB.find( {
    'profile.uuidV4': { $in: members },
    'status.active': true,
  } ).select( {
    fullId: 1,
    profile: 1,
    geometry: 1,
    properties: 1,
    servicefields: 1,
    _id: 0,
  } ).lean();

  const scopedPlots = req.scope === 'aggregated_only'
    ? plots.map( item => ( {
      fullId: item.fullId,
      profile: {
        uuidV4: item.profile.uuidV4,
        role: item.profile.role,
      },
      servicefields: {
        s29: item.servicefields ? item.servicefields.s29 : undefined,
        s28: item.servicefields ? item.servicefields.s28 : undefined,
      },
    } ) )
    : plots;

  const consentFilteredPlots = scopedPlots.filter( plot => {
    if ( !plot.profile || !plot.profile.uuidV4 ) { return true }
    if ( activeConsentUuids.length === 0 ) { return true }
    return activeConsentUuids.includes( plot.profile.uuidV4 );
  } );

  const auditEntry = {
    id: String( Math.floor( Date.now() / 1000 ) ) + String( Math.floor( Math.random() * 10000 ) ),
    action: 'export_full_plot_data',
    actorUuid: req.actorUuid,
    actorFullId: req.actorFullId,
    at: Math.floor( Date.now() / 1000 ),
    count: consentFilteredPlots.length,
  };

  await EntityDB.findOneAndUpdate(
    { fullId: req.groupFullId },
    {
      $push: {
        [RESEARCH_FIELDS.audit]: auditEntry,
      },
    },
    { new: false },
  );

  return cb( {
    success: true,
    status: 'research export ready',
    data: [{
      groupFullId: req.groupFullId,
      groupUuid: group.profile && group.profile.uuidV4,
      generatedAt: new Date().toISOString(),
      sharingScope: req.scope || 'full_plot_data',
      consentFiltered: activeConsentUuids.length > 0,
      plots: consentFilteredPlots,
    }],
  } );
};

exports.__test = {
  castJson: castJson,
  castResearchMeta: castResearchMeta,
  castConsentRecords: castConsentRecords,
  castGroupedEntities: castGroupedEntities,
  canManageResearch: canManageResearch,
  canViewFullData: canViewFullData,
};

exports.register = function( req, res ) {

  /**
   * @req: full entity data object
   *
   */

  if ( req.profile.role == 'Person' ) {
    telegramNotification( {
      msg: 'New registration at',
      network: systemInit.communityGovernance.commName,
    } );
    autoFloat( req.evmCredentials.address );
  }

  const date = new Date();

  // feed in onChain into entityData when using MongoDB
  // for compatibility with functionality introduced in V Alpha 1

  req.onChain = {
    balance: initialBalance, // TODO: depends on entity role, was "entityData.initialBalance"
    lastMove: Number( Math.floor( date / 1000 ) ),
    timeToZero: baseTimeToZero,
  };

  const newEntity = new EntityDB( req );

  newEntity.save( ( err ) => {
    if ( err ) {
      res( {
        success: false,
        status: 'error in save (register new entity)',
        message: err,
      } );
    }
    else {

      const commName = systemInit.communityGovernance.commName;
      const commTag = systemInit.communityGovernance.commTag;

      const daysToZero = systemInit.tokenDyn.daysToZero;
      const baseTimeToZero = systemInit.tokenDyn.baseTimeToZero * daysToZero;

      const newEntityInitialTx = new TxDB( {
        fullId: req.fullId,
        name: req.profile.title,
        tag: req.profile.tag,
        txHistory: {
          date: date,
          initiator: commName,
          initiatorTag: commTag,
          from: commName,
          fromTag: commTag,
          to: req.profile.title,
          toTag: req.profile.tag,
          for: 'Initial Balance', // TODO: i18n.strInit110,
          senderFee: 0,
          burned: 0,
          tt0: baseTimeToZero,
          credit: initialBalance,
          debit: 0,
          chainBalance: initialBalance,
          amount: initialBalance,
          txType: 'generated',
          title: commName + ' ' + commTag,
          fromAddress: 'none',
          toAddress: 'none',
        },
      } );

      newEntityInitialTx.save( ( err ) => {
        if ( err ) {
          res( {
            success: false,
            status: 'error in save (inital transaction)',
            message: err,
          } );
        }
        else {
          res( {
            success: true,
            status: 'new entity and inital transaction registered',
            data: [ newEntity ],
          } );
        }
      } ); // end newEntityInitialTx save

    } // end new entitiy else
  } ); // end newEntity save

};

exports.update = async function( req, cb ) {
  let how;

  if ( req.field == 'evmCredentials.address' && req.role == 'Person' ) {
    autoFloat( req.data );
  }

  if ( req.field == 'status.verified' && req.data == true ) {
    const entity = await findEntity( { fullId: req.entity } );
    console.log( 'trigger float manually for:', entity.data[0].evmCredentials.address );
    autoFloat( entity.data[0].evmCredentials.address );
  }

  if ( req.field == 'properties.baseLocation' ) {
    how = {
      $set: {
        'properties.baseLocation': req.data.value,
        'properties.currentLocation': req.data.value,
        'geometry.rand': req.data.rand,
        'geometry.type': 'Point',
        'geometry.coordinates': [Number( req.data.lng ), Number( req.data.lat )],
      },
    };
  }
  else if ( req.field == 'evmCredentials.address' ) {
    how = {
      $set: {
        'evmCredentials.address': req.data,
        'evmCredentials.privateKey': undefined,
        'receivingAddresses.evm': undefined,
      },
    };
  }
  else if ( req.field == 'adminOf' ) {
    how = {
      $push: {
        adminOf: req.data,
      },
    };
  }
  else {
    const updateWhat = {};
    updateWhat[req.field] = req.data;
    how = req.data === '' ? { $unset: updateWhat } : { $set: updateWhat };
  }

  EntityDB.findOneAndUpdate(
    { fullId: req.entity },
    how,
    { new: true },
    ( err, res ) => {
      if ( err ) {
        return cb( {
          success: false,
          status: 'error in updating',
          message: err,
        } );
      }
      else {
        return cb( {
          success: true,
          status: 'entity updated',
          data: [ res ],
        } );
      }
    },
  );
};
//
// exports.verify = function( req, cb ) {
//   console.log( req );
//   if ( req.adminPass != systemInit.communityGovernance.commuPhrase ) {
//     return cb( {
//       success: false,
//       status: 'invalid password',
//     } );
//   }
//
//   EntityDB.findOne( { fullId: req.fullId }, { profile: true } ).exec( ( err, res ) => {
//     if ( err ) {
//       return cb( {
//         success: false,
//         status: 'error in find (verify entity)',
//         message: err
//       } );
//     }
//     if ( res === null ) {
//       return cb( {
//         success: false,
//         status: 'could not find entity to verify',
//       } );
//     }
//     res.status.active = true;
//     res.status.verified = true;
//     // res.profile.loginExpires = new Date().setMonth( new Date().getMonth() + 12 );
//
//     res.save( ( err ) => {
//       if ( err ) {
//         return cb( {
//           success: false,
//           status: 'error in save (verify entity)',
//           message: err
//         } );
//       }
//       else {
//         return cb( {
//           success: true,
//           status: 'entity verified',
//         } );
//       }
//     } );
//   } );
//
// };
