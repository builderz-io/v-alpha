/**

1. set deployment location in firebase
For production env run -> firebase use entity-namespace
For development env run -> firebase use entity-profile

to list projects run -> firebase projects:list

*/

const env = {

  use: 'clientDFR',

  local: false, /* set to "true" to save data locally when running importer */

  prod: {
    dbAffix: '',
  },
  dev: {
    dbAffix: '-dev',
  },
  clientDFR: {
    dbAffix: '-client-dfr',
  },
};

const admin = require( 'firebase-admin' );

const credentials = require( '../credentials/credentials' );

// var authServiceAccount = require( './entity-authentication-creds.json' );
// var namespaceServiceAccount = require( './entity-namespace-creds.json' );
// var profileServiceAccount = require( './entity-profile-creds.json' );

const authDb = admin.initializeApp( {
  credential: admin.credential.cert( credentials.auth ),
  databaseURL: env.local
    ? 'http://localhost:9000/?ns=entity-authentication-dev'
    : 'https://entity-authentication' + env[env.use].dbAffix + '.firebaseio.com',
}, 'authentication' );

const namespaceDb = admin.initializeApp( {
  credential: admin.credential.cert( credentials.namespace ),
  databaseURL: env.local
    ? 'http://localhost:9000/?ns=entity-namespace-dev'
    : 'https://entity-namespace' + env[env.use].dbAffix + '.firebaseio.com/',
}, 'namespace' );

const profileDb = admin.initializeApp( {
  credential: admin.credential.cert( credentials.profile ),
  databaseURL: env.local
    ? 'http://localhost:9000/?ns=entity-profile-dev'
    : 'https://entity-profile' + env[env.use].dbAffix + '.firebaseio.com/',
}, 'profile' );

const imageDb = admin.initializeApp( {
  credential: admin.credential.cert( credentials.profile ),
  databaseURL: env.local
    ? 'http://localhost:9000/?ns=entity-profile-image-dev'
    : 'https://entity-profile-image' + env[env.use].dbAffix + '.firebaseio.com/',
}, 'image' );

module.exports.authDb = authDb;
module.exports.namespaceDb = namespaceDb;
module.exports.profileDb = profileDb;
module.exports.imageDb = imageDb;
