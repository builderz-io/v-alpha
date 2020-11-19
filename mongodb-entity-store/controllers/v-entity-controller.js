const systemInit = require( '../systemInit' );
const daysToZero = systemInit.tokenDyn.daysToZero;
const baseTimeToZero = systemInit.tokenDyn.baseTimeToZero * daysToZero;
const initialBalance = systemInit.tokenDyn.initialBalance; // TODO: depends on entity role

const autoFloat = require( '../lib/auto-float' ).autoFloat;
const telegramNotification = require( '../lib/telegram' ).adminNotify;

const EntityDB = require( '../models/v-entity-model' );
const TxDB = require( '../models/v-transaction-model' );

async function findEntity( query, exclude ) {
  return new Promise( resolve => {
    // EntityDB.find( query ).sort( { $natural: -1 } ).limit( 35 ).exec( ( err, entities ) => {
    EntityDB.find( query, exclude ? { private: 0 } : {} ).exec( ( err, entities ) => {
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
          data: entities
        } );
      }
    } );
  } );
}

exports.findByRole = async function( req, res ) {

  const find = req != 'all' ? { 'profile.role': req } : {};
  const query = { $and: [find, { 'status.active': true }] };

  res( await findEntity( query, true ) );

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

exports.findByUPhrase = async function( req, res ) {

  const find = { 'private.uPhrase': req };

  res( await findEntity( find ) );

};

exports.findByQuery = async function( req, res ) {

  const regex = { $regex: new RegExp( req.query, 'i' ) };

  const find = {
    $and: [
      req.role == 'all' ? {} : { 'profile.role': req.role },
      { $or: [
        { 'profile.title': regex },
        { 'properties.baseLocation': regex },
        { 'properties.description': regex }
      ] }
    ]
  };

  res( await findEntity( find ) );

};

exports.register = function( req, res ) {

  /**
   * @req: full entity data object
   *
   */

  if ( req.profile.role == 'member' ) {
    telegramNotification( {
      msg: 'New registration at',
      network: systemInit.communityGovernance.commName
    } );
    autoFloat( req.evmCredentials.address );
  }

  const date = new Date();

  // feed in onChain into entityData when using MongoDB
  // for compatibility with functionality introduced in V Alpha 1

  req.onChain = {
    balance: initialBalance, // TODO: depends on entity role, was "entityData.initialBalance"
    lastMove: Number( Math.floor( date / 1000 ) ),
    timeToZero: baseTimeToZero
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
          toAddress: 'none'
        }
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
            data: [ newEntity ]
          } );
        }
      } ); // end newEntityInitialTx save

    } // end new entitiy else
  } ); // end newEntity save

};

exports.update = async function( req, cb ) {
  let how;

  if ( req.field == 'evmCredentials.address' && req.role == 'member' ) {
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
        'receivingAddresses.evm': undefined
      }
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
          message: err
        } );
      }
      else {
        return cb( {
          success: true,
          status: 'entity updated',
          data: [ res ]
        } );
      }
    }
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
