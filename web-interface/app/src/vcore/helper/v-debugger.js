const VDebugger = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to place a debbuging-element in the DOM
   *
   */

  'use strict';

  const $debug = V.setNode( {
    tag: 'debug',
    classes: 'debug',
    setStyle: {
      debug: {
        'position': 'fixed',
        'top': '7rem',
        'margin': '6px',
        'font-size': '0.9rem',
        'cursor': 'pointer',
        'background': 'bisque',
        'z-index': 9999,
        'max-width': '340px',
        'word-wrap': 'anywhere',
        'padding': '10px',
        'list-style': 'none',
        'max-height': '410px',
        'overflow-y': 'scroll'
      }
    },
    html: V.setNode( {
      tag: 'ul'
    } )
  } );

  $debug.addEventListener( 'click', function() {
    V.setNode( 'debug', 'clear' );
  } );

  /* ================== public methods ================== */

  function debug( one, two, three, four, five, six ) {
    const debugArr = [one, two, three, four, five, six];
    console.log( '*** debug ***' );
    $debug.appendChild( V.setNode( { tag: 'li', html: '*** debug ***' } ) );
    debugArr.forEach( item => {
      if ( item != undefined ) {
        console.log( item );
        $debug.appendChild( V.setNode( { tag: 'li', html: JSON.stringify( item ) } ) );
      }
    } );
    V.setNode( 'body', $debug );
  }

  /* ====================== export ====================== */

  ( () => {
    V.debug = debug;
  } )();

  return {
    debug: debug
  };

} )();
