const getSingleEntity = require( './get-single-entity' );

module.exports = ( context, a ) => {
  const match = function( E ) {
    return E.a == a;
  };
  return getSingleEntity( context, match, a );
};
