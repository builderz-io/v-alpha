const systemInit = require( '../systemInit' );
const daysToZero = systemInit.tokenDyn.daysToZero;
const baseTimeToZero = systemInit.tokenDyn.baseTimeToZero * daysToZero;
const initialBalance = systemInit.tokenDyn.initialBalance; // TODO: depends on entity role

const EntityDB = require( '../models/v-entity-model' );
const TxDB = require( '../models/v-transaction-model' );

exports.findByRole = function( req, res ) {

  const find = req ? req.role ? { 'credentials.role': req.role } : {} : {};

  EntityDB.find( find, function( err, entities ) {
    if ( err ) {
      res( {
        status: 'error',
        message: err,
      } );
    }
    else {
      res( {
        status: 'success',
        message: 'Entities retrieved successfully',
        data: entities
      } );
    }
  } );
};

exports.findByEthAddress = function( req, res ) {
  EntityDB.find( { 'ethCredentials.address': req }, function( err, entities ) {
    if ( err ) {
      res( {
        status: 'error',
        message: err,
      } );
    }
    else {
      res( {
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
        status: 'error',
        message: err,
      } );
    }
    else {
      res( {
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

  const entityData = req;

  const date = new Date();

  const newEntity = new EntityDB( {
    fullId: entityData.title + ' ' + entityData.tag,
    uPhrase: entityData.uPhrase,
    credentials: {
      name: entityData.title, // !! key is named 'name' to retain compatibility with VI Alpha One
      tag: entityData.tag,
      role: entityData.role,
      status: 'active', // entityData.status,
      socketID: 'offline' // entityData.socketID,
    },
    ethCredentials: {
      address: entityData.ethAddress,
    },
    properties: {
      location: entityData.location,
      description: entityData.description,
      creator: 'test', // TODO: creator[0].credentials.name,
      creatorTag: 'test', // TODO: creator[0].credentials.tag,
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

  if ( entityData.location && entityData.lat ) {
    newEntity.geometry = {
      type: 'Point',
      coordinates: [entityData.lng, entityData.lat],
    };
  }
  else {
    newEntity.geometry = {
      type: 'Point',
      coordinates: [( Math.random() * ( 54 - 32 + 1 ) + 32 ).toFixed( 5 ) * -1, ( Math.random() * ( 35 - 25 + 1 ) + 25 ).toFixed( 5 )],
    };
  }

  // TODO:
  // if ( entityData.ethCredentials.address ) {
  //   newEntity.ethCredentials = entityData.ethCredentials;
  // }

  newEntity.save( ( err ) => {
    if ( err ) {
      res( {
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
        fullId: entityData.title + ' ' + entityData.tag,
        name: entityData.title,
        tag: entityData.tag,
        txHistory: {
          date: date,
          initiator: commName,
          initiatorTag: commTag,
          from: commName,
          fromTag: commTag,
          to: entityData.title,
          toTag: entityData.tag,
          for: 'Initial Balance', // TODO: i18n.strInit110,
          senderFee: 0,
          burned: 0,
          tt0: baseTimeToZero,
          credit: initialBalance,
          debit: 0,
          chainBalance: initialBalance,
        }
      } );

      newEntityInitialTx.save( ( err ) => {
        if ( err ) {
          res( {
            status: 'error',
            message: err,
          } );
        }
        else {
          res( {
            status: 'success',
            message: 'New entity registered successfully'
          } );
        }
      } ); // end newEntityInitialTx save

    } // end new entitiy else
  } ); // end newEntity save

};

exports.getTags = function( req, res ) {

  const name = req.for;

  EntityDB.find( { 'credentials.name': name }, { credentials: true } ).exec( ( err, entities ) => {
    if ( err ) {
      res( {
        status: 'error',
        message: err
      } );
    }
    else {
      const tags = [];
      entities.forEach( item => {tags.push( item.credentials.tag )} );
      res( {
        status: 'success',
        message: 'Tags retrieved successfully',
        data: tags
      } );
    }
  } );
};
