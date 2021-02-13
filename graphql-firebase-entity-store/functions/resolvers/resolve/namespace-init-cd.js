// Connect to firebase database
const { authDb } = require( '../../resources/databases-setup' );
const colA = authDb.database().ref( 'authentication' );

const trackSearchableFields = require( './utils/track-searchable-fields' );

module.exports = ( context, data, col ) => new Promise( resolve => {
  if ( data.c === 'Person' ) {
    // require( './auto-float' ).autoFloat( data.i );  // eslint-disable-line global-require
  }

  /** Track searchable fields in entity db */
  data.b.includes( '/p' ) ? trackSearchableFields( data.d, data ) : null;

  /** Write auth data into auth db */
  data.b.includes( '/e' ) ? colA.child( data.auth.a ).update( data.auth ) : null;

  /** Then omit the auth data and write entity data into entity db */
  const omit = JSON.parse( JSON.stringify( data ) );
  delete omit.auth;

  // TODO: post-write data should be resolved, not pre-write data
  col.child( data.a ).update( omit, () => resolve( data ) );
} );
