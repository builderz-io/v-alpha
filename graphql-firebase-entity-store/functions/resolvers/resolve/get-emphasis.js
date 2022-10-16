// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );

module.exports = ( context, emphasis ) => {
  console.log( emphasis );
  const network = context.host.replace( /\./g, '_' ).replace( ':', '_' );
  const coll = namespaceDb.database().ref( 'networks/' + network + '/' + emphasis + 's' );

  return coll
    .orderByChild( 'y/c' )
    .startAt( Math.floor( Date.now() / 1000 ) )
    .once( 'value' )
    .then( snap => Object.values( snap.val() ) );

};
