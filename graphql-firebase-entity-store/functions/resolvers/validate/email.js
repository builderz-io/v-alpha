const validator = require( 'validator' );

module.exports = email => {

  if ( !validator.isEmail( email ) ) {
    throw new Error( '-5210 invalid email' );
  }

  return true;
};
