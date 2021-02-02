const functions = require( 'firebase-functions' );
const express = require( 'express' );
const { verify } = require( 'jsonwebtoken' );
const credentials = require( './credentials/credentials' );

// Construct a schema, using GraphQL schema language
const typeDefs = require( './schemas/typeDefs' );

// Provide resolver functions for your schema fields
const resolvers = require( './resolvers/resolvers' );

// Create GraphQL express server
const { ApolloServer } = require( 'apollo-server-express' );

// Setup express cloud function
const app = express();

// Create graphql server
const server = new ApolloServer( {
  typeDefs,
  resolvers,
  playground: false,
  context: async ( { req } ) => {
    const auth = req.headers.authorization;
    const host = req.headers.referer.split( '/' )[2];

    if ( auth == '' ) {
      return { host: host };
    }
    else if ( auth.includes( 'uPhrase' ) ) {
      const user = await resolvers.Query.getAuth( undefined, { token: auth.replace( 'uPhrase ', '' ) } );
      user[0] ? user[0].host = host : null;
      return user[0];
    }
    else if ( auth.includes( 'Bearer' ) ) {
      try {
        const jwt = verify( auth.replace( 'Bearer ', '' ), credentials.jwtSignature );
        console.log( 333, jwt );
        jwt.user.host = host;
        return jwt.user;
      }
      catch ( err ) {
        console.log( err );
        return { host: host };
      }
    }
  },
} );

server.applyMiddleware( { app, path: '/v1', cors: true } );

console.log( ' ***  Started Apollo Server at', new Date().toString().split( ' ' )[4], ' ***' );

exports.api = functions.https.onRequest( app );
