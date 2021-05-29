const getSingleEntity = require( './get-single-entity' );

module.exports = ( context, m, n ) => {
  const match = {
    title: m,
    tag: n,
  };
  return getSingleEntity( context, match );
};
