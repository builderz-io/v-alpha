/* eslint global-require: "off" */

// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );
const colE = namespaceDb.database().ref( 'entities' );

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
  const imgCopy = {
    a: data.a,
    o: {
      a: data.o.a,
      b: data.o.b,
    },
  };

  objToUpdate.b.includes( '/i' ) ? require( './set-namespace' )( context, imgCopy, 'profile' ) : null;

  /** Track profile fields in entity db */
  objToUpdate.b.includes( '/p' ) ? trackProfileFields( objToUpdate.d, data ) : null;

  const fields = castObjectPaths( data );

  /** Never update uuid */
  delete fields.a;

  /** Omit role when updating entity (entity title) */
  objToUpdate.b.includes( '/e' ) ? delete fields.c : null;

  /** Update single fields */
  await new Promise( resolve => {
    col.child( data.a ).update( fields, () => resolve( data ) );
  } );

  /** Update the network cluster and point-cache */
  setNetwork( context );

  return data;

};
