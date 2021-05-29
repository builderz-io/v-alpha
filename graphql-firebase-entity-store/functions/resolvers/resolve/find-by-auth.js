// Connect to firebase database
const { authDb } = require( '../../resources/databases-setup' );
const colA = authDb.database().ref( 'authentication' );

module.exports = async ( token ) => {
  let match;
  if ( token.substr( 0, 2 ) == 'vx' ) {
    match = 'f';
  }
  else if ( token.substr( 0, 2 ) == '0x' ) {
    match = 'i';
  }
  else if ( token.substr( 0, 4 ) == 'REFR' ) {
    match = 'g';
  }

  return colA.orderByChild( match ).equalTo( token ).once( 'value' )
    .then( snap => {
      const data = snap.val();
      return data ? Object.values( data ) : null;
    } );

};
