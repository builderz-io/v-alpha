const validator = require( 'validator' );

module.exports = preferredLangs => {

  if ( !validator.isAlpha( preferredLangs, 'en-US', { ignore: ' ' } ) ) {
    throw new Error( '-5220 invalid language entry' );
  }

  return true;
};
