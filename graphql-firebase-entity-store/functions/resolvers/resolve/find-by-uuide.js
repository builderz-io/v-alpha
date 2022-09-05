const getSingleEntity = require( './get-single-entity' );

module.exports = async ( context, a ) => {
  if ( a.length == 1 ) {
    const match = {
      uuidE: a[0],
    };

    return getSingleEntity( context, match );
  }
  else {
    const promises = a.map( function( uuidE ) {
      const match = {
        uuidE: uuidE,
        noMixins: true,
        isInArray: true,
      };
      return getSingleEntity( context, match );
    } );

    return Promise.all( promises );
  }
};
