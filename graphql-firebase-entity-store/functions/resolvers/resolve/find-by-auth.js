// Connect to firebase database
const { authDb } = require( '../../resources/databases-setup' );
const colA = authDb.database().ref( 'authentication' );

module.exports = async ( token ) => {

  if ( token.substr( 0, 2 ) == 'vx' ) {
    return getAuthDoc( 'f', token );
  }

  else if ( token.substr( 0, 2 ) == '0x' ) {
    return getAuthDoc( 'i', token );
  }

  else if ( token.substr( 0, 4 ) == 'REFR' ) {

    const uuidA = token.split( '--' )[1];

    const authDoc = await getAuthDoc( 'a', uuidA );

    if( authDoc && authDoc[0].h.includes( token ) ) {
      return authDoc;
    }
    else {
      return null;
    }

  }

};

async function getAuthDoc( field, match ) {
  return colA.orderByChild( field ).equalTo( match ).once( 'value' )
    .then( snap => {
      const data = snap.val();
      return data ? Object.values( data ) : null;
    } );
}
