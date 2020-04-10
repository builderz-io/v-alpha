const systemInit = require( '../systemInit' );
const daysToZero = systemInit.tokenDyn.daysToZero;
const baseTimeToZero = systemInit.tokenDyn.baseTimeToZero * daysToZero;
const initialBalance = systemInit.tokenDyn.initialBalance; // TODO: depends on entity role

const EntityDB = require( '../models/v-entity-model' );
const TxDB = require( '../models/v-transaction-model' );

exports.findByRole = function( req, res ) {

  const find = req != 'all' ? { 'profile.role': req } : {};

  EntityDB.find( find, function( err, entities ) {
    if ( err ) {
      res( {
        success: false,
        status: 'error',
        message: err,
      } );
    }
    else if ( !entities.length ) {
      res( {
        success: false,
        status: 'entities not found',
        message: 'Could not find entities',
      } );
    }
    else {
      res( {
        success: true,
        status: 'success',
        message: 'Entities retrieved successfully',
        data: entities
      } );
    }
  } );
};

exports.findByEvmAddress = function( req, res ) {
  EntityDB.find( { 'evmCredentials.address': req }, function( err, entities ) {
    if ( err ) {
      res( {
        success: false,
        status: 'error',
        message: err,
      } );
    }
    else if ( !entities.length ) {
      res( {
        success: false,
        status: 'entities not found',
        message: 'Could not find entities',
      } );
    }
    else {
      res( {
        success: true,
        status: 'success',
        message: 'Entities retrieved successfully',
        data: entities
      } );
    }
  } );
};

exports.findByFullId = function( req, res ) {

  EntityDB.find( { fullId: req }, function( err, entities ) {
    if ( err ) {
      res( {
        success: false,
        status: 'error',
        message: err,
      } );
    }
    else if ( !entities.length ) {
      res( {
        success: false,
        status: 'entities not found',
        message: 'Could not find entities',
      } );
    }
    else {
      res( {
        success: true,
        status: 'success',
        message: 'Entities retrieved successfully',
        data: entities
      } );
    }
  } );
};

exports.register = function( req, res ) {

  /**
   * @req: Object { title: '', tag: '', role: '', location: '', description: '', unit: '', target: '' }
   *
   */

  const date = new Date();

  // const entityData = req;

  /*
  const newEntity = new EntityDB( {
    fullId: entityData.title + ' ' + entityData.tag,
    evmAddress: entityData.evmAddress,
    uPhrase: entityData.uPhrase,
    credentials: { // replaced with "profile"
      name: entityData.title, // !! key is named 'name' to retain compatibility with VI Alpha One
      tag: entityData.tag,
      role: entityData.role,
      status: 'active', // entityData.status,
      socketID: 'offline' // entityData.socketID,
    },
    evmCredentials: {
      address: entityData.evmAddress,
    },
    properties: {
      location: entityData.location,
      description: entityData.description,
      creator: 'test', // TODO: creator[0].profile.title,
      creatorTag: 'test', // TODO: creator[0].profile.tag,
      created: date,
      fillUntil: new Date( date ).setDate( new Date( date ).getDate() + 7 ), // TODO: systemInit.poolGovernance.fillPeriod
      expires: new Date( date ).setMonth( new Date( date ).getMonth() + 6 ), // TODO: systemInit.poolGovernance.expires
      target: entityData.target,
      unit: entityData.unit,
    },
    stats: {
      sendVolume: 0,
      receiveVolume: 0,
    },
    profile: {
      joined: date,
      lastLogin: date,
      loginExpires: entityData.loginExpires,
      timeZone: entityData.tz,
    },
    owners: [{
      ownerName: 'test', // TODO: tools.constructUserName( entityData.ownerAdmin.creator ),
      ownerTag: 'test' // TODO: entityData.ownerAdmin.creatorTag,
    }],
    admins: [{
      adminName: 'test', // TODO: tools.constructUserName( entityData.ownerAdmin.creator ),
      adminTag: 'test' // TODO: entityData.ownerAdmin.creatorTag,
    }],
    onChain: {
      balance: initialBalance, // TODO: depends on entity role, was "entityData.initialBalance"
      lastMove: Number( Math.floor( date / 1000 ) ),
      timeToZero: baseTimeToZero
    }
  } );
*/

  // if ( entityData.properties ) {
  //   newEntity.properties = entityData.properties;
  // }
  // else {
  //   newEntity.properties = {
  //                            description: '',
  //                            location: '',
  //                            creator: 'test', // TODO: tools.constructUserName( entityData.ownerAdmin.creator ),
  //                            creatorTag: 'test' // TODO: entityData.ownerAdmin.creatorTag,
  //                          };
  // }

  // if ( entityData.location && entityData.lat ) {
  //   newEntity.geometry = {
  //     type: 'Point',
  //     coordinates: [entityData.lng, entityData.lat],
  //   };
  // }
  // else {
  //   newEntity.geometry = {
  //     type: 'Point',
  //     coordinates: [( Math.random() * ( 54 - 32 + 1 ) + 32 ).toFixed( 5 ) * -1, ( Math.random() * ( 35 - 25 + 1 ) + 25 ).toFixed( 5 )],
  //   };
  // }

  // if ( entityData.evmCredentials.address ) {
  //   newEntity.evmCredentials = entityData.evmCredentials;
  // }

  // feed in onChain into entityData when using MongoDB
  // for compatibility with functionality introduced in V Alpha 1

  req.onChain = {
    balance: initialBalance, // TODO: depends on entity role, was "entityData.initialBalance"
    lastMove: Number( Math.floor( date / 1000 ) ),
    timeToZero: baseTimeToZero
  };

  req.profile.verified = false;

  const newEntity = new EntityDB( req );

  newEntity.save( ( err ) => {
    if ( err ) {
      res( {
        success: false,
        status: 'error',
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
            status: 'error',
            message: err,
          } );
        }
        else {
          res( {
            success: true,
            status: 'success',
            message: 'New entity registered successfully'
          } );
        }
      } ); // end newEntityInitialTx save

    } // end new entitiy else
  } ); // end newEntity save

};

exports.verify = function( req, cb ) {

  if ( req.pass != systemInit.communityGovernance.commuPhrase ) {
    return cb( {
      success: false,
      status: 'verification password invalid',
      message: 'Could not verify entity, invalid password'
    } );
  }

  EntityDB.findOne( req, { profile: true } ).exec( ( err, res ) => {
    if ( err || res === null ) {
      return cb( {
        success: false,
        status: 'entity not found',
        message: 'Could not find entity to verify',
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
          status: 'error in verification',
          message: 'Could not verify entity'
        } );
      }
      else {
        return cb( {
          success: true,
          status: 'success',
          message: 'Entity verified successfully'
        } );
      }
    } );
  } );

};

exports.getTags = function( req, res ) {

  const name = req.for;

  EntityDB.find( { 'profile.title': name }, { profile: true } ).exec( ( err, entities ) => {
    if ( err ) {
      res( {
        success: false,
        status: 'error',
        message: err
      } );
    }
    else {
      const tags = [];
      entities.forEach( item => {tags.push( item.profile.tag )} );
      res( {
        success: true,
        status: 'success',
        message: 'Tags retrieved successfully',
        data: tags
      } );
    }
  } );
};
