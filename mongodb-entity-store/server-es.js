const settings = {
  port: 6023,
  host: 'builderz.io',
  db: 'buildersmongo'
};

const http = require( 'http' );
const express = require( 'express' );
const mongoose = require( 'mongoose' );

const cors = require( 'cors' );
const whitelist = ['https://' + settings.host, 'https://' + settings.db + '.valueinstrument.org', 'http://localhost:3123', 'https://alpha.valueinstrument.org', 'http://vialpha.pagekite.me'];

mongoose.connect( 'mongodb://localhost/' + settings.db, { useNewUrlParser: true, useUnifiedTopology: true } );

const app = express();
const server = http.createServer( app );

server.listen( settings.port, function( err ) {
  if ( err ) {throw err}
  console.log( 'MongoDB Entity Store for ' + settings.host + ' listening on port', settings.port );
} );

app.use( cors( {
  origin: function( origin, callback ) {
    // allow requests with no origin
    if( !origin ) {return callback( null, true )}
    if( whitelist.indexOf( origin ) === -1 ) {
      var message = origin + ' - ' + 'The CORS policy for this origin does not ' +
                'allow access from the particular origin.';
      return callback( new Error( message ), false );
    }
    return callback( null, true );
  }
} ) );

app.get( '/', function( req, res ) {
  res.send( settings.host +' MongoDB connector is live' );
} );

app.post( '/logs', function( req, res ) {
  let body = '';
  req.on( 'data', chunk => {
    body += chunk.toString(); // convert Buffer to string
  } );
  req.on( 'end', () => {
    console.log( body );
    res.end( 'ok' );
  } );
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

  client.on( 'set entity update', handleEntity.update );

  client.on( 'get entity by role', handleEntity.findByRole );

  client.on( 'get entity by evmAddress', handleEntity.findByEvmAddress );

  client.on( 'get entity by symbolAddress', handleEntity.findBySymbolAddress );

  client.on( 'get entity by fullId', handleEntity.findByFullId );

  client.on( 'get entity by uPhrase', handleEntity.findByUPhrase );

  client.on( 'get entity by query', handleEntity.findByQuery );

  // client.on( 'set verification', handleEntity.verify );

  // client.on( 'tags', handleEntity.getTags );

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
