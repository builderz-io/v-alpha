/* eslint global-require: "off" */

/**
 * Returns a version of the input text with checked and blocked links
 * OR
 * returns null
 */

const whiteList = [
  'faithfinance.app',
  'youtu.be', 'youtube.com', 'vimeo.com', 'soundcloud.com', 'facebook.com', 'twitter.com', 'linkedin.com', 't.me', 'medium.com', 'instagram.com', 'tiktok.com',
];

const clearlyPorn = new RegExp( /porn|bbw|blowjob|handjob|facial|gangbang|fisting|bondage|bukkake|busty|cumshot|big\stits|big\sdick/, 'i' );
const maybePorn = new RegExp( /\ssex\s|\sxxx\s|\sanal\s|\sass\s|\scum\s|\swebcams?\s/, 'gi' );

let fetch;

module.exports = async ( text ) => {
  // const text = ( ' ' + whichText ).slice( 1 );

  const linksFound = text.match( /(?:www|https?)[^\s!,]+/gi );

  /** return unaltered text if no links were found */
  if ( !linksFound ) {
    return null;
  }

  fetch = require( 'node-fetch' );

  let blockedLinksCount = 0;

  for ( let i = 0; i < linksFound.length; i++ ) {

    /** skip links in whiteList */
    const host = linksFound[i].split( '/' )[2].replace( 'www.', '' );

    if ( whiteList.includes( host ) ) {
      // console.log( host, 'is whitelisted' );
      continue;
    }

    let blockLink;

    /** block links with query strings */
    if ( linksFound[i].match( /\?/ ) ) {
      blockLink = true;
    }
    else {

      /** ignore "." or "..." sentence ending */
      if ( linksFound[i].substr( -1 ) == '.' ) {
        linksFound[i] = linksFound[i].slice( 0, -1 ).replace( '..', '' );
      }

      const link = linksFound[i].toLowerCase().substr( 0, 4 ) == 'www.' ? 'https://' + linksFound[i] : linksFound[i];
      const content = await getLinkContent( link );
      if ( 'link_error' == content ) {
        text = text.replace( linksFound[i], '*link error*' );
        blockedLinksCount += 1;
      }
      else {
        blockLink = matchContent( content );
      }
    }
    if ( blockLink ) {
      text = text.replace( linksFound[i], '*link blocked*' );
      blockedLinksCount += 1;
    }
  }
  return blockedLinksCount ? text : null;
};

async function getLinkContent( link ) {
  let content;
  try {
    const response = await fetch( link );
    content = await response.text();
  }
  catch ( err ) {
    return 'link_error';
  }
  // console.log(content);
  return content;
}

function matchContent( content ) {

  const clearMatch = content.match( clearlyPorn );
  if ( clearMatch ) {
    console.log( 'Matched clearly:', clearMatch[0] );
    return true;
  }
  else {
    const maybeMatch = content.match( maybePorn );

    if ( maybeMatch && maybeMatch.length > 5 ) {
      console.log( 'Matched maybe:', maybeMatch[0] );
      return true;
    }
  }
  return false;
}
