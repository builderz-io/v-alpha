const VHelper = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module for the app-core helper functions
  *
  *
  */

  'use strict';

  /* ============ public methods and exports ============ */

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

  function castInitials( which ) {
    const initials = which.split( ' ' ).filter( item => { return isNaN( item ) } );
    const first = initials[0].charAt( 0 );
    const firstConsonant = initials[0].substr( 1 ).split( '' ).filter( letter => { return ['a', 'e', 'i', 'o', 'u'].indexOf( letter ) == -1 } )[0];
    const second = initials[1] ? initials[1].charAt( 0 ) : firstConsonant ? firstConsonant.toUpperCase() : '';
    return first + second;
  }

  function castCamelCase( which ) {

    /* by @smilyface on stackoverflow */
    return which.toLowerCase().replace( /[^a-zA-Z0-9]+(.)/g, ( m, chr ) => {return chr.toUpperCase()} );
  }

  function castShortAddress( address, chars ) {
    return address.substr( 0, chars || 6 ) + ' ... ' + address.substr( address.length - ( chars || 6 ) );
  }

  function getIcon( which ) {
    return which == '+' ? '<span class="plus-icon fs-l no-txt-select">+</span>' : '<img src="assets/icon/' + which + '-24px.svg" height="16px">';
  }

  function setPipe( ...functions ) {

    /**
     * Pipe by Eric Elliott
     * https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d
     */

    return ( x ) => {return functions.reduce( ( v, f ) => {return f( v )}, x )};
  }

  function i18n( which ) {
    return getTranslation( which );
  }

  function getTranslation( which ) {
    // TODO
    return which;
  }

  return {
    castLinks: castLinks,
    castTime: castTime,
    castInitials: castInitials,
    castCamelCase: castCamelCase,
    castShortAddress: castShortAddress,
    getIcon: getIcon,
    setPipe: setPipe,
    getTranslation: getTranslation,
    i18n: i18n,
  };

} )();
