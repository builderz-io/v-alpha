const VHelper = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module for helper functions
   *
   */

  'use strict';

  const urlCreator = window.URL || window.webkitURL;

  const socialMatch = 'facebook|twitter|linkedin|t.me|instagram|tiktok|medium';

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
      const tinyImageWidth = V.getSetting( 'tinyImageWidth' );
      const thumbnailWidth = V.getSetting( 'thumbnailWidth' );
      const mediumImageWidth = V.getSetting( 'mediumImageWidth' );

      const reader = new FileReader();
      reader.readAsDataURL( e.target.files[0] );

      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          // img.width and img.height will contain the original dimensions

          const tiny = document.createElement( 'canvas' );
          tiny.width = tinyImageWidth;
          tiny.height = tinyImageWidth;
          const tinyImage = tiny.getContext( '2d' );
          tinyImage.drawImage( img, 0, 0, tiny.width, tiny.height );

          const thumb = document.createElement( 'canvas' );
          thumb.width = thumbnailWidth; // img.width * ( height / img.height );
          thumb.height = img.height * ( thumbnailWidth / img.width ); // height;
          const thumbnail = thumb.getContext( '2d' );
          thumbnail.drawImage( img, 0, 0, thumb.width, thumb.height );

          const medium = document.createElement( 'canvas' );
          medium.width = mediumImageWidth; // img.width * ( height / img.height );
          medium.height = img.height * ( mediumImageWidth / img.width ); // height;
          const mediumImage = medium.getContext( '2d' );
          mediumImage.drawImage( img, 0, 0, medium.width, medium.height );

          tinyImage.canvas.toBlob( tinyBlob => {
            V.setState( 'tinyImageUpload', {
              dataUrl: tinyImage.canvas.toDataURL( 'image/jpeg' ),
              blob: tinyBlob,
              contentType: tinyBlob.type,
              originalName: e.target.files[0].name,
            } );

            thumbnail.canvas.toBlob( thumbBlob => {
              V.setState( 'thumbnailUpload', {
                dataUrl: thumbnail.canvas.toDataURL( 'image/jpeg' ),
                blob: thumbBlob,
                contentType: thumbBlob.type,
                originalName: e.target.files[0].name,
              } );

              mediumImage.canvas.toBlob( mediumBlob => {
                V.setState( 'mediumImageUpload', {
                  dataUrl: mediumImage.canvas.toDataURL( 'image/jpeg' ),
                  blob: mediumBlob,
                  contentType: mediumBlob.type,
                  originalName: e.target.files[0].name,
                } );

                resolve( {
                  success: true,
                  status: 'images prepared for upload',
                  src: img.src,
                } );

              }, 'image/jpeg', V.getSetting( 'mediumImageQuality' ) );

            }, 'image/jpeg', V.getSetting( 'thumbnailQuality' ) );

          }, 'image/jpeg', V.getSetting( 'tinyImageQuality' ) );

        };
      };

      reader.onerror = error => {
        reject( {
          success: false,
          status: 'could not prepare image for upload',
          message: error,
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
        alt: thumbnailData.entity + ' ' + 'Title Image' + ' - ' + thumbnailData.originalName,
      },
      // TODO: revokeObjectURL
      // e: {
      //   onload: setSrc.bind( { src: src, clear: true } ),
      // },
    } );

    return {
      img: $img,
      src: src,
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

    const text = which.replace( /www./gi, 'www.' ).replace( /http/gi, 'http' ).replace( /https/gi, 'https' );
    const linksFound = text.match( /(?:www|https?)[^\s]+/g );
    const iframeLinks = [], regularLinks = [], socialLinksImages = [], socialLinksHandles = [];

    let links = ( ' ' + text ).slice( 1 );
    let iframes = ( ' ' + text ).slice( 1 );

    if ( linksFound != null ) {

      for ( let i=0; i<linksFound.length; i++ ) {
        let anchorText, replace = linksFound[i];
        if ( replace.substr( -1 ) == '.' ) { replace = replace.slice( 0, -1 ) }
        if ( !( linksFound[i].match( /(http(s?)):\/\// ) ) ) { replace = 'http://' + linksFound[i] }

        let host = replace.split( '/' )[2];
        host = host.replace( 'www.', '' );

        if ( Number( replace.substr( -5 ) ) < -2000 ) {
          anchorText = V.castPathOrId( replace.split( '/' ).pop() );
        }
        else if ( host.match( new RegExp( socialMatch ) ) ) {
          anchorText = replace.split( '/' ).pop();
          socialLinksImages.push( '<a href="' + replace + '">' + V.getIcon( host.match( new RegExp( socialMatch ) )[0] ) + '</a>' );
          socialLinksHandles.push( '<a href="' + replace + '">' + anchorText + '</a>' );
        }
        else {
          anchorText = host;
        }

        regularLinks.push( '<a href="' + replace + '" >' + anchorText + '</a>' );

        if ( host.match( /youtu/ ) ) {
          // fluid width video: https://css-tricks.com/NetMag/FluidWidthVideo/Article-FluidWidthVideo.php
          const youtubeID = replace.split( '/' ).slice( -1 )[0];
          const iframe = '<div class="iframe-wrapper w-full"><iframe src="https://www.youtube.com/embed/' + youtubeID + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
          iframeLinks.push( iframe );
        }
        else if ( host.match( /vimeo/ ) ) {
          const vimeoID = replace.split( '/' ).slice( -1 )[0];
          const iframe = '<div class="iframe-wrapper w-full"><iframe src="https://player.vimeo.com/video/' + vimeoID + '?color=ffffff&title=0&byline=0&portrait=0" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>';
          iframeLinks.push( iframe );
        }
        else if ( host.match( /soundcloud/ ) ) {
          const split = replace.split( '/' );
          const scID = split.slice( -1 )[0]; // example 933028357
          if ( isNaN( scID ) ) {
            iframeLinks.push( '<a href="' + replace + '" >' + anchorText + '</a>' );
          }
          else {

            /* omit number and replace link in regularLinks */
            split.pop();
            regularLinks.pop();
            regularLinks.push( '<a href="' + split.join( '/' ) + '" >' + anchorText + '</a>' );

            /* generate the iframe from track ID */
            const iframe = `
              <div class="iframe-wrapper w-full">
              <iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${ scID }&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
              ></iframe>
              </div>
              `;
            iframeLinks.push( iframe );
          }
        }
        else {
          iframeLinks.push( '<a href="' + replace + '" >' + anchorText + '</a>' );
        }
        iframes = iframes.split( linksFound[i] ).map( item => iframeLinks[i].includes( 'iframe' ) ? item.trim() : item ).join( iframeLinks[i] );
        links = links.split( linksFound[i] ).join( regularLinks[i] );
      } // end loop over linksFound

      /* create a version without the social links */
      let omitOriginalSocialLinks = ( ' ' + iframes ).slice( 1 );
      for ( let i=0; i<linksFound.length; i++ ) {
        if ( iframeLinks[i].match( new RegExp( socialMatch ) ) ) {
          omitOriginalSocialLinks = omitOriginalSocialLinks.replace( iframeLinks[i], '' );
        }
      }

      /* remove excess line-breaks */
      omitOriginalSocialLinks = omitOriginalSocialLinks.trim().replace( /( <br>){3,}/g, ' <br> <br>' );
      while ( omitOriginalSocialLinks.startsWith( '<br>' ) ) {
        omitOriginalSocialLinks = omitOriginalSocialLinks.replace( '<br>', '' ).trim();
      }

      return {
        original: which,
        links: links,
        socialLinksImages: socialLinksImages.length ? socialLinksImages.join( ' ' ) : false,
        socialLinksHandles: socialLinksHandles,
        omitOriginalSocialLinks: omitOriginalSocialLinks,
        iframes: iframes,
        firstIframe: iframeLinks[0],
      };

    }
    else {
      return {
        original: which,
        links: which,
        socialLinksImages: false,
        socialLinksHandles: which,
        omitOriginalSocialLinks: which,
        iframes: which,
        firstIframe: iframeLinks[0],
      };
    }
  }

  function castTime( which, whichFormat ) {
    return String( new Date( which ) ).substr( 4, 6 );
    // return moment( which ).format( whichFormat || 'D MMM YYYY h:mm a' );
  }

  function castRandLatLng() {
    const lat = ( Math.random() * ( 36 - 26 + 1 ) + 25 ).toFixed( 5 ) * 1;
    const lng = ( Math.random() * ( 53 - 31 + 1 ) + 32 ).toFixed( 5 ) * -1;
    return {
      lat: lat,
      lng: lng,
      latLng: [lat, lng],
      lngLat: [lng, lat],
    };
  }

  function castInitials( which ) {
    const initials = which ? which.split( ' ' ).filter( item => isNaN( item.replace( '#', '' ) ) ) : [];
    if ( initials.length ) {
      const first = initials[0].charAt( 0 );
      const firstConsonant = initials[0].substr( 1 ).split( '' ).filter( letter => ['a', 'e', 'i', 'o', 'u'].indexOf( letter ) == -1 )[0];
      const second = initials[1] ? initials[1].charAt( 0 ) : firstConsonant ? firstConsonant.toUpperCase() : '';
      return first + second;
    }
    else {
      return which ? which.charAt( 0 ) : '';
    }
  }

  function castCamelCase( which ) {

    /* by @smilyface on stackoverflow */
    return which.toLowerCase().replace( /[^a-zA-Z0-9]+(.)/g, ( m, chr ) => chr.toUpperCase() );
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

  function castFullId( title, tag ) {
    const split = title.split( '#' );
    return tag ? title + ' ' + tag : { title: split[0].trim(), tag: '#' + split[1] };
  }

  function castRole( role ) {
    switch ( role ) {
    case 'all' : return 'all';
    case 'Person' : return 'aa';
    case 'aa' : return 'Person';
    case 'PersonMapped' : return 'ab';
    case 'ab' : return 'Person'; // combine "PersonMapped" with "Person" on retrieval
    case 'Business' : return 'ac';
    case 'ac' : return 'Business';
    case 'Institution' : return 'ad';
    case 'ad' : return 'Institution';
    case 'NGO' : return 'ae';
    case 'ae' : return 'NGO';
    case 'GOV' : return 'af';
    case 'af' : return 'GOV';
    case 'Network' : return 'ag';
    case 'ag' : return 'Network';
    case 'Skill' : return 'ah';
    case 'ah' : return 'Skill';
    case 'Task' : return 'ai';
    case 'ai' : return 'Task';
    case 'Place' : return 'aj';
    case 'aj' : return 'Place';
    case 'Event' : return 'ak';
    case 'ak' : return 'Event';
    case 'Media' : return 'al';
    case 'al' : return 'Media';
    case 'Dataset' : return 'am';
    case 'am' : return 'Dataset';
    case 'ResourcePool' : return 'an';
    case 'an' : return 'Pool';
    default: return role;
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

  function castUuid( input ) {
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
          bth[buf[i + 0]]
          + bth[buf[i + 1]]
          + bth[buf[i + 2]]
          + bth[buf[i + 3]]
          + '-'
          + bth[buf[i + 4]]
          + bth[buf[i + 5]]
          + '-'
          + bth[buf[i + 6]]
          + bth[buf[i + 7]]
          + '-'
          + bth[buf[i + 8]]
          + bth[buf[i + 9]]
          + '-'
          + bth[buf[i + 10]]
          + bth[buf[i + 11]]
          + bth[buf[i + 12]]
          + bth[buf[i + 13]]
          + bth[buf[i + 14]]
          + bth[buf[i + 15]]
        ).toLowerCase();
      };

      const rng = () => {
        // Unique ID creation requires a high quality random # generator. In the browser we therefore
        // require the crypto API and do not support built-in fallback to lower quality random number
        // generators (like Math.random()).

        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
        // find the complete implementation of crypto (msCrypto) on IE11.
        const getRandomValues
        = (
          typeof crypto !== 'undefined'
          && crypto.getRandomValues
          && crypto.getRandomValues.bind( crypto )
        )
        || (
          typeof msCrypto !== 'undefined'
          && typeof msCrypto.getRandomValues === 'function'
          && msCrypto.getRandomValues.bind( msCrypto )
        );

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
        !encoded.charAt( 3 ).match( /[a-zABE-Z]/ )
        || encoded.includes( '-' )
        || encoded.includes( '_' )
        || ['v', 'V'].includes( encoded.charAt( 3 ) )
        || ['x', 'X'].includes( encoded.charAt( 4 ) )
      ) {
        uuidV4 = universalV4();
        encoded = encode( uuidV4 );
      }

      return {
        v4: uuidV4,
        base64Url: encoded,
      };
    }
    else if ( input.length == V.getSetting( 'uuidStringLength' ) ) {
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

  function castUnix() {
    return Math.floor( Date.now() / 1000 );
  }

  function getIcon( which, height ) {
    return which.match( new RegExp( socialMatch ) )
      ? V.cN( {
        t: 'img',
        src: V.getSetting( 'sourceEndpoint' ) + '/assets/icon/social/' + which + '.svg',
        a: {
          height: '28px',
        },
      } )
      : which == '+'
        ? V.cN( {
          t: 'span',
          c: 'plus-icon fs-l no-txt-select',
          h: '+',
        } )
        : V.cN( {
          t: 'img',
          src: V.getSetting( 'sourceEndpoint' ) + '/assets/icon/' + which + '-24px.svg',
          a: {
            height: height || '16px',
          },
        } );

  }

  function stripHtml( which ) {
    return which.replace( /(<([^>]+)>)/ig, '' );
  }

  function setPipe( ...functions ) {

    /**
     * Pipe by Eric Elliott
     * https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d
     */

    return ( x ) => functions.reduce( ( v, f ) => f( v ), x );
  }

  function getTranslation( which, whichContext, whichDescr = '' ) {

    // castTranslations( which, whichContext, whichPart );
    const aE = V.aE();
    const lang = aE ? aE.properties ? aE.properties.appLang ? aE.properties.appLang : 'en_US' : 'en_US' : 'en_US';
    // console.log( lang, whichContext, which );
    // if ( lang != 'en_US' ) {
    const exists = VTranslations[whichContext][which]
      ? VTranslations[whichContext][which][lang] != ''
        ? VTranslations[whichContext][which][lang]
        : undefined
      : undefined;
    return exists ? exists : which;
    // }
    // else {
    //   return which;
    // }
  }

  function i18n( which, whichContext, whichDescr ) {
    return getTranslation( which, whichContext, whichDescr );
  }

  function sleep( ms ) {
    return new Promise( resolve => setTimeout( resolve, ms ) );
  }

  function successFalse( msg, err, data ) {
    return {
      success: false,
      message: `could not ${ msg }: ${ err || 'no error message' }`,
      data: [ data ],
    };
  }

  function successTrue( msg, data ) {
    return {
      success: true,
      message: `successfully ${ msg }`,
      data: Array.isArray( data ) ? data : [ data ],
    };
  }

  /* ====================== export ====================== */

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
  V.castFullId = castFullId;
  V.castRole = castRole;
  V.castJson = castJson;
  V.castShortAddress = castShortAddress;
  V.castUuid = castUuid;
  V.castRandomInt = castRandomInt;
  V.castUnix = castUnix;
  V.getIcon = getIcon;
  V.stripHtml = stripHtml;
  V.setPipe = setPipe;
  V.getTranslation = getTranslation;
  V.i18n = i18n;
  V.sleep = sleep;
  V.successFalse = successFalse;
  V.successTrue = successTrue;

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
    castFullId: castFullId,
    castRole: castRole,
    castJson: castJson,
    castShortAddress: castShortAddress,
    castUuid: castUuid,
    castRandomInt: castRandomInt,
    castUnix: castUnix,
    getIcon: getIcon,
    stripHtml: stripHtml,
    setPipe: setPipe,
    getTranslation: getTranslation,
    i18n: i18n,
    sleep: sleep,
    successFalse: successFalse,
    successTrue: successTrue,
  };

} )();
