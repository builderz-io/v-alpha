const getSingleEntity = require( './get-single-entity' );

module.exports = async ( context, a ) => {
  if ( a.length == 1 ) {
    const match = {
      uuidE: a[0],
    };

    return getSingleEntity( context, match );
  }
  else {
    const entities = [];
    for ( let i = 0; i < a.length; i++ ) {
      const match = {
        uuidE: a[i],
      };
      const entity = await getSingleEntity( context, match );
      entities.push( entity[0] );
    }
    return entities;
  }
};
