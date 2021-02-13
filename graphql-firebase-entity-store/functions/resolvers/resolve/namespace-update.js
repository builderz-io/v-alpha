// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );
const colE = namespaceDb.database().ref( 'entities' );

const castObjectPaths = require( './utils/cast-object-paths' );
const trackSearchableFields = require( './utils/track-searchable-fields' );

module.exports = async ( context, data, objToUpdate, col ) => {

  /** Clear keyword cache */
  colE.child( objToUpdate.b.includes( '/e' ) ? objToUpdate.a : objToUpdate.d ).update( { 'search/z': '' } );

  /** Track searchable fields in entity db */
  objToUpdate.b.includes( '/p' ) ? trackSearchableFields( objToUpdate.d, data ) : null;

  /** Validate inputs */

  await require( '../validate/validate' )( context, data, objToUpdate ); // eslint-disable-line global-require

  // if ( !validation.success ) {
  //   throw new Error( validation.error );
  // }

  /*
  /** If title in entity is being updated, run title validation checks
  if (
    objToUpdate.b.includes( '/e' ) &&
        ( data.m == '' || data.m )
  ) {
    const title = require( './v-core' ).castEntityTitle( data.m, data.c ); // eslint-disable-line global-require

    if ( !title.success ) {
      return Promise.resolve( { error: '-5003 ' + title.message, a: data.a } );
    }
    const exists = await module.exports.findByFullId( context, data.m, objToUpdate.n );
    if ( exists[0].a ) {
      return Promise.resolve( { error: '-5003 combination of title and tag already exists', a: data.a } );
    }

    data.m = title.data[0]; // overwrite field with formattedTitle
  }
  */

  const fields = castObjectPaths( data );

  /** Never update uuid */
  delete fields.a;

  /** Update single fields */

  return new Promise( resolve => {
    col.child( data.a ).update( fields, () => resolve( data ) );
  } );
};
