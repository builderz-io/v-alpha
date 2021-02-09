const admin = require( 'firebase-admin' );

const credentials = require( '../credentials/credentials' );

// var authServiceAccount = require( './entity-authentication-creds.json' );
// var namespaceServiceAccount = require( './entity-namespace-creds.json' );
// var profileServiceAccount = require( './entity-profile-creds.json' );

const authDb = admin.initializeApp( {
  credential: admin.credential.cert( credentials.auth ),
  databaseURL: 'https://entity-authentication.firebaseio.com',
}, 'authentication' );

const namespaceDb = admin.initializeApp( {
  credential: admin.credential.cert( credentials.namespace ),
  databaseURL: 'https://entity-namespace.firebaseio.com/',
}, 'namespace' );

const profileDb = admin.initializeApp( {
  credential: admin.credential.cert( credentials.profile ),
  databaseURL: 'https://entity-profile.firebaseio.com/',
}, 'profile' );

module.exports.authDb = authDb;
module.exports.namespaceDb = namespaceDb;
module.exports.profileDb = profileDb;
