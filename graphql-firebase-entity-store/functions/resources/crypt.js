const credentials = require( '../credentials/credentials' );
const bcrypt = require( 'bcrypt' );
const crypto = require( 'crypto' );

const algorithm = 'aes-256-ctr';

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
module.exports.bcrypt = async ( plaintextPassword, salt ) => new Promise( ( resolve, reject ) => {
  bcrypt.hash( plaintextPassword, salt, ( err, hash ) => {
    if ( err ) {
      reject( err );
    }
    else {
      resolve( hash.replace( salt, '' ) );
    }
  } );
} );

/* as per https://attacomsian.com/blog/nodejs-encrypt-decrypt-data */
module.exports.encrypt = text => {
  const iv = crypto.randomBytes( 16 );

  const cipher = crypto.createCipheriv( algorithm, credentials.cryptoSecret, iv );

  const encrypted = Buffer.concat( [cipher.update( text ), cipher.final()] );

  return {
    iv: iv.toString( 'hex' ),
    content: encrypted.toString( 'hex' ),
  };
};

module.exports.decrypt = hash => {
  const decipher = crypto.createDecipheriv( algorithm, credentials.cryptoSecret, Buffer.from( hash.iv, 'hex' ) );

  const decrpyted = Buffer.concat( [decipher.update( Buffer.from( hash.content, 'hex' ) ), decipher.final()] );

  return decrpyted.toString();
};
