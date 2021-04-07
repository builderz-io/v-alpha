// Connect to firebase database
const { authDb } = require( '../../resources/databases-setup' );
const colA = authDb.database().ref( 'authentication' );

module.exports = ( token ) => colA.once( 'value' )
  .then( snap => snap.val() )
  .then( val => [ Object.values( val ).find( auth => [auth.f, auth.g].includes( token ) ) ] );
