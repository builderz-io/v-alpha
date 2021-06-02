// https://csvjson.com/csv2json

/**
  TODO

  - links
    -> Arturo Escobar edgecase
    --> https://anthropology.unc.edu/
    --> https://anthropology.unc.edu/person/arturo-escobar/

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

  - sinplify Area of Expertises and make more hashtag-friendly?

  - its questionable to use precise locations on people

*/

const dryrun = true;

const onlyCreator = false; // !! creator must be placed first in JSON source file
const creatorUuidE = 'ecKSw5rCmMOiZkIfwrV3w5'; // fill after creator import

const startIndex = 1; // >= 1
const endIndex = 10; // >= 2 or 'all'

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

    /* test title (throws error) */
    // console.log( i, title );
    // castEntityTitle( { m: title, c: 'Person' } );
    // continue;

    x.role = 'PersonMapped';

    if ( onlyCreator ) {
      x.role = 'Person';
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
      gImporter: 'staging.valueinstrument.org',
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

    if ( x['Profile Image'] ) {
      const img = await getImage( x['Profile Image'] );
      compatibleData.profileInputServerSide.tinyImg = await resizeImage( img, { width: 40, height: 40, fit: 'fill' } );
      compatibleData.profileInputServerSide.thumb = await resizeImage( img, { width: 88 } );
      compatibleData.profileInputServerSide.medImg = await resizeImage( img, { width: 400 } );
    }

    const location = x['Location'].replace( /,\s,/g, ',' ) + ', ' + x['Continent'];
    const geo = await googleGeocodingAPI( location );

    if ( geo && geo.results[0] ) {
      compatibleData.profileInputServerSide.lngLat = [
        geo.results[0].geometry.location.lng,
        geo.results[0].geometry.location.lat,
      ];
      // compatibleData.profileInputServerSide.loc = geo.results[0].formatted_address;
      compatibleData.profileInputServerSide.loc = location;
    }
    else {
      console.log( i, title, geo );
      // compatibleData.profileInputServerSide.lngLat = castRandLatLngArray();
    }

    if ( !dryrun ) {

      /* define a creator for the entity to be imported or not */
      const context = {
        a: onlyCreator ? false : true,
        d: creatorUuidE,
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

/*
IMAGES
50 Roxane Cassehgari

LINKS

Link error: request to http://https//none.com failed, reason: getaddrinfo ENOTFOUND https CODE: ENOTFOUND
Link error: request to https://none.com/ failed, reason: connect ECONNREFUSED 62.210.199.57:443 CODE: ECONNREFUSED
83 John Brown
Matched clearly: bbw in http://www.custodiansofchange.com.au/ ( 8 matches)
[
  'bbw', 'bbw',
  'Bbw', 'bbw',
  'bbw', 'BBW',
  'BbW', 'BbW'

]
121 Jodie Hill
Link error: request to https://marianne.com/ failed, reason: Parse Error: Invalid header value char COD
E: HPE_INVALID_HEADER_TOKEN
125 Marianne Williamson
Link error: request to https://none.com/ failed, reason: connect ECONNREFUSED 62.210.199.57:443 CODE: ECONNREFUSED134 Nelson Chick
Link error: request to https://tony.fish/ failed, reason: Client network socket disconnected before secure TLS connection was established CODE: ECONNRESET
136 Tony Fish
Link error: request to https://none.com/ failed, reason: connect ECONNREFUSED 62.210.199.57:443 CODE: ECONNREFUSED
141 Bart Hoorweg
Link error: request to https://none.com/ failed, reason: connect ECONNREFUSED 62.210.199.57:443 CODE: ECONNREFUSED no https: -> www.wiermanmedia.com
142 JR Wiernan
no https: -> www.benjaminlife.one and www.INU.one 147 Benjamin LIfe

Link error: request to https://none.com/ failed, reason: connect ECONNREFUSED 62.210.199.57:443 CODE: ECONNREFUSED
164 Dave Snowden
Matched clearly: bbW in https://sh.academia.edu/MarciaCavalcante ( 4 matches)
[ 'bbW', 'bbW', 'bbW', 'bbW' ]
185 Marcia Schuback
Matched clearly: bBW in https://goonth.medium.com/ ( 16 matches)
[
  'bBW', 'bBW', 'bBW',
  'bBW', 'bBW', 'bBW',

  'bBW', 'bBW', 'bBW',
  'bBW', 'bBW', 'bBW',
  'bBW', 'bBW', 'bBW',
  'bBW'
]
204 Gunther Sonnenfeld

Link error: request to https://www.spanglefish.com/exploringnaturalinclusion/ failed, reason: read ECON
NRESET CODE: ECONNRESET
213 Alan Rayner
Link error: request to https://matriztica.org/ failed, reason: Hostname/IP does not match certificate's
 altnames: Host: matriztica.org. is not in the cert's altnames: DNS:www.matriztica.cl CODE: ERR_TLS_CER
T_ALTNAME_INVALID
286 Humberto Maturana

Matched query string in https://www.binghamton.edu/biology/people/profile.html?id=dwilson
294 David SloanWilson
Matched clearly: BBw in https://www.seinan-gu.ac.jp/ ( 4 matches)
[ 'BBw', 'bbw', 'BBw', 'bBw' ]
311 Christopher Chase
^[[BLink error: request to https://www.danielchristianwahl.com/ failed, reason: certificate has expired
 CODE: CERT_HAS_EXPIRED
317 Daniel Christian Wahl

no https: -> www.kennedy_library.info337 Decalan Kennedy

Matched clearly: bbw in https://integrallife.com/ ( 486 matches)
[
  'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw',
  'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw',
  'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw',
  'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw',
  'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw',
  'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw',
  'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw',
  'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw',
  'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw',

  'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw',
  'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw',
  'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw', 'bbw',
  'bbw', 'bbw', 'bbw', 'bbw',
  ... 386 more items
]
341 Ken Wilber
Matched maybe:  sex  in https://evolutionarymanifesto.academia.edu/JohnStewart ( 8 matches)
[
  ' sex ', ' sex ',
  ' sex ', ' sex ',
  ' sex ', ' sex ',
  ' sex ', ' sex '
]
342 John Stewart

Link error: request to https://none.com/ failed, reason: connect ECONNREFUSED 62.210.199.57:443 CODE: E
CONNREFUSED
375 Lynn Foster

378  Jim Rutt + 1 gets stuck
399 also 400 also

Link error: request to https://www.hypoport.com/ failed, reason: unable to verify the first certificate
 CODE: UNABLE_TO_VERIFY_LEAF_SIGNATURE
405 Dennis Wittrock

406 Christiane Northrup
Matched clearly: facial in http://www.brookings.edu/ ( 11 matches)
[
  'facial', 'Facial',
  'Facial', 'Facial',
  'Facial', 'Facial',
  'Facial', 'facial',
  'Facial', 'facial',
  'facial'
]

Matched clearly: BBw in https://umn.academia.edu/ChristinaKwauk ( 4 matches)
[ 'BBw', 'BBw', 'BBw', 'BBw' ]
407 Christina Kwauk

Not a valid link www.newenergymovement.org
Not a valid link www.thenuifoundation.com
412 Susan Manewich
Link error: request to https://www.openmoney.org/ failed, reason: Hostname/IP does not match certificat
e's altnames: Host: www.openmoney.org. is not in the cert's altnames: DNS:openmoney.org CODE: ERR_TLS_C
ERT_ALTNAME_INVALID
413 Michael Linton

Link error: request to https://whistleblower.org/whistleblower-profiles/edward-snowden/ failed, reason:
 Parse Error: Invalid header value char CODE: HPE_INVALID_HEADER_TOKEN
420 Edward Snowden

Michael Linton No Personal URL found

5 Jean Guo {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}
17 Henrietta Moon {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}

fetch link: https://maps.googleapis.com/maps/api/geocode/json?address=5%20Beach%20Road%20Paekākāriki%20
New%20Zealand%20Australasia&key=AIzaSyDTpTUNUCwzCJ1QcmQTRlBvXULtmYnF6Hw
fetch error: TypeError [ERR_UNESCAPED_CHARACTERS]: Request path contains unescaped characters
    at new NodeError (node:internal/errors:278:15)
    at new ClientRequest (node:_http_client:155:13)
    at request (node:https:313:10)
    at /Users/christianhildebrand/Desktop/PROJECTS/V/Code/v-alpha-2/graphql-firebase-entity-store/node_
modules/node-fetch/lib/index.js:1438:15
    at new Promise (<anonymous>)
    at fetch (/Users/christianhildebrand/Desktop/PROJECTS/V/Code/v-alpha-2/graphql-firebase-entity-stor
e/node_modules/node-fetch/lib/index.js:1407:9)

    at googleGeocodingAPI (/Users/christianhildebrand/Desktop/PROJECTS/V/Code/v-alpha-2/graphql-firebas
e-entity-store/importer/importer-mh.js:216:28)
    at Timeout.runBaseImport [as _onTimeout] (/Users/christianhildebrand/Desktop/PROJECTS/V/Code/v-alph
a-2/graphql-firebase-entity-store/importer/importer-mh.js:150:23)
    at listOnTimeout (node:internal/timers:556:17)
    at processTimers (node:internal/timers:499:7) {
  code: 'ERR_UNESCAPED_CHARACTERS'
}
42 Mike Joy undefined

52 Timothée Parrique {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}
54 Achim Steiner {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],

  status: 'INVALID_REQUEST'
}
78 Peter Harris {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}

95 Robin Lincoln Wood {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}

fetch link: https://maps.googleapis.com/maps/api/geocode/json?address=R.%20Bernardo%20de%20Vasconcelos%
201943%20–%20Realengo%20Rio%20de%20Janeiro%20RJ%20Brazil%20America%20South&key=AIzaSyDTpTUNUCwzCJ1QcmQT
RlBvXULtmYnF6Hw
fetch error: TypeError [ERR_UNESCAPED_CHARACTERS]: Request path contains unescaped characters
    at new NodeError (node:internal/errors:278:15)
    at new ClientRequest (node:_http_client:155:13)
    at request (node:https:313:10)
    at /Users/christianhildebrand/Desktop/PROJECTS/V/Code/v-alpha-2/graphql-firebase-entity-store/node_
modules/node-fetch/lib/index.js:1438:15
    at new Promise (<anonymous>)
    at fetch (/Users/christianhildebrand/Desktop/PROJECTS/V/Code/v-alpha-2/graphql-firebase-entity-stor

e/node_modules/node-fetch/lib/index.js:1407:9)
    at googleGeocodingAPI (/Users/christianhildebrand/Desktop/PROJECTS/V/Code/v-alpha-2/graphql-firebas
e-entity-store/importer/importer-mh.js:216:28)
    at Timeout.runBaseImport [as _onTimeout] (/Users/christianhildebrand/Desktop/PROJECTS/V/Code/v-alph
a-2/graphql-firebase-entity-store/importer/importer-mh.js:150:23)
    at processTicksAndRejections (node:internal/process/task_queues:93:5) {
  code: 'ERR_UNESCAPED_CHARACTERS'
}
120 Glenn Greenwald undefined

123 Andreas Kalcker {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}
129 Deepak Chopra {
  error_message: 'You must use an API key to authenticate each request to Google Maps Platform APIs. Fo
r additional information, please refer to http://g.co/dev/maps-no-account',
  results: [],
  status: 'REQUEST_DENIED'

}
144 Luis Silva {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}

146 Daan Gorter {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}
149 AnaTerra Amorim-Maia {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}
150 Elena Tonetti-Vladimirova { results: [], status: 'ZERO_RESULTS' }

173 Wolfgang Knorr {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}

179 Jennifer Hinton {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}
216 Louis Herman { results: [], status: 'ZERO_RESULTS' }
219 Joe Brewer {
  error_message: 'You must use an API key to authenticate each request to Google Maps Platform APIs. Fo
r additional information, please refer to http://g.co/dev/maps-no-account',
  results: [],
  status: 'REQUEST_DENIED'

}
232 Alnoor Ladha {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}

240 Michelle Holliday {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}
242 Silke Helfrich {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}
244 Brad Lancaster { results: [], status: 'ZERO_RESULTS' }

256 Emil Ejner Friis {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}

265 Jaime Lerner {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}
269 Daniel Görtz {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}
313 Asli Telli {

  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}
340 Christian Kimmich {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}

351 Laura Storm {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}
364 Andrew Sweeny {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}
378 Alekos Pantazis {

  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}
379 Adriana Luna Díaz {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}

404 Alf Hornborg {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'

}
414 Jascha Rohr {
  error_message: 'Invalid request. One of the input parameters contains a non-UTF-8 string.',
  results: [],
  status: 'INVALID_REQUEST'
}
417 Michael Mazzola { results: [], status: 'ZERO_RESULTS' }

*/
