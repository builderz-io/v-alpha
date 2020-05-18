const settings = {
  port: 6021
};

const http = require( 'http' );
const express = require( 'express' );
const mongoose = require( 'mongoose' );

mongoose.connect( 'mongodb://localhost/ui2020', { useNewUrlParser: true, useUnifiedTopology: true } );

const app = express();
const server = http.createServer( app );

server.listen( settings.port, function( err ) {
  if ( err ) {throw err}
  console.log( 'MongoDB Entity Store listening on port', settings.port );
} );

app.get( '/', function( req, res ) {
  res.send( 'MongoDB connector is live' );
} );

exports.sio = require( 'socket.io' )( server, {
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

const handleEntity = require( './controllers/v-entity-controller' );
const handleMessage = require( './controllers/v-message-controller' );
const handleTransaction = require( './controllers/v-transaction-controller' );

exports.sio.on( 'connection', client => {
  console.log( client.id, 'connected' );

  client.on( 'set entity', handleEntity.register );

  client.on( 'set evm address', handleEntity.setEvmAddress );

  client.on( 'get entity by role', handleEntity.findByRole );

  client.on( 'get entity by evmAddress', handleEntity.findByEvmAddress );

  client.on( 'get entity by symbolAddress', handleEntity.findBySymbolAddress );

  client.on( 'get entity by fullId', handleEntity.findByFullId );

  client.on( 'get entity by uPhrase', handleEntity.findByUPhrase );

  client.on( 'set verification', handleEntity.verify );

  // client.on( 'tags', handleEntity.getTags );

  client.on( 'set message', handleMessage.set );

  client.on( 'get message', handleMessage.get );

  client.on( 'set transaction', handleTransaction.updateEntities );

  client.on( 'get transaction', handleTransaction.findTransaction );

} );
