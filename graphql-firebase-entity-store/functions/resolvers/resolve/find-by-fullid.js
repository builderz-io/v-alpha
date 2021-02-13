const getSingleEntity = require( './get-single-entity' );

module.exports = ( context, m, n ) => {
  const match = function( E ) {
    return E.m == m && E.n == n;
  };
  return getSingleEntity( context, match );
};
