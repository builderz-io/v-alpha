const VDom = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module for DOM-manipulation
   *
   */

  'use strict';

  /* ================== private methods ================= */

  function placeNode( $targetNode, $node, prepend ) {
    prepend == 'prepend' || prepend == true ? $targetNode.prepend( $node ) : $targetNode.append( $node );
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

      if ( $customStyles.textContent.includes( formattedClassName ) ) {
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

  /* ================== public methods ================== */

  function castNode( data, options ) {

    /* castNode ALSO allows long keys in data object */

    /* Check whether to cast a node or not by condition-key */

    if (
      ( Object.prototype.hasOwnProperty.call( data, 'x' ) && !data.x )
      || ( Object.prototype.hasOwnProperty.call( data, 'condition' ) && !data.condition )
    ) {
      return;
    }

    /* Private methods */

    const setNode = ( $elem, options ) => {
      let $target;
      if ( options ) {
        if ( typeof options === 'string' ) {
          options = { target: options };
        }
        $target = document.querySelector( options.target );
        options.prepend == true
          ? $target.prepend( $elem )
          : $target.append( $elem );
      }
      else {
        console.log( 'function "castNode" missing second parameter (options)' );
        $target = document.querySelector( 'body' );
        $target.prepend( $elem );
      }
    };

    const setAttr = ( attr, data ) => {
      $elem.setAttribute( attr, String( data ) );
    };

    const setChild = ( item ) => {
      if ( item && !( item instanceof Element ) ) {
        svg ? item.svg = true : null;
        item = castNode( item );
      }
      if (
        item && item instanceof Element
      ) {
        $elem.appendChild( item );
      }
    };

    /* Either set node directly if data is a formatted node or a string ... */

    if ( data && data instanceof Element ) {
      setNode( data, options );
      return;
    }

    if ( data && typeof data === 'string' ) {
      setNode( document.createTextNode( data ), options );
      return;
    }

    /* ... or continue casting the node */

    /* Variables */

    let $elem, tag, svg;

    /* Create node type */

    if ( svg || data.svg ) {
      tag = data.t || data.tag || 'svg';
      svg = true;
      $elem = document.createElementNS( 'http://www.w3.org/2000/svg', tag );
    }
    else {
      tag = data.t || data.tag || 'div';
      $elem = document.createElement( tag );
    }

    if ( tag == 'svg' ) {
      setAttr( 'xmlns', 'http://www.w3.org/2000/svg' );
      setAttr( 'version', '1.1' );
    }

    /* Cast the node according to data */

    Object.keys( data ).forEach( key => {

      const val = data[key];

      if ( !val ) { return }

      if ( ['c', 'class', 'classes'].includes( key ) ) {
        setAttr( 'class', val );
      }
      else if ( ['h', 'html'].includes( key ) ) {
        if ( ['string', 'number'].includes( typeof val ) ) {
          $elem.appendChild( document.createTextNode( val ) );
        }
        else if ( Array.isArray( val ) ) {
          for ( let i = 0; i < val.length; i++ ) {
            setChild( val[i] );
          }
        }
        else {
          setChild( val );
        }
      }
      else if ( ['k', 'click'].includes( key ) ) {
        $elem.addEventListener( 'click', val );
      }
      else if ( ['e', 'event', 'events'].includes( key ) ) {
        for ( const evt in val ) {
          if ( val[evt] ) {
            $elem.addEventListener( evt, val[evt] );
          }
        }
      }
      else if ( ['y', 'style', 'styles'].includes( key ) ) {
        Object.assign( $elem.style, val );
      }
      else if ( ['s', 'setStyle', 'setStyles', 'setClass', 'setClasses'].includes( key ) ) {
        if ( typeof setStyle === 'function' ) {
          setStyle( val );
        }
        else {
          console.log( 'Can not set style: function missing' );
        }
      }
      else if ( ['a', 'attribute', 'attributes'].includes( key ) ) {
        for ( const attr in val ) {
          if ( val[attr] ) {
            setAttr( attr, val[attr] );
          }
        }
      }
      else if ( ['i', 'id'].includes( key ) ) {
        setAttr( 'id', val );
      }
      else if ( ['f', 'href'].includes( key ) ) {
        setAttr( 'href', val );
      }
      else if ( ['r', 'src'].includes( key ) ) {
        setAttr( 'src', val );
      }
      else if ( ['v', 'value'].includes( key ) ) {
        setAttr( 'value', val );
      }
      else if ( ['innerHtml'].includes( key ) ) {
        $elem.innerHTML = val;
      }

    } );

    /* Either set the node or return it */

    if ( options ) {
      setNode( $elem, options );
    }
    else {
      return $elem;
    }
  }

  function cN( data, options ) {

    /* cN allows ONLY short keys in data object (tiny performace improvement ) */

    /* Check whether to cast a node or not by condition-key */

    if (
      Object.prototype.hasOwnProperty.call( data, 'x' )
      && !data.x
    ) { return }

    /* Private methods */

    const setNode = ( $elem, options ) => {
      let $target;
      if ( options ) {
        if ( typeof options === 'string' ) {
          options = { target: options };
        }
        $target = document.querySelector( options.target );
        options.prepend == true
          ? $target.prepend( $elem )
          : $target.append( $elem );
      }
      else {
        console.log( 'function "cN" missing second parameter (options)' );
        $target = document.querySelector( 'body' );
        $target.prepend( $elem );
      }
    };

    const setAttr = ( attr, data ) => {
      $elem.setAttribute( attr, String( data ) );
    };

    const setChild = ( item ) => {
      if ( item && !( item instanceof Element ) ) {
        svg ? item.svg = true : null;
        item = cN( item );
      }
      if (
        item && item instanceof Element
      ) {
        $elem.appendChild( item );
      }
    };

    /* Either set node directly if data is a formatted node or a string ... */

    if ( data && data instanceof Element ) {
      setNode( data, options );
      return;
    }

    if ( data && typeof data === 'string' ) {
      setNode( document.createTextNode( data ), options );
      return;
    }

    /* ... or continue casting the node */

    /* Variables */

    let $elem, tag, svg;

    /* Create node type */

    if ( svg || data.svg ) {
      tag = data.t || 'svg';
      svg = true;
      $elem = document.createElementNS( 'http://www.w3.org/2000/svg', tag );
    }
    else {
      tag = data.t || 'div';
      $elem = document.createElement( tag );
    }

    if ( tag == 'svg' ) {
      setAttr( 'xmlns', 'http://www.w3.org/2000/svg' );
      setAttr( 'version', '1.1' );
    }

    /* Cast the node according to data */

    Object.keys( data ).forEach( key => {

      const val = data[key];

      if ( !val ) { return }

      switch ( key ) {

      case 'c':
        setAttr( 'class', val );
        break;

      case 'h':
        if ( ['string', 'number'].includes( typeof val ) ) {
          $elem.appendChild( document.createTextNode( val ) );
        }
        else if ( Array.isArray( val ) ) {
          for ( let i = 0; i < val.length; i++ ) {
            setChild( val[i] );
          }
        }
        else {
          setChild( val );
        }
        break;

      case 'k':
        $elem.addEventListener( 'click', val );
        break;

      case 'e':
        for ( const evt in val ) {
          if ( val[evt] ) {
            $elem.addEventListener( evt, val[evt] );
          }
        }
        break;

      case 'y':
        Object.assign( $elem.style, val );
        break;

      case 's':
        if ( typeof setStyle === 'function' ) {
          setStyle( val );
        }
        else {
          console.log( 'Can not set style: function missing' );
        }
        break;

      case 'a':
        for ( const attr in val ) {
          if ( val[attr] ) {
            setAttr( attr, val[attr] );
          }
        }
        break;

      case 'i':
        setAttr( 'id', val );
        break;

      case 'f':
        setAttr( 'href', val );
        break;

      case 'r':
        setAttr( 'src', val );
        break;

      case 'v':
        setAttr( 'value', val );
        break;

      case 'innerHtml':
        $elem.innerHTML = val;
        break;
      }

    } );

    /* Either set the node or return it */

    if ( options ) {
      setNode( $elem, options );
    }
    else {
      return $elem;
    }

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
     * clear node or clear inner content of node
     */

    if ( data && ( data == 'clear' || data.clear == true ) ) {
      const $elem = typeof targetNode != 'string' ? targetNode : document.querySelector( targetNode );
      $elem ? $elem.parentNode.removeChild( $elem ) : null;
      return;
    }

    /**
     * set a simple string
     */

    if ( ['string', 'number'].includes( typeof data ) ) {
      const $elem = typeof targetNode != 'string' ? targetNode : document.querySelector( targetNode );
      $elem ? $elem.textContent = String( data ) : null;
      return;
    }

    /**
     * determine actions based on targetNode and data params
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
        data.forEach( item => {
          if ( item instanceof Element ) {

            /**
            * place given node into target node
            */

            placeNode( $targetNode, item, prepend );
          }
          else {

            /**
            * 1. create new node
            * 2. place this new node into target node
            */

            placeNode( $targetNode, castNode( item ), prepend );

          }

          // placeNode( $targetNode, item, prepend );

        } );
      }
      else if ( typeof data == 'object' ) {
        if ( data instanceof Element ) {

          /**
          * place given node into target node
          */

          placeNode( $targetNode, data, prepend );
        }
        else {

          /**
          * 1. create new node
          * 2. place this new node into target node
          */

          placeNode( $targetNode, castNode( data ), prepend );

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
    const node = document.querySelector( which );
    if ( node ) {
      Object.assign( node, { getNode: getNode } );
      return node;
    }
  }

  function gN( which ) {
    return getNode( which );
  }

  function getNodes( which ) {
    const nodes = document.querySelectorAll( which );
    if ( nodes ) {
      return nodes;
    }
  }

  function gNs( which ) {
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

    if ( typeof whichId == 'object' ) {
      data = whichId;
      whichId = 'component-styles';
    }
    if ( !document.getElementById( whichId ) ) {
      setNode( 'head', {
        t: 'style',
        i: whichId,
      } );
    }
    const $customStyles = document.getElementById( whichId );

    if ( typeof data == 'string' ) {
      if ( !$customStyles.textContent.includes( data ) ) {
        // TODO: should not just skip, but update
        $customStyles.textContent += data;
      }
    }
    else if ( typeof data == 'object' ) {
      $customStyles.textContent += writeStyle( data, $customStyles );
    }
  }

  function getCss( which ) {
    const cssVar = getComputedStyle( document.documentElement ).getPropertyValue( which ).replace( 'px', '' ).replace( 'rem', '' );
    if ( isNaN( cssVar ) ) {
      return cssVar.trim();
    }
    else {
      return Number( cssVar );
    }
  }

  function getVisibility( which ) {
    // ;) from https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
    const $elem = typeof which == 'string' ? getNode( which ) : which;
    if ( $elem ) {
      return !!( $elem.offsetWidth || $elem.offsetHeight || $elem.getClientRects().length );
    }
    else {
      return undefined;
    }
  }

  function castRemToPixel( remValue ) {
    return Number( remValue ) * parseFloat( getComputedStyle( document.documentElement ).fontSize );
  }

  function setScript( src, id ) {
    // console.log( src );
    return new Promise( function( resolve, reject ) {
      const s = document.createElement( 'script' );
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      id ? s.id = id : null;
      document.head.appendChild( s );
    } );
  }

  function setStylesheet( src ) {
    return new Promise( function( resolve, reject ) {
      const l = document.createElement( 'link' );
      l.type = 'text/css';
      l.rel = 'stylesheet';
      l.href = src;
      l.onload = resolve;
      l.onerror = reject;
      document.head.appendChild( l );
    } );
  }

  function setToggle( which ) {
    const $elem = typeof which == 'string' ? getNode( which ) : which;

    if ( getVisibility( $elem ) ) {
      $elem.style.display = 'none';
    }
    else {
      $elem.style.display = 'block';
    }
  }

  /* ====================== export ====================== */

  V.castNode = castNode;
  V.cN = cN;
  V.setNode = setNode;
  V.sN = sN;
  V.getNode = getNode;
  V.gN = gN;
  V.getNodes = getNodes;
  V.gNs = gNs;
  V.setAnimation = setAnimation;
  V.sA = sA;
  V.setStyle = setStyle;
  V.getCss = getCss;
  V.getVisibility = getVisibility;
  V.castRemToPixel = castRemToPixel;
  V.setScript = setScript;
  V.setStylesheet = setStylesheet;
  V.setToggle = setToggle;

  return {
    castNode: castNode,
    cN: cN,
    setNode: setNode,
    sN: sN,
    getNode: getNode,
    gN: gN,
    getNodes: getNodes,
    gNs: gNs,
    setAnimation: setAnimation,
    sA: sA,
    setStyle: setStyle,
    getCss: getCss,
    getVisibility: getVisibility,
    castRemToPixel: castRemToPixel,
    setScript: setScript,
    setStylesheet: setStylesheet,
    setToggle: setToggle,
  };

} )();
