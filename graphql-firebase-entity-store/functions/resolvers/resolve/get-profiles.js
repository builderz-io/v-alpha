const collP = global.db.collP;

module.exports = async ( context, profileArray ) => {
  const promises = profileArray.map( function( uuidP ) {
    return collP.child( uuidP )
      .once( 'value' )
      .then( snap => snap.val() );
  } );

  return Promise.all( promises );
};
