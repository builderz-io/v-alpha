// https://csvjson.com/csv2json

/**
  TODO
  - images

  - google latLng
    -> does not return properly sometimes, resulting in random gen??
    -> R Bernardo de Vasconcelos, 1943 Realengo has issues

  - description
    -> https://staging.valueinstrument.org/profile/seanna-davidson-9181
    ---> when link reads like the company, then omit in job description (Joe Brewer)
    -> double check fields used
    -> all links in source file must have https
    -> "self Employed"
    -> no commas and stuff in hashtags
    -> way too many problem links
    ---> disable link blocker for import

  - there is no email field in the source data
  - sinplify Area of Expertises and make more hashtag-friendly?

  - its questionable to use precise locations on people

  - problem found:
    thomas bruhn -> link, double entry

  - incompatible names:
    logged:
    dawn & david lester & parker -> Title: max 3 words
    peter breggin, md -> Title: invalid character ","
    david a. palmer -> Title: invalid character "."
    r. bretminster fullofit -> Title: invalid character "."
    ana terra amorim maia -> Title: max 3 words
    anna luíza behrens-castella -> Title: max 3 words
    daniel schmachtenberger -> Title: max 14 characters in a word
    thomas h. greco, jr. -> Title: max 3 words
    fabio andres diaz pabon -> Title: max 3 words

*/

const onlyCreator = false; // place creator first in JSON source file
const creatorUuidE = 'wq5FwpPDuz9cQ8KIwpJ1A2';

const startIndex = 339; // >= 1
const endIndex = 'all'; // >= 2 or 'all'

const Web3 = require( 'web3' );
const web3 = new Web3();
const fetch = require( 'node-fetch' );
const imageToBase64 = require( 'image-to-base64' );
const sharp = require( 'sharp' );

const fs = require( 'fs' );
const namespaceInit = require( '../functions/resolvers/resolve/namespace-init' );
const linkBlocker = require( '../functions/resolvers/validate/utils/link-blocker' );
const castEntityTitle = require( '../functions/resolvers/validate/title' );

const sourceFile = fs.readFileSync( './source/mh-entities.json', ( err, data ) => data );
const sourceData = JSON.parse( sourceFile );
const sourceCreds = fs.readFileSync( './source/credentials.json', ( err, data ) => data );
const credentials = JSON.parse( sourceCreds );

setTimeout( runBaseImport, 1000 );

