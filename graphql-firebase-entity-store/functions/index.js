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
const findByAuth = require( './resolvers/resolve/find-by-auth' );

// Create GraphQL express server
const { ApolloServer } = require( 'apollo-server-express' );

// Setup express cloud function
const app = express();

const whitelist = [
  'http://localhost:4021',
  'http://localhost:5289',
  'https://dev.valueinstrument.org',
  'https://staging.valueinstrument.org',
  'https://staging.builderz.io',
  'https://faithfinance.app',
  'https://impactjourney.cc',
  'https://map.ayc.world',
  'https://map.enoughza.org',
  'https://society4.valueinstrument.org',
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
      const authDoc = await findByAuth( tempRefresh );
      authDoc ? Object.assign( context, authDoc ) : null;
    }
    else if ( auth.includes( 'uPhrase' ) ) {
      const authDoc = await findByAuth( auth.replace( 'uPhrase ', '' ) );
      if ( authDoc ) {

        /** If an address is set, uPhrase must match entity address */
        if ( lastConnectedAddress != 'not set' ) {
          authDoc.i == lastConnectedAddress ? Object.assign( context, authDoc ) : null;
        }
        else {
          Object.assign( context, authDoc );
        }
      }
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

// for dev/testing
// require( './resolvers/resolve/set-transaction' )( { host: 'something' }, {
//   initiatorAddress: '0x04330b0c2b00e069d69066aeeb84e09b46526495',
//   recipientAddress: '0x891a949adf13890c981f5e64d272fc2d861a1f8c',
//   // recipientAddress: '0xac6d20f6da9edc85647c8608cb6064794e20ca26',
//   txTotal: '1',
// }, 'float' ).then( res => console.log( 'res:', Date.now(), JSON.stringify( res )  ) );

exports.api = functions.https.onRequest( app );
