// Connect to firebase database
const { namespaceDb } = require( '../../../resources/databases-setup' );
const colE = namespaceDb.database().ref( 'entities' );

const castObjectPaths = require( './cast-object-paths' );

module.exports = ( uuidE, data ) => {
  const track = {
    zz: {
      a: data.m ? data.m.r ? data.m.r : data.m.a : undefined,  // description
      b: data.m ? data.m.b : undefined,  // email

      d: data.o ? data.o.n : undefined,  // image name on upload

      i: data.n ? data.n.a : data.n == null ? data.n : undefined,  // geolocation
      j: data.n ? data.n.b : data.n == null ? data.n : undefined,  // geohash
      k: data.n ? data.n.c : data.n == null ? data.n : undefined,  // location

      m: data.n ? data.n.z : data.n == null ? data.n : undefined,  // continent
      n: data.o ? data.o.z : data.o == null ? data.o : undefined,  // avatar
    },
  };

  const fields = castObjectPaths( track );

  if ( Object.keys( fields ).length ) {
    return new Promise( resolve => {
      colE.child( uuidE ).update( fields, () => resolve( track ) );
    } );
  }
};
