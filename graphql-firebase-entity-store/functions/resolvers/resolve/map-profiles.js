// Connect to firebase database
const { profileDb } = require( '../../resources/databases-setup' );
const colP = profileDb.database().ref( 'profiles' );

module.exports = ( a ) => colP.once( 'value' )
  .then( snap => snap.val() )
  .then( val => a.map( uuidP => val[uuidP] ) );
