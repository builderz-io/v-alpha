const functions = require( 'firebase-functions' );
const express = require( 'express' );

const cors = require( 'cors' );
const cookieParser = require( 'cookie-parser' );

const { verify } = require( 'jsonwebtoken' );
const credentials = require( './credentials/credentials' );

// Construct a schema, using GraphQL schema language
const typeDefs = require( './schemas/typeDefs' );

// Provide resolver functions for your schema fields
const resolvers = require( './resolvers/resolve/resolve' );

// Create GraphQL express server
const { ApolloServer } = require( 'apollo-server-express' );

// Setup express cloud function
const app = express();

const whitelist = [
  'http://localhost:3124',
  'https://dev.valueinstrument.org',
  'https://faithfinance.app',
];

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

// Create graphql server
const server = new ApolloServer( {
  typeDefs,
  resolvers,
  playground: false,
  context: async ( { req, res } ) => {

    const auth = req.headers.authorization;
    const lastConnectedAddress = req.headers['last-connected-address'];
    const browserId = req.headers['browser-id'];

    const tempRefresh = req.headers.cookie
      ? req.headers.cookie.split( '=' )[1]
      : req.headers['temp-refresh'] != 'not set'
        ? req.headers['temp-refresh']
        : undefined;

    const host = req.headers.referer.split( '/' )[2];

    const context = {
      host: host,
      browserId: browserId,
    };

    if ( tempRefresh ) {
      // try {
      //   const jwt = verify( tempRefresh, credentials.jwtRefreshSignature );
      //   console.log( jwt );
      // }
      // catch ( err ) {
      //   console.log( err );
      // }
      const user = await resolvers.Query.getAuth( undefined, { token: tempRefresh } );
      user[0] ? Object.assign( context, user[0] ) : null;
    }
    else if ( auth.includes( 'uPhrase' ) ) {
      const user = await resolvers.Query.getAuth( undefined, { token: auth.replace( 'uPhrase ', '' ) } );
      if ( user[0] ) {

        /** If an address is set, uPhrase must match entity address */
        if ( lastConnectedAddress != 'not set' ) {
          user[0].i == lastConnectedAddress ? Object.assign( context, user[0] ) : null;
        }
        else {
          Object.assign( context, user[0] );
        }
      }
      // user[0] ? Object.assign( context, user[0] ) : null;
    }
    else if ( auth.includes( 'Bearer' ) ) {
      try {
        const jwt = verify( auth.replace( 'Bearer ', '' ), credentials.jwtSignature );
        Object.assign( context, jwt.user );
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
