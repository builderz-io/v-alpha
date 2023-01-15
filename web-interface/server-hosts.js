const settings = {
  port: 4021, // development 4021
  network: 'development',
};

const http = require( 'http' );
const express = require( 'express' );

const app = express();
const server = http.createServer( app );

app.use( express.static( 'app' ) );

server.listen( settings.port, function( err ) {
  if ( err ) {throw err}
  console.log( 'App server for ' + settings.network + ' listening on port', settings.port );
} );

app.get( '/logo', function( req, res ) {
  res.sendFile( __dirname + '/hosts/' + castHost( req ) + '/logo.png' );
} );

app.get( '*', function( req, res ) {
  res.sendFile( __dirname + '/hosts/' + castHost( req ) + '/app-' + castHost( req ) + '.html' );
} );

function castHost( req ) {
  return req.headers.host.replace( /[.:]/g, '-' );
}
