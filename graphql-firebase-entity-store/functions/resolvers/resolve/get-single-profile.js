// Connect to firebase database
const { profileDb } = require( '../../resources/databases-setup' );
const colP = profileDb.database().ref( 'profiles' );

module.exports = ( uuidP ) => colP.child( uuidP ).once( 'value' )
  .then( snap => [snap.val()] );
