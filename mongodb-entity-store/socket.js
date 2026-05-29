/**
 * Shared Socket.IO instance for entity store (avoids double-listen via server-es require).
 */

let sio = null;

const cors = {
  origin: [
    'http://localhost:4021',
    'http://localhost:4042',
    'http://127.0.0.1:4021',
    'http://127.0.0.1:4042',
    'http://localhost:3123',
  ],
  methods: ['GET', 'POST'],
  credentials: true,
};

function init( httpServer ) {
  if ( !sio ) {
    sio = require( 'socket.io' )( httpServer, { cors } );
  }
  return sio;
}

function get() {
  return sio;
}

module.exports = { init, get };
