const getSingleEntity = require( './get-single-entity' );

module.exports = ( context, a ) => {
  const match = {
    uuidE: a,
  };
  return getSingleEntity( context, match );
};
