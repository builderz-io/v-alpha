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
const server = new ApolloServer( { typeDefs, resolvers, playground: true } );
server.applyMiddleware( { app, path: '/v1', cors: true } );

console.log( ' ***  Started Apollo Server at', new Date().toString().split( ' ' )[4], ' ***' );

exports.api = functions.https.onRequest( app );
