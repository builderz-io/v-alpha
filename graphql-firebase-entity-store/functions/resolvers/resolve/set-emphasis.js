
// Connect to namespace firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );

module.exports = async ( context, input ) => {
  const network = context.host.replace( /\./g, '_' ).replace( ':', '_' );
  const coll = namespaceDb.database().ref( 'networks/' + network + '/' + input.emphasis + 's' );
  const collAdmins = namespaceDb.database().ref( 'networks/' + network + '/admins' );

  if ( !context.a ) {
    throw new Error( '-2003 not authenticated to set highlight' );
  }

  const admins = await collAdmins.once( 'value' )
    .then( snap => snap.val() );

  if ( !admins ) {
    throw new Error( '-2005 no admin set' );
  }

  if ( admins.includes( context.d ) ) {
    delete input.emphasis;

    return new Promise( resolve => {
      coll.child( input.a ).update( input, () => resolve( input ) );
    } );
  }
  else {
    throw new Error( '-2004 not authorized to set highlight' );
  }

};
