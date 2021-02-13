const functions = require( 'firebase-functions' );
const express = require( 'express' );

const cors = require( 'cors' );
const cookieParser = require( 'cookie-parser' );

const { verify } = require( 'jsonwebtoken' );
const credentials = require( './credentials/credentials' );

// Construct a schema, using GraphQL schema language
const typeDefs = require( './schemas/typeDefs' );

// Provide resolver functions for your schema fields
const { resolvers } = require( './resolvers/resolve/resolve' );

// Create GraphQL express server
const { ApolloServer } = require( 'apollo-server-express' );

// Setup express cloud function
const app = express();

const corsConfig = {
  origin: 'http://localhost:3123',
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
    const refreshToken = req.headers.cookie ? req.headers.cookie.split( '=' )[1] : undefined;
    const host = req.headers.referer.split( '/' )[2];

    const context = {
      host: host,
    };

    if ( refreshToken ) {
      const user = await resolvers.Query.getAuth( undefined, { token: refreshToken } );
      user[0] ? Object.assign( context, user[0] ) : null;
    }
    else if ( auth.includes( 'uPhrase' ) ) {
      const user = await resolvers.Query.getAuth( undefined, { token: auth.replace( 'uPhrase ', '' ) } );
      user[0] ? Object.assign( context, user[0] ) : null;
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
