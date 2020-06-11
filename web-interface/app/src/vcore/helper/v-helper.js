const VHelper = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module for helper functions
   *
   */

  'use strict';

  const urlCreator = window.URL || window.webkitURL;

  /* ================== private methods ================= */

  function castTranslationFile( which, whichContext, whichPart ) {
    const obj = {};
    obj[whichContext] = {};
    obj[whichContext][which] = { en_US: which, de_DE: '', es_ES: '' };

  }

  /* ================== public methods ================== */

  function castImageUpload( e ) {
    // credit to https://zocada.com/compress-resize-images-javascript-browser/

    return new Promise( ( resolve, reject ) => {
      const width = V.getSetting( 'thumbnailWidth' );

      const reader = new FileReader();
      reader.readAsDataURL( e.target.files[0] );

      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          // img.width and img.height will contain the original dimensions
          const elem = document.createElement( 'canvas' );
          elem.width = width; // img.width * ( height / img.height );
          elem.height = img.height * ( width / img.width ); // height;
          const ctx = elem.getContext( '2d' );
          ctx.drawImage( img, 0, 0, elem.width, elem.height );

          const elem2 = document.createElement( 'canvas' );
          elem2.width = 32;
          elem2.height = elem2.width;
          const ctx2 = elem2.getContext( '2d' );
          ctx2.drawImage( img, 0, 0, elem2.width, elem2.height );

          ctx.canvas.toBlob( blob => {

            const imageData = {
              blob: blob,
              contentType: blob.type,
              originalName: e.target.files[0].name
            };
            V.setState( 'imageUpload', imageData );

            ctx2.canvas.toBlob( blob => {
              const imageData = {
                blob: blob,
                contentType: blob.type,
                originalName: e.target.files[0].name
              };
              V.setState( 'tinyImageUpload', imageData );

              resolve( {
                success: true,
                status: 'image prepared for upload',
                src: img.src,
              } );

            }, 'image/jpeg', V.getSetting( 'thumbnailQuality' ) );

          }, 'image/jpeg', V.getSetting( 'thumbnailQuality' ) );

        };
      };

      reader.onerror = error => {
        reject( {
          success: false,
          status: 'could not prepare image for upload',
          message: error
        } );
      };
    } );

  }

  function castEntityThumbnail( thumbnailData ) {
    const arrayBufferView = new Uint8Array( thumbnailData.blob.data );
    const blob = new Blob( [ arrayBufferView ], { type: thumbnailData.contentType } );
    const src = urlCreator.createObjectURL( blob );

    const $img = V.cN( {
      t: 'img',
      c: 'max-w-full',
      a: {
        src: src,
        alt: thumbnailData.entity + ' ' + V.i18n( 'Title Image', 'user profile', 'image alt text' ) + ' - ' + thumbnailData.originalName
      },
      // TODO: revokeObjectURL
      // e: {
      //   onload: setSrc.bind( { src: src, clear: true } ),
      // },
    } );

    return {
      img: $img,
      src: src
    };
  }

  function setSrc() {
    const urlCreator = window.URL || window.webkitURL;
    if ( this.clear ) {
      urlCreator.revokeObjectURL( this.src );
    }
  }

  function castLinks( which ) {

    // test text:
    // normal link www.apple.com and youtube link https://youtu.be/D5f78SK6EnI and vimeo link https://vimeo.com/319038756

    var text = which.replace( /www./gi, 'www.' ).replace( /http/gi, 'http' ).replace( /https/gi, 'https' ),
      linksFound = text.match( /(?:www|https?)[^\s]+/g ),
      aLink = [];

    if ( linksFound != null ) {

      for ( let i=0; i<linksFound.length; i++ ) {
        let replace = linksFound[i];
        if ( !( linksFound[i].match( /(http(s?)):\/\// ) ) ) { replace = 'http://' + linksFound[i] }
        let linkText = replace.split( '/' )[2];
        if ( linkText.substring( 0, 3 ) == 'www' ) { linkText = linkText.replace( 'www.', '' ) }
        if ( linkText.match( /youtu/ ) ) {
          // fluid width video: https://css-tricks.com/NetMag/FluidWidthVideo/Article-FluidWidthVideo.php
          const youtubeID = replace.split( '/' ).slice( -1 )[0];
          aLink.push( '<iframe src="https://www.youtube.com/embed/' + youtubeID + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' );
        }
        else if ( linkText.match( /vimeo/ ) ) {
          const vimeoID = replace.split( '/' ).slice( -1 )[0];
          aLink.push( '<iframe src="https://player.vimeo.com/video/' + vimeoID + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' );
        }
        else {
          aLink.push( '<a href="' + replace + '" target="_blank">' + linkText + '</a>' );
        }
        text = text.split( linksFound[i] ).map( item => { return aLink[i].includes( 'iframe' ) ? item.trim() : item } ).join( aLink[i] );
      }
      return text;

    }
    else {
      return which;
    }
  }

  function castTime( which, whichFormat ) {
    return moment( which ).format( whichFormat || 'D MMM YYYY h:mm a' );
  }

  function castRandLatLng() {
    return {
      lat: ( Math.random() * ( 36 - 26 + 1 ) + 25 ).toFixed( 5 ),
      lng: ( Math.random() * ( 53 - 31 + 1 ) + 32 ).toFixed( 5 ) * -1
    };
  }

  function castInitials( which ) {
    const initials = which.split( ' ' ).filter( item => { return isNaN( item ) } );
    if ( initials.length ) {
      const first = initials[0].charAt( 0 );
      const firstConsonant = initials[0].substr( 1 ).split( '' ).filter( letter => { return ['a', 'e', 'i', 'o', 'u'].indexOf( letter ) == -1 } )[0];
      const second = initials[1] ? initials[1].charAt( 0 ) : firstConsonant ? firstConsonant.toUpperCase() : '';
      return first + second;
    }
    else {
      return which.charAt( 0 );
    }
  }

  function castCamelCase( which ) {

    /* by @smilyface on stackoverflow */
    return which.toLowerCase().replace( /[^a-zA-Z0-9]+(.)/g, ( m, chr ) => {return chr.toUpperCase()} );
  }

  function castSlugOrId( which ) {
    if ( which.includes( '#' ) ) {
      // returns a slug from a fullId
      return which.toLowerCase().replace( '#', '' ).replace( /\s/g, '-' );
    }
    if ( which.includes( '/' ) ) {
      // returns a slug from a path
      const split = which.split( '/' );
      return split.pop();
    }
    else {
      // returns a fullId from a slug
      const split = which.split( '-' );
      const tag = '#' + split.pop();
      const title = V.castEntityTitle( split.join( ' ' ) ).data[0];
      return title + ' ' + tag;
    }
  }

  function castPathOrId( which, whichBase ) {
    const base = whichBase ? '/' + whichBase + '/' : '/profile/';
    if ( which.includes( '#' ) ) {
      // returns a path from a fullId
      return base + which.toLowerCase().replace( '#', '' ).replace( /\s/g, '-' );
    }
    else {
      // returns a fullId from a path
      which = which.replace( base, '' );
      const split = which.split( '-' );
      const tag = '#' + split.pop();
      const title = V.castEntityTitle( split.join( ' ' ) ).data[0];
      return title + ' ' + tag;
    }
  }

  function castJson( data, clone ) {

    if ( !data || data === 'undefined' ) {
      return data;
    }
    else if ( clone ) {
      return JSON.parse( JSON.stringify( data ) );
    }
    else if ( typeof data === 'string' ) {
      return JSON.parse( data );
    }
    else if ( typeof data === 'object' ) {
      return JSON.stringify( data );
    }
    else {
      console.error( 'Could not convert JSON' );
    }
  }

  function castShortAddress( address, chars ) {
    return address.substr( 0, chars || 6 ) + ' ... ' + address.substr( address.length - ( chars || 6 ) );
  }

  function castUUID( input ) {
    // creation adapted from https://github.com/uuidjs/uuid
    // encode/decode adapted from https://gist.github.com/brianboyko/1b652a1bf85c48bc982ab1f2352246c8
    // on 6th May 2020

    // converts a UUID to a URL-safe version of base 64.
    const encode = uuid => {
      const stripped = uuid.replace( /-/g, '' ); // remove dashes from uuid
      const true64 = btoa(
        String.fromCharCode.apply(
          null,
          stripped
            .replace( /\r|\n/g, '' )
            .replace( /([\da-fA-F]{2}) ?/g, '0x$1 ' )
            .replace( / +$/, '' )
            .split( ' ' )
        )
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
      const raw = atob( true64 ); // decode the raw base 64 into binary buffer.

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
      let uuidV4, encoded;

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

      uuidV4 = v4();
      encoded = encode( uuidV4 );

      while ( uuidV4.charAt( 0 ) == '0' ||
              encoded.includes( '-' ) ||
              encoded.includes( '_' ) ||
              encoded.includes( 'O' ) ||
              ['v', 'V'].includes( encoded.charAt( 0 ) ) ||
              ['x', 'X'].includes( encoded.charAt( 1 ) ) ||
              // !encoded.charAt( 0 ).match( /[0-9]/ ) ||
              !encoded.charAt( 0 ).match( /[A-Z]/ ) ||
              !encoded.charAt( 1 ).match( /[A-Z]/ )
      ) {
        uuidV4 = v4();
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

  }

  function castRandomInt( min, max ) {
    min = Math.ceil( min );
    max = Math.floor( max );

    // min and max inclusive
    const incMinMax = Math.floor( Math.random() * ( max - min + 1 ) ) + min;

    return incMinMax;
  }

  function castTag() {
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
  }

  function getIcon( which ) {
    return which == '+' ? '<span class="plus-icon fs-l no-txt-select">+</span>' : '<img src="/assets/icon/' + which + '-24px.svg" height="16px">';
  }

  function stripHtml( which ) {
    return which.replace( /(<([^>]+)>)/ig, '' );
  }

  function setPipe( ...functions ) {

    /**
     * Pipe by Eric Elliott
     * https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d
     */

    return ( x ) => {return functions.reduce( ( v, f ) => {return f( v )}, x )};
  }

  function getTranslation( which, whichContext, whichDescr = '' ) {

    // castTranslations( which, whichContext, whichPart );
    const aE = V.getState( 'activeEntity' );
    const lang = aE ? aE.properties ? aE.properties.appLang ? aE.properties.appLang : 'en_US' : 'en_US' : 'en_US';
    const exists = VTranslations[whichContext][which] ?
      VTranslations[whichContext][which][lang] == '' ? undefined : VTranslations[whichContext][which][lang] : undefined;

    if ( exists ) {
      return exists;
    }
    else {
      return which;
    }
  }

  function i18n( which, whichContext, whichDescr ) {
    return getTranslation( which, whichContext, whichDescr );
  }

  /* ====================== export ====================== */

  ( () => {
    V.castImageUpload = castImageUpload;
    V.castEntityThumbnail = castEntityThumbnail;
    V.setSrc = setSrc;
    V.castLinks = castLinks;
    V.castTime = castTime;
    V.castRandLatLng = castRandLatLng;
    V.castInitials = castInitials;
    V.castCamelCase = castCamelCase;
    V.castSlugOrId = castSlugOrId;
    V.castPathOrId = castPathOrId;
    V.castJson = castJson;
    V.castShortAddress = castShortAddress;
    V.castUUID = castUUID;
    V.castRandomInt = castRandomInt;
    V.castTag = castTag;
    V.getIcon = getIcon;
    V.stripHtml = stripHtml;
    V.setPipe = setPipe;
    V.getTranslation = getTranslation;
    V.i18n = i18n;
  } )();

  return {
    castImageUpload: castImageUpload,
    castEntityThumbnail: castEntityThumbnail,
    setSrc: setSrc,
    castLinks: castLinks,
    castTime: castTime,
    castRandLatLng: castRandLatLng,
    castInitials: castInitials,
    castCamelCase: castCamelCase,
    castSlugOrId: castSlugOrId,
    castPathOrId: castPathOrId,
    castJson: castJson,
    castShortAddress: castShortAddress,
    castUUID: castUUID,
    castRandomInt: castRandomInt,
    castTag: castTag,
    getIcon: getIcon,
    stripHtml: stripHtml,
    setPipe: setPipe,
    getTranslation: getTranslation,
    i18n: i18n,
  };

} )();
