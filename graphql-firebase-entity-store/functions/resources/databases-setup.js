const admin = require( 'firebase-admin' );

var namespaceServiceAccount = require( './entity-namespace-creds.json' );
var profileServiceAccount = require( './entity-profile-creds.json' );

const namespaceDb = admin.initializeApp( {
  credential: admin.credential.cert( namespaceServiceAccount ),
  databaseURL: 'https://entity-namespace.firebaseio.com/'
}, 'namespace' );

const profileDb = admin.initializeApp( {
  credential: admin.credential.cert( profileServiceAccount ),
  databaseURL: 'https://entity-profile.firebaseio.com/'
}, 'profile' );

module.exports.namespaceDb = namespaceDb;
module.exports.profileDb = profileDb;
