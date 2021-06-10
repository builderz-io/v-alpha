// Connect to firebase database
const { profileDb } = require( '../../resources/databases-setup' );
const colP = profileDb.database().ref( 'profiles' );

module.exports = ( context ) => colP.limitToLast( 1000 ).once( 'value' )
  .then( snap => Object.values( snap.val() ) );
