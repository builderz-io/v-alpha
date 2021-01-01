const admin = require( 'firebase-admin' );

var authServiceAccount = require( './entity-authentication-creds.json' );
var namespaceServiceAccount = require( './entity-namespace-creds.json' );
var profileServiceAccount = require( './entity-profile-creds.json' );

const authDb = admin.initializeApp( {
  credential: admin.credential.cert( authServiceAccount ),
  databaseURL: 'https://entity-authentication-default-rtdb.firebaseio.com'
}, 'authentication' );

const namespaceDb = admin.initializeApp( {
  credential: admin.credential.cert( namespaceServiceAccount ),
  databaseURL: 'https://entity-namespace.firebaseio.com/'
}, 'namespace' );

const profileDb = admin.initializeApp( {
  credential: admin.credential.cert( profileServiceAccount ),
  databaseURL: 'https://entity-profile.firebaseio.com/'
}, 'profile' );

module.exports.authDb = authDb;
module.exports.namespaceDb = namespaceDb;
module.exports.profileDb = profileDb;
