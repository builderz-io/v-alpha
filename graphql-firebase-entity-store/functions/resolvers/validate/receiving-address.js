const validator = require( 'validator' );

module.exports = address => {

  if ( !validator.isEthereumAddress( address ) ) {
    throw new Error( '-5230 invalid Ethereum address' );
  }

  return true;
};
