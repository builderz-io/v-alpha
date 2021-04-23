const settings = {
  port: 3124,
  network: 'builderz',
  // network: 'faithfinance',
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
  res.sendFile( __dirname + '/app/assets/img/faithfinance-logo.png' );
} );

app.get( '*', function( req, res ) {
  res.sendFile( __dirname + '/app/app-' + settings.network + '.html' );
} );
