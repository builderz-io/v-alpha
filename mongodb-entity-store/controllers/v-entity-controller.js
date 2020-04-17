const systemInit = require( '../systemInit' );
const daysToZero = systemInit.tokenDyn.daysToZero;
const baseTimeToZero = systemInit.tokenDyn.baseTimeToZero * daysToZero;
const initialBalance = systemInit.tokenDyn.initialBalance; // TODO: depends on entity role

const EntityDB = require( '../models/v-entity-model' );
const TxDB = require( '../models/v-transaction-model' );

async function findEntity( query ) {
  return new Promise( resolve => {
    EntityDB.find( query ).exec( ( err, entities ) => {
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

  res( await findEntity( find ) );

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

  const find = { uPhrase: req };

  res( await findEntity( find ) );

};

exports.register = function( req, res ) {

  /**
   * @req: full entity data object
   *
   */

  const date = new Date();

  // feed in onChain into entityData when using MongoDB
  // for compatibility with functionality introduced in V Alpha 1

  req.onChain = {
    balance: initialBalance, // TODO: depends on entity role, was "entityData.initialBalance"
    lastMove: Number( Math.floor( date / 1000 ) ),
    timeToZero: baseTimeToZero
  };

  // force verification to be false
  req.profile.verified = false;

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
          fromAddress: 'address unaval',
          toAddress: 'address unaval'
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

exports.verify = function( req, cb ) {
  console.log( req );
  if ( req.adminPass != systemInit.communityGovernance.commuPhrase ) {
    return cb( {
      success: false,
      status: 'invalid password',
    } );
  }

  EntityDB.findOne( { fullId: req.fullId }, { profile: true } ).exec( ( err, res ) => {
    if ( err ) {
      return cb( {
        success: false,
        status: 'error in find (verify entity)',
        message: err
      } );
    }
    if ( res === null ) {
      return cb( {
        success: false,
        status: 'could not find entity to verify',
      } );
    }
    res.profile.role = 'member';
    res.profile.status = 'active';
    res.profile.verified = true;
    // res.profile.loginExpires = new Date().setMonth( new Date().getMonth() + 12 );

    res.save( ( err ) => {
      if ( err ) {
        return cb( {
          success: false,
          status: 'error in save (verify entity)',
          message: err
        } );
      }
      else {
        return cb( {
          success: true,
          status: 'entity verified',
        } );
      }
    } );
  } );

};
