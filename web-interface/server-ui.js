const settings = {
  port: 3123,
  host: 'builderz.io',
};

const http = require( 'http' );
const express = require( 'express' );

const app = express();
const server = http.createServer( app );

app.use( express.static( 'app' ) );

server.listen( settings.port, function( err ) {
  if ( err ) {throw err}
  console.log( 'App server for ' + settings.host + ' listening on port', settings.port );
} );

app.get( '/logo', function( req, res ) {
  res.sendFile( __dirname + '/app/assets/img/builderz-logo.png' );
} );

app.get( '*', function( req, res ) {
  res.sendFile( __dirname + '/app/app.html' );
} );
