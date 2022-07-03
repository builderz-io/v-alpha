/* eslint-disable no-unused-vars */

const VTranslationsPrev = {}; // placeholder to run previous code

const VTranslation = ( function() {

  /**
   * V Theme Module to manage i18n
   *
   */

  'use strict';

  const locale = getLocale();

  const stringsToTranslate = {};

  const translationPlaceholder = '__';

  const translations = {};

  /* ================== private methods ================= */

  /* ============ public methods and exports ============ */

  function setStringsToTranslate( data ) {
    const obj = {};
    if ( typeof data == 'object' ) {
      Object.keys( data ).forEach( key => {
        obj[data[key]] = translationPlaceholder;
      } );
    }
    else {
      obj[string] = translationPlaceholder;
    }
    Object.assign( stringsToTranslate, obj );
  }

  function getStringsToTranslate() {
    return stringsToTranslate;
  }

  function getString( str ) {
    return locale != 'en_US'
      ? translations[ locale ]
        && translations[ locale ][ str ]
        && translations[ locale ][ str ] != translationPlaceholder
        ? translations[ locale ][ str ]
        : str
      : str;
  }

  function getLocale() {
    const localLocale = V.getLocal( 'locale' ) ? V.getLocal( 'locale' ).replace( /"/g, '' ) : undefined;
    return localLocale
    ||  V.getSetting( 'locale' )
    || 'en_US';
  }

  async function launch() {
    if ( locale == 'en_US' ) { return }
    const source = `${ V.getSetting( 'sourceEndpoint' ) }${ V.getSetting( 'localeSlug' ) }/${ locale }.json`;
    const res = await V.getData( '', source, 'api' );
    translations[locale] = res.data[0];
  }

  V.getString = getString;

  return {
    setStringsToTranslate: setStringsToTranslate,
    getStringsToTranslate: getStringsToTranslate,
    getString: getString,
    getLocale: getLocale,
    launch: launch,
  };

} )();
