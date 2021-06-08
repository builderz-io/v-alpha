// Connect to auth firebase database
const { authDb } = require( '../../resources/databases-setup' );
const colA = authDb.database().ref( 'admins' );

// Connect to highlights firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );
const colH = namespaceDb.database().ref( 'highlights' );

module.exports = async ( context, input ) => {

  if ( !context.a ) {
    throw new Error( '-2003 not authenticated to set highlight' );
  }

  const network = context.host.replace( '.', '_' ).replace( ':', '_' );

  const admins = await colA.child( network ).once( 'value' )
    .then( snap => snap.val() );

  if ( !admins ) {
    throw new Error( '-2005 no admin set' );
  }

  if ( admins.includes( context.d ) ) {
    return new Promise( resolve => {
      colH.child( input.a ).update( input, () => resolve( input ) );
    } );
  }
  else {
    throw new Error( '-2004 not authorized to set highlight' );
  }

};
