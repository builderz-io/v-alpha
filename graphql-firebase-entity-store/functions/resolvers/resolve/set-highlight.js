
// Connect to namespace firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );

module.exports = async ( context, input ) => {

  const network = context.host.replace( /\./g, '_' ).replace( ':', '_' );
  const colHighlights = namespaceDb.database().ref( 'networks/' + network + '/highlights' );
  const colAdmins = namespaceDb.database().ref( 'networks/' + network + '/admins' );

  if ( !context.a ) {
    throw new Error( '-2003 not authenticated to set highlight' );
  }

  const admins = await colAdmins.once( 'value' )
    .then( snap => snap.val() );

  if ( !admins ) {
    throw new Error( '-2005 no admin set' );
  }

  if ( admins.includes( context.d ) ) {
    return new Promise( resolve => {
      colHighlights.child( input.a ).update( input, () => resolve( input ) );
    } );
  }
  else {
    throw new Error( '-2004 not authorized to set highlight' );
  }

};
