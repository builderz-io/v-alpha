// Connect to firebase database
const { profileDb } = require( '../../resources/databases-setup' );
const colP = profileDb.database().ref( 'profiles' );

module.exports = async ( profileArray ) => {
  const promises = profileArray.map( function( uuidP ) {
    return colP.child( uuidP )
      .once( 'value' )
      .then( snap => snap.val() );
  } );

  return Promise.all( promises );
};
