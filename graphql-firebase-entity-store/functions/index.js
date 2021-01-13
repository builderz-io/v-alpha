const functions = require( 'firebase-functions' );
const express = require( 'express' );

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
    const token = req.headers.authorization;
    const host = req.headers.referer.split( '/' )[2];
    // console.log( 111, token );
    if ( token == '' ) { return { host: host } }
    const user = await resolvers.Query.getAuth( undefined, { token: token } );
    user[0] ? user[0].host = host : null;
    // console.log( 999, user );
    return user[0];

  },
} );
server.applyMiddleware( { app, path: '/v1', cors: true } );

console.log( ' ***  Started Apollo Server at', new Date().toString().split( ' ' )[4], ' ***' );

exports.api = functions.https.onRequest( app );
