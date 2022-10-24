const VDebugger = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to place a debbuging-element in the DOM
   *
   */

  'use strict';

  /**
    * Send console logs to server for debugging
    *
    */

  const queue = [];

  if ( VConfig.getSetting( 'sendLogsToServer' ) ) {
    Object.assign( window.console, {
      log: handleConsoleMessage,
      error: handleConsoleMessage,
      // warn: handleConsoleMessage,
    } );
  }

  const sessionNr = Date.now();

  console.log( '*** NEW SESSION ***' );
  console.log( '*** ', window.location.href );
  console.log( '*** ', new Date().toString() );
  console.log( '*** ', navigator.userAgent );
  console.log( '*** App version ', VConfig.getSetting( 'appVersion' ) );
  console.log( '*** Upload version ', VConfig.getSetting( 'uploadVersion' ) );
  console.log( '*** NEW SESSION END ***' );

  function handleConsoleMessage( msg, data ) {
    queue.push( ' ' + msg + ( typeof data == 'string' ? data : data ? JSON.stringify( data ) : '' ) );
  }

  function postQueue( queue ) {
    fetch( V.getSetting( 'socketHost' ) + '/logs', {
      method: 'POST', // or 'PUT'
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( sessionNr + ' - ' + String( new Date() ).substr( 16, 8 ) + ' // ' + queue ),
    } );
    queue.length = 0;
  }

  setInterval( ( q ) => { if( q.length ) { postQueue( q ) } }, 9000, queue );

  const $debug = V.cN( {
    t: 'debug',
    c: 'debug',
    s: {
      debug: {
        'position': 'fixed',
        'top': '174px',
        'left': '28px',
        'font-size': '0.9rem',
        'cursor': 'pointer',
        'background': 'bisque',
        'max-width': '340px',
        'word-wrap': 'anywhere',
        'padding': '10px',
        'list-style': 'none',
        'max-height': '410px',
        'overflow-y': 'scroll',
      },
    },
    h: {
      tag: 'ul',
    },
    k: handleClearDebugNode,
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

    setTimeout( setDebugNode, 3000 );

  }

  function setDebugNode() {
    V.setNode( 'body', $debug );
  }

  function debugLogs() {
    return V.cN( {
      c: 'debog-log__btn cursor-pointer',
      s: {
        'debog-log__btn': {
          position: 'fixed',
          top: '174px',
          left: '0px',
          background: 'green',
          color: 'white',
          padding: '4px 6px',
        },
      },
      k: handleDebugLogs,
      h: 'L',
    } );
  }

  function downloadStrings() {
    return V.cN( {
      c: 'download-strings__btn cursor-pointer',
      s: {
        'download-strings__btn': {
          position: 'fixed',
          top: '200px',
          left: '0px',
          background: 'orange',
          color: 'white',
          padding: '4px 5px',
        },
      },
      k: handleStringsDownload,
      h: 'T',
    } );
  }

  function resetApp() {
    return V.cN( {
      c: 'reset-app__btn cursor-pointer',
      s: {
        'reset-app__btn': {
          position: 'fixed',
          top: '226px',
          left: '0px',
          background: 'blue',
          color: 'white',
          padding: '4px 5px',
        },
      },
      k: handleAppReset,
      h: 'R',
    } );
  }

  /* ====================== handlers ====================== */

  function handleClearDebugNode() {
    V.setNode( 'debug', 'clear' );
  }

  function handleAppReset() {
    localStorage.clear();
    location = window.location.origin;
  }

  function handleDebugLogs() {
    V.setToggle( 'debug' );
  }

  function handleStringsDownload() {
    const json = JSON.stringify( VTranslation.getStringsToTranslate(), null, 2 );
    const blob = new Blob( [json], { type: 'application/json' } );
    const $a = document.createElement( 'a' );
    $a.download = 'strings.json';
    $a.href = window.URL.createObjectURL( blob );
    $a.click();
  }

  /* ====================== export ====================== */

  V.debug = debug;

  return {
    debug: debug,
    debugLogs: debugLogs,
    downloadStrings: downloadStrings,
    resetApp: resetApp,
  };

} )();
