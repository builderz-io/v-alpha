const settings = {
  port: 80 // 3021
};

const http = require( 'http' );
const express = require( 'express' );

const app = express();
const server = http.createServer( app );

app.use( express.static( 'app' ) );

server.listen( settings.port, function( err ) {
  if ( err ) {throw err}
  console.log( 'App server listening on port', settings.port );
} );

app.get( '*', function( req, res ) {
  res.sendFile( __dirname + '/app/app.html' );
} );
