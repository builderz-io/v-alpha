// https://hasura.io/blog/best-practices-of-using-jwt-with-graphql

const { jwtSignature } = require( '../../credentials/credentials' );
const { sign } = require( 'jsonwebtoken' );
const { castUuid } = require( '../../resources/v-core' );
const setNetwork = require( './utils/set-network' );
const findByAuth = require( './find-by-auth' );

// Connect to firebase database
const { authDb } = require( '../../resources/databases-setup' );
const colA = authDb.database().ref( 'authentication' );

const settings = {
  jwtExpiry: 60 * 60 * 24 * 365 * 10, // seconds
};

module.exports = async ( context /*, res */ ) => {

  /**
   * If first visit or user is logged out, no context can be set.
   * Hence return early.
   */

  if ( !context.i ) {
    throw new Error( 'could not match an entity for setting up the context object' );
  }

  const authDoc = await findByAuth( context.i );

  if ( !authDoc ) { return }

  if ( authDoc.errors ) {
    throw new Error( 'could not match an entity for setting up refresh token' );
  }

  /** Set the refresh token according to how user joins or revisits page */

  let networksArr, refreshTokensArr;

  const newRefreshToken = context.isEvmJoin
    ? 'na'
    : castUuid().base64Url;

  if ( authDoc.g ) {
    const networkIndex = authDoc.g.indexOf( context.host );
    if ( networkIndex == -1 ) {
      authDoc.g.push( context.host );
      authDoc.h.push( newRefreshToken );
    }
    else {
      if ( !context.isEvmJoin ) {
        authDoc.h[networkIndex] = newRefreshToken;
      }
    }
    networksArr = authDoc.g;
    refreshTokensArr = authDoc.h;
  }
  else {
    networksArr = [context.host];
    refreshTokensArr = [newRefreshToken];
  }

  await new Promise( resolve => {
    colA.child( authDoc.a ).update( { g: networksArr, h: refreshTokensArr }, () => resolve( true ) );
  } );

  /** Update the network cluster and point-cache */
  setNetwork( context );

  // const options = {
  //   httpOnly: true,
  //   // maxAge: 60 * 60 * 24 * 5 * 1000,
  //   // secure: true,
  // };

  // res.cookie( 'refresh_token', newRefreshToken, options );

  return {
    success: true,
    message: 'successfully set refreshToken and sent cookie',
    exp: settings.jwtExpiry,
    uuidE: authDoc.d,
    uuidP: authDoc.e,
    tempRefresh: 'REFR' + '--' + authDoc.a + '--' + newRefreshToken,
    jwt: sign(
      {
        user: {
          a: authDoc.a,
          d: authDoc.d,
          i: authDoc.i,
        },
      },
      jwtSignature,
      {
        expiresIn: settings.jwtExpiry,
      },
    ),
  };
};
