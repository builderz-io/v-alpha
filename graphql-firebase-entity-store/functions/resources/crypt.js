const credentials = require( '../credentials/credentials' );
const bcrypt = require( 'bcrypt' );

module.exports.getSalt = () => credentials.salt;

// Async function to generate salt
module.exports.castSalt = async () => new Promise( ( resolve, reject ) => {
  const saltRounds = 10;
  bcrypt.genSalt( saltRounds, ( err, salt ) => {
    if ( err ) {
      reject( err );
    }
    else {
      resolve( salt );
    }
  } );
} );

// Async function to hash the password
module.exports.encrypt = async ( plaintextPassword, salt ) => new Promise( ( resolve, reject ) => {
  bcrypt.hash( plaintextPassword, salt, ( err, hash ) => {
    if ( err ) {
      reject( err );
    }
    else {
      resolve( hash );
    }
  } );
} );
