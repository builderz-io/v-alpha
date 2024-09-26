/**

1. set deployment location in firebase
For production env run -> firebase use entity-namespace
For staging env run -> firebase use entity-authentication
For development env run -> firebase use entity-profile

to list projects run -> firebase projects:list

*/

const admin = require( 'firebase-admin' );

const credentials = require( '../credentials/credentials' );

function dBInit( dbEnv ) {

  const env = {

    use: 'dev',

    local: false, /* set to "true" to save data locally when running importer */

    host: {
      dbAffix: '-' + dbEnv,
    },
    prod: {
      dbAffix: '',
    },
    staging: {
      dbAffix: '-staging',
    },
    dev: {
      dbAffix: '-dev',
    },
    clientDFR: {
      dbAffix: '-client-dfr',
    },
    external: 'clientDFR',
  };

  const authDb = admin.initializeApp( {
    credential: admin.credential.cert( credentials.auth ),
    databaseURL: env.local
      ? 'http://localhost:9000/?ns=entity-authentication-dev'
      : env.use == 'external'
        ? credentials.dbEnvs[env.external]['authentication']
        : 'https://entity-authentication' + env[env.use].dbAffix + '.firebaseio.com',
  }, 'authentication' );

  const namespaceDb = admin.initializeApp( {
    credential: admin.credential.cert( credentials.namespace ),
    databaseURL: env.local
      ? 'http://localhost:9000/?ns=entity-namespace-dev'
      : env.use == 'external'
        ? credentials.dbEnvs[env.external]['namespace']
        : 'https://entity-namespace' + env[env.use].dbAffix + '.firebaseio.com',
  }, 'namespace' );

  const profileDb = admin.initializeApp( {
    credential: admin.credential.cert( credentials.profile ),
    databaseURL: env.local
      ? 'http://localhost:9000/?ns=entity-profile-dev'
      : env.use == 'external'
        ? credentials.dbEnvs[env.external]['profile']
        : 'https://entity-profile' + env[env.use].dbAffix + '.firebaseio.com',
  }, 'profile' );

  const imageDb = admin.initializeApp( {
    credential: admin.credential.cert( credentials.profile ),
    databaseURL: env.local
      ? 'http://localhost:9000/?ns=entity-profile-image-dev'
      : env.use == 'external'
        ? credentials.dbEnvs[env.external]['profile-image']
        : 'https://entity-profile-image' + env[env.use].dbAffix + '.firebaseio.com',
  }, 'image' );

  const collE = namespaceDb.database().ref( 'databases/default/' + 'entities' );
  const collP = profileDb.database().ref( 'databases/default/' + 'profiles' );
  const collA = authDb.database().ref( 'databases/default/' + 'authentication' );
  const collI = imageDb.database().ref( 'databases/default/' + 'images' );

  return {
    authDb: authDb,
    namespaceDb: namespaceDb,
    profileDb: profileDb,
    imageDb: imageDb,

    collE: collE,
    collP: collP,
    collA: collA,
    collI: collI,
  };
}

function setDbReference( referer ) {
  // TODO: change database reference as per html request
  const network = referer.replace( /[.:]/g, '-' );
  console.log( '\n\x1b[33m', network, '\x1b[0m\n' );

  // global.db.authDb.options_.databaseURL = 'https://entity-authentication' + dbAffix + '.firebaseio.com/';
  // global.db.namespaceDb.options_.databaseURL = 'https://entity-namespace' + dbAffix + '.firebaseio.com/';
  // global.db.profileDb.options_.databaseURL = 'https://entity-profile' + dbAffix + '.firebaseio.com/';
  // global.db.imageDb.options_.databaseURL = 'https://entity-profile-image' + dbAffix + '.firebaseio.com/';

  global.db.collE = global.db.namespaceDb.database().ref( 'databases/' + network + '/' + 'entities' );
  global.db.collP = global.db.profileDb.database().ref( 'databases/' + network + '/' + 'profiles' );
  global.db.collA = global.db.authDb.database().ref( 'databases/' + network + '/' + 'authentication' );
  global.db.collI = global.db.imageDb.database().ref( 'databases/' + network + '/' + 'images' );
}

module.exports.dBInit = dBInit;
module.exports.setDbReference = setDbReference;
