const settings = {
  port: 6021
};

const http = require( 'http' );
const express = require( 'express' );
const mongoose = require( 'mongoose' );

const handleEntity = require( './controllers/v-entity-controller' );
const handleMessage = require( './controllers/v-message-controller' );
const handleTransaction = require( './controllers/v-transaction-controller' );

mongoose.connect( 'mongodb://localhost/ui2020', { useNewUrlParser: true, useUnifiedTopology: true } );

const app = express();
const server = http.createServer( app );

server.listen( settings.port, function( err ) {
  if ( err ) {throw err}
  console.log( 'MongoDB Connector listening on port', settings.port );
} );

app.get( '/', function( req, res ) {
  res.send( 'MongoDB connector is live' );
} );

const sio = require( 'socket.io' )( server, {
  handlePreflightRequest: ( req, res ) => {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': req.headers.origin, //or the specific origin you want to give access to,
      'Access-Control-Allow-Credentials': true
    };
    res.writeHead( 200, headers );
    res.end();
  }
} );

sio.on( 'connection', client => {
  console.log( client.id, 'connected' );

  client.on( 'entity', handleEntity.register );

  client.on( 'tags', handleEntity.getTags );

  client.on( 'role', handleEntity.findByRole );

  client.on( 'ethAddress', handleEntity.findByEthAddress );

  client.on( 'fullId', handleEntity.findByFullId );

  client.on( 'set message', handleMessage.set );

  client.on( 'get message', handleMessage.get );

  client.on( 'nukeme', function( req, res ) {
    // TODO
    res( { status: 'error', message: 'Cannot currently nuke entities' } );
  } );

  client.on( 'crashapp', function( req, res ) {
    // TODO
    res( { status: 'error', message: 'App in production, cannot be crashed' } );
  } );

  client.on( 'set transaction', handleTransaction.updateEntities );

  client.on( 'transaction', handleTransaction.findTransaction );
  //
  // client.on( 'transaction', function( req, res ) {
  //   // TODO
  //   console.log( req );
  //   res( { status: 'error', message: 'need to code tx still' } );
  // } );

} );
