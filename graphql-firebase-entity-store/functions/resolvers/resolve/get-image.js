// Connect to firebase database
const { imageDb } = require( '../../resources/databases-setup' );
const colI = imageDb.database().ref( 'images' );

module.exports = ( uuidP ) => colI.child( uuidP ).once( 'value' )
  .then( snap => [snap.val()] );