async function runBaseImport() {

  for ( let i = ( onlyCreator ? 0 : startIndex ); i < ( onlyCreator ? 1 : endIndex == 'all' ? sourceData.length : endIndex + 1 ); i++ ) {

    const x = sourceData[i];

    const title = x['First Name'] + ' ' + x['Last Name'];

    const testTitle = true; // castEntityTitle( { m: title, c: 'Person' } );

    if ( !testTitle ) {
      console.log( testTitle );
      continue;
    }

    x.role = 'PersonMapped';

    if ( onlyCreator ) {
      x.role = 'Person';
    }

    const newEvmAccount = web3.eth.accounts.create();

    let expertise = x['Area of Expertise'].replace( /,\s/g, ' #' ).replace( /&\s/g, '#' ).split( ' ' );
    expertise = '#' + expertise.slice( 1 ).join( '' ).replace( /#/g, ' #' ).replace( 'RegeneratingtheBiosphere', 'BiosphereRegeneration' );

    const description = x['Job Title'] +
    ( x['Website URL'] != '' ? ' at ' + x['Website URL'] : ( x['Company Name'] != '' ? ' at ' + x['Company Name'] : '' ) ) +
    ( x['Professional URL'] != '' ? '\n\n' + x['Professional URL'] : '' ) +
    ( x['Personal URL'] != '' ? '\n\n' + x['Personal URL'] : '' ) +
    ( x['Everipedia URL'] != '' ? '\n\n' + x['Everipedia URL'] : '' ) +
    ( x['Twitter Username'] != '' ? '\n\n' + 'https://twitter.com/' + x['Twitter Username'] : '' ) +
    '\n\n' +
    // ( x['Job function'] ? '#' + x['Job function'] + ' ' : '' ) +
    expertise;

    const compatibleData = {
      b: '', // added to pass validation
      c: x.role,
      gImporter: 'staging.valueinstrument.org',
      i: newEvmAccount.address.toLowerCase(),
      // j: null,
      m: title,
      n: castTag(), // this importer assumes that no title + tag combination exists
      profileInputServerSide: {
        descr: description,
        email: x['Email'] || 'mbhaupt@gmail.com', // x[''],
        // target: x.properties ? x.properties.target ? Number( x.properties.target ) : null : null,
        // unit: x.properties ? x.properties.unit : null,
        lngLat: [], // castRandLatLng(),
        loc: x['Location'].replace( /,\s,/g, ',' ),
        // tinyImg: x.tinyImage ? 'data:image/jpeg;base64,' + x.tinyImage.blob.$binary.base64 : null,
        // thumb: x.thumbnail ? 'data:image/jpeg;base64,' + x.thumbnail.blob.$binary.base64 : null,
        // medImg: x['Image'] ? getAndCastImage( x['Image'] ) : null,
        // imgName: x.tinyImage ? x.tinyImage.originalName : null,
      },
      authInputServerSide: {
        i: newEvmAccount.address.toLowerCase(),
        j: newEvmAccount.privateKey.toLowerCase(),
      },
      prefLangImporter: x['Preferred language'],
    };

    const context = {
      a: onlyCreator ? false : true, // set to true to define the creator (with uuidE in d)
      d: creatorUuidE,
    };

    if ( x['Profile Image'] ) {
      const img = await getImage( x['Profile Image'] );
      compatibleData.profileInputServerSide.tinyImg = await resizeImage( img, { width: 40, height: 40, fit: 'fill' } );
      compatibleData.profileInputServerSide.thumb = await resizeImage( img, { width: 88 } );
      compatibleData.profileInputServerSide.medImg = await resizeImage( img, { width: 400 } );
    }

    const geo = await googleGeocodingAPI( compatibleData.profileInputServerSide.loc );

    if ( geo.results[0] ) {
      compatibleData.profileInputServerSide.lngLat = [
        geo.results[0].geometry.location.lng,
        geo.results[0].geometry.location.lat,
      ];
      compatibleData.profileInputServerSide.loc = geo.results[0].formatted_address;
    }
    else {
      // compatibleData.profileInputServerSide.lngLat = castRandLatLngArray();
    }
    await linkBlocker( description ).then( res => {
      if ( res != null ) {
        console.log( i, compatibleData.m );
      }
    } );
    // await namespaceInit( context, compatibleData );

  }
  console.log( 'DONE importing' );
}

function castTag() {

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
}

function castRandomInt( min, max ) {
  min = Math.ceil( min );
  max = Math.floor( max );

  // min and max inclusive
  const incMinMax = Math.floor( Math.random() * ( max - min + 1 ) ) + min;

  return incMinMax;
}

async function googleGeocodingAPI( address ) {
  let content;
  const formattedAddress = address.replace( /,/g, '' ).replace( /\s/g, '%20' );
  const formattedLink = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + formattedAddress + '&key=' + credentials.geocodingKey;

  try {
    const response = await fetch( formattedLink );
    content = await response.json();
  }
  catch ( err ) {
    console.log( 'fetch link:', formattedLink );
    console.log( 'fetch error:', err );
  }
  return content;
}

function getImage( link ) {
  return imageToBase64( link ) // Path to the image
    .then( img => img )
    .catch( err => console.log( err ) );
}

function resizeImage( base64Image, sizeObject ) {
  return sharp( new Buffer.from( base64Image, 'base64' ) )
    .resize( sizeObject )
    .toBuffer()
    .then( resized => `data:image/jpeg;base64,${ resized.toString( 'base64' ) }` )
    .catch( err => console.log( err ) );
}
