// Connect to firebase database
const { authDb } = require( '../../resources/databases-setup' );
const colA = authDb.database().ref( 'authentication' );

module.exports = async ( context, res ) => {

  const disconnect = await new Promise( resolve => {
    colA.child( context.a ).update( { g: null }, () => resolve( { success: true } ) );
  } );

  if ( disconnect.success ) {
    res.clearCookie( 'refresh_token' );
    return disconnect;
  }
  else {
    return {
      success: false,
    };
  }
};
