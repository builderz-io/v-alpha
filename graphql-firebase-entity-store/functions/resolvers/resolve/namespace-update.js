/* eslint global-require: "off" */

// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );
const colE = namespaceDb.database().ref( 'entities' );
const { imageDb } = require( '../../resources/databases-setup' );
const colI = imageDb.database().ref( 'images' );

const castObjectPaths = require( './utils/cast-object-paths' );
const trackProfileFields = require( './utils/track-profile-fields' );
const setNetwork = require( './utils/set-network' );

module.exports = async ( context, data, objToUpdate, col ) => {

  /** Clear keyword cache */
  colE.child( objToUpdate.b.includes( '/e' ) ? objToUpdate.a : objToUpdate.d ).update( { 'zz/z': null } );

  /** Validate inputs */
  await require( '../validate/validate' )( context, data, objToUpdate );

  /** Generate geohash */
  if (
    objToUpdate.b.includes( '/p' )
    && data.n
  ) {
    data.n.b = require( 'geofire-common' ).geohashForLocation( [ data.n.a[1], data.n.a[0] ] );
  }

  /** Copy tinyImg and thumb to profile db */
  if ( data.o ) {
    const imgCopy = {
      a: data.a,
      o: {
        a: data.o.a,
        b: data.o.b,
      },
    };

    objToUpdate.b.includes( '/i' ) ? require( './set-namespace' )( context, imgCopy, 'profile' ) : null;
  }

  if ( objToUpdate.b.includes( '/p' ) ) {

    /** Track profile fields in entity db */
    trackProfileFields( objToUpdate.d, data );
  }

  const fields = castObjectPaths( data );

  /** Never update uuid */
  delete fields.a;

  /** Omit role when updating entity (entity title) */
  objToUpdate.b.includes( '/e' ) ? delete fields.c : null;

  /**
   * Update single fields in collection and
   * set privacy field in image db also
   */
  await new Promise( resolve => {
    col.child( data.a ).update( fields, () => resolve( data ) );
  } );

  if ( data.f || data.f === 0 ) {
    await new Promise( resolve => {
      colI.child( data.a ).update( fields, () => resolve( data ) );
    } );
  }

  /** Update the network cluster and point-cache */
  setNetwork( context );

  return data;

};
