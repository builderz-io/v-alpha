const validator = require( 'validator' );

module.exports = status => {

  if ( !validator.isBoolean( String( status ) ) ) {
    throw new Error( '-5240 invalid active status' );
  }

  return true;
};
