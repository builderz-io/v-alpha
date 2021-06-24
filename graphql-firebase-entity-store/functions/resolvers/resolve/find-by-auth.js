// Connect to firebase database
const { authDb } = require( '../../resources/databases-setup' );
const colA = authDb.database().ref( 'authentication' );

module.exports = async ( token ) => {
  let match;
  if ( token.substr( 0, 2 ) == 'vx' ) {
    match = 'f';

    return colA.orderByChild( match ).equalTo( token ).once( 'value' )
      .then( snap => {
        const data = snap.val();
        return data ? Object.values( data ) : null;
      } );
  }
  else if ( token.substr( 0, 2 ) == '0x' ) {
    match = 'i';

    return colA.orderByChild( match ).equalTo( token ).once( 'value' )
      .then( snap => {
        const data = snap.val();
        return data ? Object.values( data ) : null;
      } );
  }
  else if ( token.substr( 0, 4 ) == 'REFR' ) {
    // match = 'h';

    return colA.once( 'value' )
      .then( snap => {
        const authDoc = Object.values( snap.val() ).find( item => item.h.includes( token ) );
        return [authDoc];
      } );
  }

};
