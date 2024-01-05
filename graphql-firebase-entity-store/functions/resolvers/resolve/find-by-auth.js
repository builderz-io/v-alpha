
const { getSalt, bcrypt } = require( '../../resources/crypt' );

const collA = global.db.collA;

module.exports = async ( token ) => {

  if ( !token ) { return null }

  if (
    'vx' == token.substr( 0, 2 )
    && token.length == 18
  ) {
    const encryptedToken = await bcrypt( token, getSalt() );
    return getAuthDoc( 'f', encryptedToken );
  }

  else if (
    '0x' == token.substr( 0, 2 )
    && token.length == 42
  ) {
    return getAuthDoc( 'i', token );
  }

  else if (
    'REFR' == token.substr( 0, 4 )
    && token.length == 40
  ) {

    token = token.split( '--' );

    const authDoc = await getAuthDoc( 'a', token[1] );

    if( authDoc && authDoc.h.includes( token[2] ) ) {
      return authDoc;
    }
    else {
      return null;
    }

  }
  else {
    return getAuthDoc( 'a', token ); // here token is a uuidA
  }

};

async function getAuthDoc( field, match ) {
  return collA.orderByChild( field ).equalTo( match ).once( 'value' )
    .then( snap => {
      let data = snap.val();
      data ? data = Object.values( data )[0] : null;
      return data;
    } );
}
