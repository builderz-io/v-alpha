// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );

module.exports = ( context ) => {

  const network = context.host.replace( /\./g, '_' ).replace( ':', '_' );
  const colHighlights = namespaceDb.database().ref( 'networks/' + network + '/highlights' );

  return colHighlights
    .orderByChild( 'y/c' )
    .startAt( Math.floor( Date.now() / 1000 ) )
    .once( 'value' )
    .then( snap => Object.values( snap.val() ) );

};
