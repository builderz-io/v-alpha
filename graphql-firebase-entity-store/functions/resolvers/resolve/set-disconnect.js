
const collA = global.db.collA;

module.exports = async ( context, res ) => {

  const disconnect = await new Promise( resolve => {
    context.a
      ? collA.child( context.a ).update( { g: null, h: null }, () => resolve( { success: true } ) )
      : resolve( { success: false } );
  } );

  if ( disconnect.success ) {
    // res.clearCookie( 'refresh_token' );
    return disconnect;
  }
  else {
    return {
      success: false,
    };
  }
};
