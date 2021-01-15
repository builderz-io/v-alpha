/**
 * Note: This module is a copy of the client side version.
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
const charWhitelist = /[^0-9^a-z^A-Z^\s]/g;

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
};

function getString( string ) {
  // TODO: translation
  return string;
}

/* =============== run checks ================ */

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
