const getSingleEntity = require( './get-single-entity' );

module.exports = ( context, i ) => {
  const match = function( E ) {
    return E.i == i;
  };
  return getSingleEntity( context, match );
};
