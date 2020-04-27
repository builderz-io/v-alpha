const VDom = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module for dom-manipulation methods
  *
  *
  */

  'use strict';

  /* ================== private methods ================= */

  function placeNode( $targetNode, $node, prepend ) {
    // TODO: add prepend node
    prepend == 'prepend' || prepend == true ? $targetNode.prepend( $node ) : $targetNode.append( $node );
  }

  /* ============ public methods and exports ============ */

  function castNode( data ) {

    const $elem = data.t ? document.createElement( data.t ) : document.createElement( data.tag );

    for ( const key in data ) {
      if ( ['s', 'setStyle', 'setStyles', 'setClass', 'setClasses'].includes( key ) ) {
        setStyle( 'component-styles', data[key] );
      }
      else if ( ['c', 'class', 'classes'].includes( key ) ) {
        $elem.className = data[key];
      }
      else if ( ['k', 'click'].includes( key ) ) {
        $elem.addEventListener( 'click', data[key] );
      }
      else if ( ['y', 'style', 'styles'].includes( key ) ) {
        Object.assign( $elem.style, data[key] );
      }
      else if ( ['i', 'id'].includes( key ) ) {
        $elem.setAttribute( 'id', data[key] );
      }
      else if ( ['f', 'href'].includes( key ) ) {
        $elem.setAttribute( 'href', data[key] );
      }
      else if ( ['a', 'attribute', 'attributes'].includes( key ) ) {
        for ( const attr in data[key] ) {
          if ( data[key][attr] ) {
            $elem.setAttribute( attr, data[key][attr] );
          }
        }
      }
      else if ( ['h', 'html'].includes( key ) ) {
        if ( typeof data[key] == 'object' ) {
          $elem.appendChild( data[key] );
        }
        else if ( typeof data[key] == 'string' ) {
          $elem.innerHTML = data[key];
        }
      }
    }
    return $elem;
  }

  function cN( data ) {
    return castNode( data );
  }

  function setNode( targetNode, data, prepend ) {

    /**
     * Create a HTML element and optionally place it into target node
     * @param { (string|Object) } targetNode - The target node to fetch, target node object or settings object
     * @param { (Object|Array) } data - The settings object, node object or array of node objects
     *
     * Examples of allowed combinations:

       setNode( { tag: 'div', classes: 'large blue', ... } ); // "tag or "t"

       setNode( '.body-wrapper', { tag: 'div', classes: 'large blue', ... } ); // "tag or "t"

       setNode( $targetNode, $someNode );

       setNode( $targetNode, [ $someNode, $someOtherNode, ... ] );

     */

    /**
     * clear node or clear innerHTML of node
     */

    if ( data && ( data == 'clear' || data.clear == true ) ) {
      const elem = document.querySelector( targetNode );
      elem ? elem.parentNode.removeChild( elem ) : null;
      return;
    }

    if ( data == '' ) {
      document.querySelector( targetNode ).innerHTML = '';
      return;
    }

    /**
     * determine actions based on targetNode and data
     */

    if ( data ) {

      let $targetNode = targetNode;

      if ( typeof targetNode == 'string' ) {

        /**
         * 1. fetch node from DOM
         * 2. replace targetNode with the fetched node
         */

        $targetNode = getNode( targetNode );
      }

      if ( Array.isArray( data ) ) {
        data.forEach( $node => {

          /**
           * place each node from array into target node
           */

          placeNode( $targetNode, $node, prepend );

        } );
      }
      else if ( typeof data == 'object' ) {
        if ( data.t || data.tag ) {

          /**
           * 1. create new node
           * 2. place this new node into target node
           */

          placeNode( $targetNode, castNode( data ), prepend );

        }
        else {

          /**
           * place given node into target node
           */

          placeNode( $targetNode, data, prepend );

        }
      }
    }
    else if ( targetNode.t || targetNode.tag ) {

      /**
       * not a target node in this case
       * create and return a new in-memory node instead
       */

      return castNode( targetNode );

    }
    else {
      throw new Error( 'Can not set node' );
    }

  }

  function sN( targetNode, data ) {
    return setNode( targetNode, data );
  }

  function getNode( which ) {

    // TODO: maybe add getNodes with "querySelectorAll"

    const node = document.querySelector( which );
    if ( node ) {
      Object.assign( node, { getNode: getNode } );

      return node;
    }
  }

  function gN( which ) {
    return getNode( which );
  }

  function setAnimation( targetNode, css, options ) {

    /**
     * Dependency: velocity.js 1.5.2
     *
     * velocity 1.5.2 is in use
     *  - v2.x caused errors
     *  - does not animate scroll, therefore getNode( ... ).scrollLeft = 0 is being
     *    used in navigation-animations
     */

    let $targetNode = targetNode;

    if ( typeof targetNode == 'string' ) {
      $targetNode = getNode( targetNode );
    }

    const animationSpeed = 250;

    options == undefined ? options = {} : options;
    options.delay == undefined ? 0 : options.delay = options.delay * animationSpeed;
    options.duration == undefined ? 0 : options.duration = options.duration * animationSpeed;

    return Velocity( $targetNode, css, options );

  }

  function sA( targetNode, css, options ) {
    return setAnimation( targetNode, css, options );
  }

  function setStyle( whichId, data ) {
    if ( !document.getElementById( whichId ) ) {
      setNode( 'head', {
        t: 'style',
        i: whichId
      } );
    }
    const $customStyles = document.getElementById( whichId );

    if ( typeof data == 'string' ) {
      if ( !$customStyles.innerHTML.includes( data ) ) {
        // TODO: should not just skip, but update
        $customStyles.innerHTML += data;
      }
    }
    else if ( typeof data == 'object' ) {
      $customStyles.innerHTML += writeStyle( data, $customStyles );
    }

    function writeStyle( data, $customStyles ) {

      let string = '';

      for( const className in data ) {
        const formattedClassName = ( className => {
          // TODO: @media
          if ( className.includes( '@font-face' ) ) {
            return '@font-face' + '{';
          }
          else {
            return '.' + className + '{';
          }
        } )( className );

        if ( $customStyles.innerHTML.includes( formattedClassName ) ) {
          // TODO: should not just skip, but update
          continue;
        }
        else {
          string += formattedClassName;
          for( const prop in data[className] ) {
            string += prop + ':' + data[className][prop] + ';';
          }
          string += '}';
        }
      }
      return string;
    }

  }

  function setClick( whichNode, handler ) {
    getNode( whichNode ).addEventListener( 'click', handler );
  }

  function getCss( which ) {
    return Number( getComputedStyle( document.documentElement ).getPropertyValue( which ).replace( 'px', '' ).replace( 'rem', '' ) );
  }

  function castRemToPixel( remValue ) {
    return Number( remValue ) * parseFloat( getComputedStyle( document.documentElement ).fontSize );
  }

  return {
    castNode: castNode,
    cN: cN,
    setNode: setNode,
    sN: sN,
    getNode: getNode,
    gN: gN,
    setAnimation: setAnimation,
    sA: sA,
    setStyle: setStyle,
    setClick: setClick,
    getCss: getCss,
    castRemToPixel: castRemToPixel
  };

} )();
