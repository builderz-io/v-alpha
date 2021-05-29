const getSingleEntity = require( './get-single-entity' );

module.exports = ( context, i ) => {
  const match = {
    key: 'i',
    value: i,
  };
  return getSingleEntity( context, match );
};
