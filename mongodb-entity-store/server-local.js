/**
 * Local MongoDB entity store for v-alpha development.
 * Listens on port 6022 (matches v-config mongodbEndpoint.local).
 */

const settings = {
  port: 6022,
  host: 'localhost',
  db: 'v-alpha-local',
};

const http = require( 'http' );
const express = require( 'express' );
const mongoose = require( 'mongoose' );
const cors = require( 'cors' );

const whitelist = [
  'http://localhost:4021',
  'http://localhost:4042',
  'http://127.0.0.1:4021',
  'http://127.0.0.1:4042',
  'http://localhost:3123',
];

mongoose.connect( 'mongodb://127.0.0.1/' + settings.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} );

const app = express();
const server = http.createServer( app );

server.listen( settings.port, function( err ) {
  if ( err ) { throw err }
  console.log(
    'MongoDB Entity Store (local) on port',
    settings.port,
    '— database',
    settings.db,
  );
} );

app.use( cors( {
  origin( origin, callback ) {
    if ( !origin ) { return callback( null, true ) }
    if ( whitelist.indexOf( origin ) === -1 ) {
      return callback( new Error( 'CORS blocked: ' + origin ), false );
    }
    return callback( null, true );
  },
} ) );

app.get( '/', function( req, res ) {
  res.send( 'v-alpha local MongoDB connector is live' );
} );

const socket = require( './socket' );
exports.sio = socket.init( server );

const handleEntity = require( './controllers/v-entity-controller' );
const handleMessage = require( './controllers/v-message-controller' );
const handleTransaction = require( './controllers/v-transaction-controller' );

exports.sio.on( 'connection', client => {
  console.log( client.id, 'connected (local)' );

  client.on( 'set entity', handleEntity.register );
  client.on( 'set entity update', handleEntity.update );
  client.on( 'get entity by role', handleEntity.findByRole );
  client.on( 'get entity by evmAddress', handleEntity.findByEvmAddress );
  client.on( 'get entity by symbolAddress', handleEntity.findBySymbolAddress );
  client.on( 'get entity by fullId', handleEntity.findByFullId );
  client.on( 'get entity by uuidE', handleEntity.findByUuidE );
  client.on( 'get entity by uPhrase', handleEntity.findByUPhrase );
  client.on( 'get entity by query', handleEntity.findByQuery );
  client.on( 'get research cohorts by owner', handleEntity.findResearchCohortsByOwner );
  client.on( 'set research invite state', handleEntity.setResearchInviteState );
  client.on( 'get research cohort export', handleEntity.exportResearchCohortData );
  client.on( 'set message', handleMessage.set );
  client.on( 'get message', handleMessage.get );
  client.on( 'set transaction', handleTransaction.updateEntities );
  client.on( 'get transaction', handleTransaction.findTransaction );
  client.on( 'set managed transaction', handleTransaction.managedTransaction );
  client.on( 'set transaction admin notification', handleTransaction.adminNotify );

  client.on( 'user is typing', function( callback ) {
    exports.sio.emit( 'a user is typing', callback );
  } );
} );
