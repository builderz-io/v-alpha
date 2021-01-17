/**
 * Note: This module includes a selection of methods from
 * the client side V Core Module (as copies).
 *
 * Modifications must be synced in both modules.
 *
 */

const entitySetup = {
  useWhitelist: true, // allow only chars in whitelist
  maxEntityWords: 7,  // max allowed words in entity names (not humans)
  maxHumanWords: 3,  // max allowed words in human entity names
  maxWordLength: 14,  // max allowed length of each word in name
};

const charBlacklist = /[;/!?:@=&"<>#%(){}[\]|\\^~`]/g;
const charWhitelist = /[^0-9^a-z^A-Z^\s^']/g;

/* ============== error strings ============== */

const ui = {
  invalidTitle: 'Invalid title',
  invalidChar: 'Title: invalid character',
  maxLength: 'Title: max 14 characters in a word',
  min2Adjecent: 'Title: min 2 adjacent letters',
  maxHuman: 'Title: max 3 words',
  maxEntity: 'Title: max 7 words',
  tooLong: 'Title: max 200 characters',
  tooShort: 'Title: min 2 characters',
  free: 'free',
  targetRange: 'Target must be within 0 - 9999',
  isNaN: 'Target must be a number',
  noUnit: 'Please add a unit, such as "hour"',
  noTarget: 'Please add a target',
};

function getString( string ) {
  // TODO: translation
  return string;
}

module.exports.castEntityTitle = ( title, role ) => {

  const titleArray = title.trim().toLowerCase().split( ' ' );

  var checkLength = titleArray.length;
  var wordLengthExeeded = titleArray.map( item => item.length > entitySetup.maxWordLength );

  let error;

  ['vx', 'Vx', '0x'].includes( title.substring( 0, 2 ) ) ? error = getString( ui.invalidTitle + ' "' + 'vx' + '"' ) : null;
  title.indexOf( '2121' ) != -1 ? error = getString( ui.invalidTitle + ' "' + '2121' + '"'  ) : null;
  entitySetup.useWhitelist && title.match( charWhitelist ) ? error = getString( ui.invalidTitle ) : null;
  title.match( charBlacklist ) ? error = getString( ui.invalidChar ) + ' "' + title.match( charBlacklist )[0] + '"' : null;
  !title.match( /[a-z]{2}|[A-Z]{2}/g ) ? error = getString( ui.min2Adjecent ) : null;
  // title.length > 200  ? error = getString( ui.tooLong ) : null; // redundant rule
  // title.length < 2 ? error = getString( ui.tooShort ) : null; // redundant rule
  // title.indexOf( '#' ) != -1 ? error = getString( ui.invalidTitle ) : null;
  // title.replace( /[0-9]/g, '' ).length < title.length ? error = getString( ui.invalidTitle ) : null;
  ( [ 'Person' ].includes( role ) && checkLength > entitySetup.maxHumanWords ) ? error = getString( ui.maxHuman ) : null;
  ( [ 'Person' ].indexOf( role ) == -1 && checkLength > entitySetup.maxEntityWords ) ? error = getString( ui.maxEntity ) : null;
  wordLengthExeeded.includes( true ) ? error = getString( ui.maxLength ) : null;

  if ( error ) {
    return {
      success: false,
      endpoint: 'entity',
      status: 'invalid title',
      message: /* '🔮' + ' ' + */ error,
    };
  }
  else {

    const formattedTitle = titleArray.map( function( string ) {
      if ( string.length > 2 && string.substr( 0, 2 ) == 'mc' ) {
        return string.charAt( 0 ).toUpperCase() + string.slice( 1, 2 ) + string.charAt( 2 ).toUpperCase() + string.slice( 3 );
      }
      if ( string.length > 3 && string.substr( 0, 3 ) == 'mac' ) {
        return string.charAt( 0 ).toUpperCase() + string.slice( 1, 3 ) + string.charAt( 3 ).toUpperCase() + string.slice( 4 );
      }
      else {
        return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
      }
    } ).join( ' ' );

    return {
      success: true,
      endpoint: 'entity',
      status: 'cast entity title',
      data: [ formattedTitle ],
    };
  }
};

module.exports.castTarget = ( target, unit, role ) => {
  let error;

  target == '' ? target = undefined : null;

  if (  target ) {
    unit == '' ? error = getString( ui.noUnit ) : null;
    isNaN( target ) ? error = getString( ui.isNaN ) : null;
  }

  if ( ['Pool'].includes( role ) ) {
    unit == '' ? error = undefined : null;
    !target ? error = getString( ui.noTarget ) : null;
    // target.toLowerCase().trim() == getString( ui.free ).trim() ? target = 0 : null;
  }

  Number( target ) > 9999 || Number( target ) < 0 ? error = getString( ui.targetRange ) : null;

  if ( error ) {
    return {
      success: false,
      endpoint: 'entity',
      status: 'invalid target',
      message: error,
    };
  }
  else {
    return {
      success: true,
      endpoint: 'entity',
      status: 'cast entity target',
      data: [ Number( target ) ],
    };
  }

};

module.exports.castTag = () => {
  // debug
  // return '#2121';

  // for demo content creation
  // if ( V.getSetting( 'demoContent' ) ) {
  //   return '#2121';
  // }

  let continueDice = true;

  while ( continueDice ) {
    const number1 = String( castRandomInt( 2, 9 ) );
    const number2 = String( castRandomInt( 1, 9 ) );
    const number3 = String( castRandomInt( 2, 9 ) );

    if (
      number2 != number1 &&
      number3 != number1 &&
      number3 != number2 &&
      [number1, number2, number3].indexOf( '6' ) == -1 && // could be mistaken for 8
      [number1, number2, number3].indexOf( '7' ) == -1 && // has two syllables
      [number1, number2, number3].indexOf( '4' ) == -1 && // stands for death in asian countries
      number1 + number2 != '69' && // sexual reference
      number3 + number2 != '69' &&
      number1 + number2 != '13' && // bad luck in Germany
      number3 + number2 != '13' &&
      number1 + number2 != '21' && // special VI tag
      number3 + number2 != '21'
    ) {
      continueDice = false;
      const tag = '#' + number1 + number2 + number3 + number2;
      return tag;
    }
  }
};

module.exports.castUuid = ( input ) => {
  // creation adapted from https://github.com/uuidjs/uuid
  // encode/decode adapted from https://gist.github.com/brianboyko/1b652a1bf85c48bc982ab1f2352246c8
  // btoa/atob from https://stackoverflow.com/questions/23097928/node-js-throws-btoa-is-not-defined-error/38446960#38446960
  // on 6th May 2020

  const universalBtoa = str => {
    try {
      return btoa( str );
    }
    catch ( err ) {
      return Buffer.from( str ).toString( 'base64' );
    }
  };

  const universalAtob = b64Encoded => {
    try {
      return atob( b64Encoded );
    }
    catch ( err ) {
      return Buffer.from( b64Encoded, 'base64' ).toString();
    }
  };

  // converts a UUID to a URL-safe version of base 64.
  const encode = uuid => {
    const stripped = uuid.replace( /-/g, '' ); // remove dashes from uuid
    const true64 = universalBtoa(
      String.fromCharCode.apply(
        null,
        stripped
          .replace( /\r|\n/g, '' )
          .replace( /([\da-fA-F]{2}) ?/g, '0x$1 ' )
          .replace( / +$/, '' )
          .split( ' ' ),
      ),
    ); // turn uuid into base 64
    const url64 = true64
      .replace( /\//g, '_' )
      .replace( /\+/g, '-' ) // replace non URL-safe characters
      .substring( 0, 22 );    // drop '=='
    return url64;
  };

  // takes a URL-safe version of base 64 and converts it back to a UUID.
  const decode = url64 => {
    const true64 = url64.replace( /_/g, '/' ).replace( /-/g, '+' ); // replace url-safe characters with base 64 characters
    const raw = universalAtob( true64 ); // decode the raw base 64 into binary buffer.

    let hex = ''; // create a string of length 0
    let hexChar; // mostly because you don't want to initialize a variable inside a loop.
    for ( let i = 0, l = raw.length; i < l; i++ ) {
      hexChar = raw.charCodeAt( i ).toString( 16 ); // get the char code and turn it back into hex.
      hex += hexChar.length === 2 ? hexChar : '0' + hexChar; // append hexChar as 2 character hex.
    }
    hex = hex.toLowerCase(); // standardize.
    // pad zeroes at the front of the UUID.
    while ( hex.length < 32 ) {
      hex = '0' + hex;
    }
    // add dashes for 8-4-4-4-12 representation
    const uuid = hex.replace( /(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5' );
    return uuid;
  };

  if ( !input ) {
    let uuidV4, encoded, nodeUuidV4;

    const bytesToUuid = ( buf, offset ) => {
      const i = offset || 0;

      const byteToHex = [];

      for ( let i = 0; i < 256; ++i ) {
        byteToHex.push( ( i + 0x100 ).toString( 16 ).substr( 1 ) );
      }

      const bth = byteToHex;

      // Note: Be careful editing this code!  It's been tuned for performance
      // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
      return (
        bth[buf[i + 0]] +
        bth[buf[i + 1]] +
        bth[buf[i + 2]] +
        bth[buf[i + 3]] +
        '-' +
        bth[buf[i + 4]] +
        bth[buf[i + 5]] +
        '-' +
        bth[buf[i + 6]] +
        bth[buf[i + 7]] +
        '-' +
        bth[buf[i + 8]] +
        bth[buf[i + 9]] +
        '-' +
        bth[buf[i + 10]] +
        bth[buf[i + 11]] +
        bth[buf[i + 12]] +
        bth[buf[i + 13]] +
        bth[buf[i + 14]] +
        bth[buf[i + 15]]
      ).toLowerCase();
    };

    const rng = () => {
      // Unique ID creation requires a high quality random # generator. In the browser we therefore
      // require the crypto API and do not support built-in fallback to lower quality random number
      // generators (like Math.random()).

      // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
      // find the complete implementation of crypto (msCrypto) on IE11.
      const getRandomValues =
      ( typeof crypto !== 'undefined' &&
      crypto.getRandomValues &&
      crypto.getRandomValues.bind( crypto ) ) ||
      ( typeof msCrypto !== 'undefined' &&
      typeof msCrypto.getRandomValues === 'function' &&
      msCrypto.getRandomValues.bind( msCrypto ) );

      const rnds8 = new Uint8Array( 16 );

      if ( !getRandomValues ) {
        throw new Error(
          'crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported',
        );
      }

      return getRandomValues( rnds8 );
    };

    const v4 = ( options, buf, offset ) => {
      const i = ( buf && offset ) || 0;

      if ( typeof options === 'string' ) {
        buf = options === 'binary' ? new Uint32Array( 16 ) : null;
        options = null;
      }

      options = options || {};

      const rnds = options.random || ( options.rng || rng )();

      // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
      rnds[6] = ( rnds[6] & 0x0f ) | 0x40;
      rnds[8] = ( rnds[8] & 0x3f ) | 0x80;

      // Copy bytes to buffer, if provided
      if ( buf ) {
        for ( let ii = 0; ii < 16; ++ii ) {
          buf[i + ii] = rnds[ii];
        }
      }

      return buf || bytesToUuid( rnds );
    };

    const universalV4 = () => {
      try {

        /** browser */
        return v4();
      }
      catch ( err ) {

        /** node */
        !nodeUuidV4 ? { v4: nodeUuidV4 } = require( 'uuid' ) : null;
        return nodeUuidV4();
      }
    };

    uuidV4 = universalV4();

    encoded = encode( uuidV4 );

    while (
      // uuidV4.charAt( 0 ) == '0' ||
      !encoded.charAt( 0 ).match( /[a-z]/ ) ||
      !encoded.charAt( 1 ).match( /[a-z]/ ) ||
      encoded.charAt( 0 ) == encoded.charAt( 1 ) ||
      encoded.includes( '-' ) ||
      encoded.includes( '_' ) ||
      ['v', 'V'].includes( encoded.charAt( 0 ) ) ||
      ['x', 'X'].includes( encoded.charAt( 1 ) )
    ) {
      uuidV4 = universalV4();
      encoded = encode( uuidV4 );
    }

    return {
      v4: uuidV4,
      base64Url: encoded,
    };
  }
  else if ( input.length == 22 ) {
    return decode( input );
  }
  else {
    return encode( input );
  }

};

async function getContractState() {
  if ( contract ) {

    const blockNumber = contract.methods.getBlockNumber().call();
    const fee = contract.methods.getTransactionFee.call().call();
    const contribution = contract.methods.getCommunityContribution.call().call();
    const divisibility = 18; // now fixed to 18, instead of contract.methods.decimals.call().call();

    // const allEvents = contract.getPastEvents( 'allEvents', {
    // // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'},
    //   fromBlock: 0,
    //   toBlock: 'latest'
    // }, ( error ) => {return error ? console.error( error ) : null} )
    //   .then( res => {
    //     return res.map( item => {
    //       return {
    //         b: item.blockNumber,
    //         e: item.event,
    //         val: item.returnValues.value/( 10**6 ),
    //         to: item.returnValues.to,
    //         from: item.returnValues.from,
    //         all: item
    //       };
    //     } ).reverse();
    //   } );

    const all = await Promise.all( [ blockNumber, fee, contribution, divisibility /*, allEvents */ ] )
      .catch( err => { console.log( err ) } );

    if ( all && all[0] ) {

      // console.log( '*** CONTRACT STATE ***' );
      // console.log( 'Current Block: ', all[0] );
      // console.log( 'Fee: ', ( all[1] / 100 ).toFixed( 2 ) );
      // console.log( 'Contribution: ', ( all[2] / 100 ).toFixed( 2 ) );
      // console.log( 'Divisibility: ', all[3] );
      // console.log( 'Contract: ', contract._address );
      // console.log( 'Network: ', V.getNetwork().network );
      // console.log( 'All Events:', all[4] );
      // console.log( '*** CONTRACT STATE END ***' );

      const data = {
        currentBlock: Number( all[0] ),
        fee: all[1],
        contribution: all[2],
        divisibility: all[3],
        contract: contract._address,
        network: V.getNetwork(),
        allEvents: all[4],
      };

      V.setState( 'contract', data );

      return {
        success: true,
        status: 'contract state retrieved',
        data: [ data ],
      };
    }
    else {

      console.warn( 'Could not get contract state' );

      return {
        success: false,
        status: 'contract state not retrieved',
        message: all,
      };
    }
  }
  else {
    return {
      success: false,
      status: 'contract state not retrieved',
    };
  }
}

function castRandomInt( min, max ) {
  min = Math.ceil( min );
  max = Math.floor( max );

  // min and max inclusive
  const incMinMax = Math.floor( Math.random() * ( max - min + 1 ) ) + min;

  return incMinMax;
}
