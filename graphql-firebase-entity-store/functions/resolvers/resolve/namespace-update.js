/* eslint global-require: "off" */

// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );
const colE = namespaceDb.database().ref( 'entities' );

const castObjectPaths = require( './utils/cast-object-paths' );
const trackSearchableFields = require( './utils/track-searchable-fields' );

module.exports = async ( context, data, objToUpdate, col ) => {

  /** Clear keyword cache */
  colE.child( objToUpdate.b.includes( '/e' ) ? objToUpdate.a : objToUpdate.d ).update( { 'search/z': null } );

  /** Validate inputs */
  await require( '../validate/validate' )( context, data, objToUpdate );

  /** Track searchable fields in entity db */
  objToUpdate.b.includes( '/p' ) ? trackSearchableFields( objToUpdate.d, data ) : null;

  const fields = castObjectPaths( data );

  /** Never update uuid */
  delete fields.a;

  /** Update single fields */
  return new Promise( resolve => {
    col.child( data.a ).update( fields, () => resolve( data ) );
  } );

};
