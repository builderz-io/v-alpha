// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );
const colH = namespaceDb.database().ref( 'highlights' );

module.exports = ( context ) => colH
  .orderByChild( 'y' )
  .startAt( Math.floor( Date.now() / 1000 ) )
  .once( 'value' )
  .then( snap => Object.values( snap.val() ) );
