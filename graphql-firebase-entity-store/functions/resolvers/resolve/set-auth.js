// https://hasura.io/blog/best-practices-of-using-jwt-with-graphql

const { jwtSignature, jwtRefreshSignature } = require( '../../credentials/credentials' );
const { sign } = require( 'jsonwebtoken' );
const { castUuid } = require( '../../resources/v-core' );
const castObjectPaths = require( './utils/cast-object-paths' );

// Connect to firebase database
const { authDb } = require( '../../resources/databases-setup' );
const colA = authDb.database().ref( 'authentication' );

const settings = {
  jwtExpiry: 60 * 10, // seconds
};

module.exports = async ( context, res ) => {

  /**
   * If first visit or user is logged out, no context can be set.
   * Hence return early.
   */

  if ( !context.a ) {
    throw new Error( 'could not match an entity for setting up the context object' );
    // return {
    //   success: false,
    //   message: 'could not find an entity for setting up the context object',
    // };
  }

  const newRefreshToken = 'REFR' + castUuid().base64Url.substr( 1, 16 ); // e.g. REFRr1KM2HCkMKkRlbCt

  // const newRefreshToken = sign(
  //   {
  //     user: {
  //       a: context.a,
  //       d: context.d,
  //     },
  //   },
  //   jwtRefreshSignature,
  //   {
  //     expiresIn: settings.jwtExpiry,
  //   },
  // );

  await new Promise( resolve => {
    colA.child( context.a ).update( castObjectPaths( { g: newRefreshToken } ), () => resolve( 'set newRefreshToken' ) );
  } );

  const options = {
    httpOnly: true,
    // maxAge: 60 * 60 * 24 * 5 * 1000,
    // secure: true,
  };

  res.cookie( 'refresh_token', newRefreshToken, options );

  return {
    success: true,
    message: 'successfully set refreshToken and sent cookie',
    exp: settings.jwtExpiry,
    uuidE: context.d,
    jwt: sign(
      {
        user: {
          a: context.a,
          d: context.d,
        },
      },
      jwtSignature,
      {
        expiresIn: settings.jwtExpiry,
      },
    ),
  };
};
