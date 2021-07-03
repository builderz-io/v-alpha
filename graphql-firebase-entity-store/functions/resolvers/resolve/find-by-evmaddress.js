
const getSingleEntity = require( './get-single-entity' );
const setAuth = require( './set-auth' );

module.exports = ( context, i ) => {

  /** Set network (via set auth) when user joins with address */

  if ( 'JOIN' == i.substr( 0, 4 ) ) {
    i = i.split( '--' )[1];
    context.i = i;
    context.isEvmJoin = true;
    setAuth( context );
  }

  /** Return the entityDoc */
  const match = {
    key: 'i',
    value: i,
  };

  return getSingleEntity( context, match );
};
