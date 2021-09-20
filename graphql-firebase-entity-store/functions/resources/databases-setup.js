/**

1. set deployment location in firebase
For production env run -> firebase use entity-namespace
For development env run -> firebase use entity-profile

to list projects run -> firebase projects:list

2. set production true/false below

*/

const local = false;

const production = false;

const dev = production ? '' : '-dev';

const admin = require( 'firebase-admin' );

const credentials = require( '../credentials/credentials' );

// var authServiceAccount = require( './entity-authentication-creds.json' );
// var namespaceServiceAccount = require( './entity-namespace-creds.json' );
// var profileServiceAccount = require( './entity-profile-creds.json' );

const authDb = admin.initializeApp( {
  credential: admin.credential.cert( credentials.auth ),
  databaseURL: local
    ? 'http://localhost:9000/?ns=entity-authentication-dev'
    : 'https://entity-authentication' + dev + '.firebaseio.com',
}, 'authentication' );

const namespaceDb = admin.initializeApp( {
  credential: admin.credential.cert( credentials.namespace ),
  databaseURL: local
    ? 'http://localhost:9000/?ns=entity-namespace-dev'
    : 'https://entity-namespace' + dev + '.firebaseio.com/',
}, 'namespace' );

const profileDb = admin.initializeApp( {
  credential: admin.credential.cert( credentials.profile ),
  databaseURL: local
    ? 'http://localhost:9000/?ns=entity-profile-dev'
    : 'https://entity-profile' + dev + '.firebaseio.com/',
}, 'profile' );

module.exports.authDb = authDb;
module.exports.namespaceDb = namespaceDb;
module.exports.profileDb = profileDb;
