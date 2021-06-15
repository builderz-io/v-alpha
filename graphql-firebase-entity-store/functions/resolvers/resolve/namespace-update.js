/* eslint global-require: "off" */

// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );
const colE = namespaceDb.database().ref( 'entities' );

const castObjectPaths = require( './utils/cast-object-paths' );
const trackProfileFields = require( './utils/track-profile-fields' );

module.exports = async ( context, data, objToUpdate, col ) => {

  /** Clear keyword cache */
  colE.child( objToUpdate.b.includes( '/e' ) ? objToUpdate.a : objToUpdate.d ).update( { 'zz/z': null } );

  /** Validate inputs */
  await require( '../validate/validate' )( context, data, objToUpdate );

  /** Generate geohash */
  if ( objToUpdate.b.includes( '/p' ) && data.n ) {
    data.n.b = require( 'geofire-common' ).geohashForLocation( [ data.n.a[1], data.n.a[0] ] );
  }

  /** Track profile fields in entity db */
  objToUpdate.b.includes( '/p' ) ? trackProfileFields( objToUpdate.d, data ) : null;

  const fields = castObjectPaths( data );

  /** Never update uuid */
  delete fields.a;

  /** Update single fields */
  return new Promise( resolve => {
    col.child( data.a ).update( fields, () => resolve( data ) );
  } );

};
