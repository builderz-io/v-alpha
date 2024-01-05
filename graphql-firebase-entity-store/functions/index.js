/**
 * Firebase & GraphQL server for VI Alpha 3.5.8
 *
 */

const functions = require( 'firebase-functions' );
const express = require( 'express' );

const cors = require( 'cors' );
const cookieParser = require( 'cookie-parser' );

const { verify } = require( 'jsonwebtoken' );
const credentials = require( './credentials/credentials' );
const { whitelist } = require( './credentials/credentials' );

const { dBInit, setDbReference } = require( './resources/databases-setup' );
const { getSalt, bcrypt, decrypt } = require( './resources/crypt' );

// Construct a schema, using GraphQL schema language
const typeDefs = require( './schemas/typeDefs' );

// Provide resolver functions for your schema fields
const resolvers = require( './resolvers/resolve/resolve' );

// Create GraphQL express server
const { ApolloServer } = require( 'apollo-server-express' );

// Setup express
const app = express();

const corsConfig = {
  origin: ( origin, callback ) => {

    /** https://www.positronx.io/express-cors-tutorial/ */
    // allow requests with no origin
    if( !origin ) { return callback( null, true ) }
    if( whitelist.indexOf( origin ) === -1 ) {
      const message = 'The CORS policy for this origin does not allow access from ' + origin;
      return callback( new Error( message ), false );
    }
    return callback( null, true );
  },
  credentials: true,
};

app.use( cors( corsConfig ) );
app.use( cookieParser() );

global.db = dBInit();

// Create graphql server
const server = new ApolloServer( {
  typeDefs,
  resolvers,
  playground: false,
  context: async ( { req, res } ) => {

    const referer = req.headers.referer.split( '/' )[2]; // needs to be referer

    // console.log( '\n\x1b[33m', referer, '\x1b[0m\n' );

    if ( !referer ) {
      return;
    }

    // TODO: change database reference as per html request
    // setDbReference( referer );

    const auth = req.headers.authorization;
    const lastConnectedAddress = req.headers['last-connected-address'];
    const creatorUPhrase = req.headers['creator-uphrase'];
    const browserId = req.headers['browser-id'];

    const tempRefresh = req.headers['temp-refresh'] != 'not set'
      ? req.headers['temp-refresh']
      : undefined;

    const context = {
      host: referer,
      browserId: browserId,
    };

    const findByAuth = require( './resolvers/resolve/find-by-auth' );

    if ( tempRefresh ) {
      const authDoc = await findByAuth( tempRefresh );
      authDoc ? Object.assign( context, authDoc ) : null;
    }
    else if ( auth.includes( 'uPhrase' ) ) {
      const authDoc = await findByAuth( auth.replace( 'uPhrase ', '' ) );
      if ( authDoc ) {

        /** If an address is set, enforce that uPhrase must match entity of that address */
        if (
          lastConnectedAddress != 'not set'
          && authDoc.i != lastConnectedAddress
        ) {
          // do not set context object
        }
        else {
          Object.assign( context, authDoc );
          Object.assign( context, { cU: creatorUPhrase } );
        }
      }
      // else do not set context object
    }
    else if ( auth.includes( 'Bearer' ) ) {
      try {
        const jwt = verify( auth.replace( 'Bearer ', '' ), credentials.jwtSignature );
        const creatorUPhrase = decrypt( jwt.user.eCU );
        const bcryptedCreatorUPhrase = await bcrypt( creatorUPhrase, getSalt() );

        Object.assign( context, jwt.user );
        Object.assign( context, { cU: creatorUPhrase, bCU: bcryptedCreatorUPhrase } );
      }
      catch ( err ) {
        console.log( err );
      }
    }
    return { context, res };
  },
} );

server.applyMiddleware( { app, path: '/v1', cors: false } );

console.log( ' ***  Started Apollo Server at', new Date().toString().split( ' ' )[4], ' ***' );

exports.api = functions.https.onRequest( app );
