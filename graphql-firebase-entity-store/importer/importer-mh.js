
const dryrun = false;
const geoCodingRun = false;
const doNotValidate = true;

const onlyCreator = false; // !! creator must be placed first in JSON source file
const creatorUuidE = 'XCxTOMOH'; // 'Nj3DisOY'; // fill after creator import

const issuer = 'localhost:4021';

const startIndex = 31; // >= 1
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

const sourceFile = fs.readFileSync( './source/mh-entities-cleaned.json', { encoding: 'utf8', flag: 'r' }, ( err, data ) => data );
const sourceData = JSON.parse( sourceFile );
const sourceFileGeo = fs.readFileSync( './source/geocoding-data-citylevel.json', { encoding: 'utf8', flag: 'r' }, ( err, data ) => data );
const sourceDataGeo = JSON.parse( sourceFileGeo );
const sourceCreds = fs.readFileSync( './source/credentials.json', { encoding: 'utf8', flag: 'r' }, ( err, data ) => data );
const credentials = JSON.parse( sourceCreds );
const geoData = [];

setTimeout( runBaseImport, 1000 );

async function runBaseImport() {

  for ( let i = ( onlyCreator ? 0 : startIndex ); i < ( onlyCreator ? 1 : endIndex == 'all' ? sourceData.length : endIndex + 1 ); i++ ) {

    const x = sourceData[i];

    const title = x['First Name'] + ' ' + x['Last Name'];

    /* test title (throws error) */
    // console.log( i, title );
    // castEntityTitle( { m: title, c: 'Person' } );
    // continue;

    x.role = 'ab'; // PersonMapped

    if ( onlyCreator ) {
      x.role = 'aa'; // Person
    }

    const newEvmAccount = web3.eth.accounts.create();

    let expertise = x['Area of Expertise'].replace( /,\s/g, ' #' ).replace( /&\s/g, '#' ).split( ' ' );
    expertise = '#' + expertise.slice( 1 ).join( '' ).replace( /#/g, ' #' ).replace( 'RegeneratingtheBiosphere', 'BiosphereRegeneration' );

    const description = x['Job Title'] +
    ( x['Website URL'] != '' ? ' at ' + x['Website URL'] : ( x['Company Name'] != '' ? ' at ' + x['Company Name'] : '' ) ) +
    ( x['Professional URL'] != '' && x['Professional URL'] != x['Website URL'] ? '\n\n' + x['Professional URL'] : '' ) +
    ( x['Personal URL'] != '' && x['Personal URL'] != x['Website URL'] ? '\n\n' + x['Personal URL'] : '' ) +
    ( x['Everipedia URL'] != '' ? '\n\n' + x['Everipedia URL'] : '' ) +
    ( x['Twitter Username'] != '' ? '\n\n' + 'https://twitter.com/' + x['Twitter Username'] : '' ) +
    '\n\n' +
    // ( x['Job function'] ? '#' + x['Job function'] + ' ' : '' ) +
    expertise;

    /* test links */
    // await linkBlocker( description ).then( res => {
    //   console.log( i, title );
    //   if ( res != null ) {
    //     console.log( i, title );
    //   }
    // } );
    // continue;

    const compatibleData = {
      b: '', // added to pass validation
      c: x.role,
      gImporter: issuer,
      i: newEvmAccount.address.toLowerCase(),
      // j: null,
      m: title,
      n: castTag(), // this importer assumes that no title + tag combination exists
      profileInputServerSide: {
        descr: description,
        // email: x['Email'] || 'mbhaupt@gmail.com', // x[''],
        // target: x.properties ? x.properties.target ? Number( x.properties.target ) : null : null,
        // unit: x.properties ? x.properties.unit : null,
        // lngLat: [], // castRandLatLng(),
        // loc: location,
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

    if ( geoCodingRun ) {
      // const location = ( x['LocationC'] || x['Location'] ).replace( /,\s,/g, ',' ) + ', ' + x['Continent'];
      const location = x['City'] + ', ' + x['Country/Region'] + ', ' + x['Continent'];

      const geo = await googleGeocodingAPI( location );

      if ( geo && geo.results[0] ) {
        geoData.push( { success: true, index: i, fn: x['First Name'], ln: x['Last Name'], geo: geo.results[0].geometry.location, location: location, formatted_address: geo.results[0].formatted_address } );
      }
      else {
        geoData.push( { success: false, index: i, fn: x['First Name'], ln: x['Last Name'], err: geo, location: location } );
      // compatibleData.profileInputServerSide.lngLat = castRandLatLngArray();
      }

      console.log( i, title, geo );
      fs.writeFileSync( './source/geocoding-data-citylevel-c.json', JSON.stringify( geoData ) );
      continue;
    }
    else {
      if( sourceDataGeo[i].fn == x['First Name'] && sourceDataGeo[i].ln == x['Last Name'] ) {
        compatibleData.profileInputServerSide.lngLat = [
          sourceDataGeo[i].geo.lng.toFixed( 4 ) * 1,
          sourceDataGeo[i].geo.lat.toFixed( 4 ) * 1,
        ];
        compatibleData.profileInputServerSide.loc = sourceDataGeo[i].formatted_address;
      }
    }

    if ( x['Profile Image'] ) {
      const img = await getImage( x['Profile Image'], i );
      compatibleData.profileInputServerSide.tinyImg = null; // await resizeImage( img, { width: 40, height: 40, fit: 'fill' } );
      compatibleData.profileInputServerSide.thumb = await resizeImage( img, { width: 88 } );
      compatibleData.profileInputServerSide.medImg = await resizeImage( img, { width: 400 } );
    }

    !compatibleData.profileInputServerSide.medImg ? console.log( i, title ) : null;

    if ( !dryrun ) {

      /* define a creator for the entity to be imported or not */
      const context = {
        a: onlyCreator ? false : true,
        d: creatorUuidE,
        doNotValidate: doNotValidate,
        host: issuer,
      };

      await namespaceInit( context, compatibleData );
    }
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
  return imageToBase64( link )
    .then( img => img )
    .catch( err => console.log( err ) );
}

function resizeImage( base64Image, sizeObject ) {
  if ( base64Image ) {
    return sharp( new Buffer.from( base64Image, 'base64' ) )
      .resize( sizeObject )
      .jpeg( { quality: 80 } )
      .toBuffer()
      .then( resized => `data:image/jpeg;base64,${ resized.toString( 'base64' ) }` )
      .catch( err => console.log( err ) );
  }
  else {
    return null;
  }
}
