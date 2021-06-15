
const settings = {
  floatEth: true,
};

// Connect to firebase database
const { authDb } = require( '../../resources/databases-setup' );
const colA = authDb.database().ref( 'authentication' );

const trackProfileFields = require( './utils/track-profile-fields' );

module.exports = ( context, data, col ) => new Promise( async resolve => {

  /** Validate, cast and set inputs */
  await require( '../validate/validate' )( context, data ); // eslint-disable-line global-require

  /** Track profile fields in entity db */
  data.b.includes( '/p' ) ? trackProfileFields( data.d, data ) : null;

  if ( data.b.includes( '/e' ) ) {

    /** Write auth data into auth db */
    colA.child( data.auth.a ).update( data.auth );

    /** Float some ETH and optionally auto-verify */
    // "awaiting" this would make the joining slow for the user
    if ( settings.floatEth && 'Person' == data.c ) {
      require( './set-transaction' )( context, { // eslint-disable-line global-require
        recipientAddress: data.i,
      }, 'float' );
    }
  }

  /** Then omit the auth data and write entity data into entity db */
  const omit = JSON.parse( JSON.stringify( data ) );
  delete omit.auth;

  // TODO: post-write data should be resolved, not pre-write data
  col.child( data.a ).update( omit, () => resolve( data ) );
} );
