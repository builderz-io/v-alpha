const Navigation = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Module driving the app's navigation
   *
   */

  'use strict';

  /* ================== private methods ================= */

  function checkCookies() {
    const navState = V.getCookie( 'service-nav-state' );
    const navItems = Object.values( V.getState( 'serviceNav' ) );
    if ( !navState || JSON.parse( navState ).length != navItems.length ) {
      V.setCookie( 'service-nav-state', navItems );
    }

    const entitiesState = V.getCookie( 'entity-nav-state' );
    const entitiesItems = Object.values( V.getState( 'entityNav' ) );
    if ( !entitiesState || JSON.parse( entitiesState ).length != entitiesItems.length ) {
      V.setCookie( 'entity-nav-state', entitiesItems );
    }
  }

  function presenter( which, options ) {
    if ( options.reset ) { return { reset: true } }

    const rowData = JSON.parse( V.getCookie( which + '-state' ) ); // Row-Cookie was set in checkCookies()

    let $rowUl;

    if ( which == 'entity-nav' ) {
      $rowUl = NavComponents.entityNavUl();
    }
    else if ( which == 'service-nav' ) {
      $rowUl = NavComponents.serviceNavUl();
    }

    const orderedRow = rowData.sort( function( a, b ) {
      return a.l - b.l;
    } );
    const weightedRow = orderedRow.slice( options.keep ).sort( function( a, b ) {
      return b.c - a.c;
    } );
    const combinedRow = orderedRow.slice( 0 ).splice( 0, options.keep ).concat( weightedRow );

    for ( let i = 0; i < combinedRow.length; i++ ) {
      const $pill = NavComponents.pill( combinedRow[i] );
      V.setNode( $rowUl, $pill );
    }

    // place a last pill into ul, using title length to set width
    // to gain scrollable space, set invisible via css
    let $placeholderPill;

    if ( which == 'entity-nav' ) {
      $placeholderPill = NavComponents.pill( { title: 'zzzzz' } );
    }
    else if ( which == 'service-nav' ) {
      $placeholderPill = NavComponents.pill( { title: '' } );
    }
    V.setNode( $rowUl, $placeholderPill );

    return { row: which, ul: $rowUl };
  }

  function view( rowData ) {
    if ( rowData.reset ) {
      reset();
      return;
    }

    rowData.ul.addEventListener( 'click', menuItemClickHandler );

    if ( rowData.row == 'entity-nav' ) {
      V.setNode( 'entity-nav', rowData.ul );
    }
    else if ( rowData.row == 'service-nav' ) {
      V.setNode( 'service-nav', rowData.ul );
    }

    function menuItemClickHandler( e ) {

      /**
      * Private function to arrange the menu after an item has been clicked
      * gets and sets the app' menu state
      *
      */

      e.stopPropagation(); // no need to bubble any further

      const $itemClicked = ( ( e ) => {
        //In case svg is used in the pill, return the correct li clicked
        const t = e.target;
        if ( t.localName == 'li' ) { return t }
        else if ( t.localName == 'svg' ) { return t.parentNode }
        else if ( t.localName == 'path' ) { return t.parentNode.parentNode }
      } )( e );

      if ( $itemClicked ) {

        // const menuStateObj = V.getState( 'menu' );
        // const row = $itemClicked.parentNode.parentNode.localName;
        // const itemClickedRect = $itemClicked.getBoundingClientRect();
        // const otherRow = row == 'service-nav' ? 'entity-nav' : 'service-nav';

        // select( $itemClicked );

        V.setState( 'active', { navItem: $itemClicked.innerHTML } );

        V.setBrowserHistory( {
          path: $itemClicked.getAttribute( 'path' )
        } );

        // animate( $itemClicked.id );

        // movingPillAnimation( row, $itemClicked, itemClickedRect, menuStateObj );
        // V.sA( otherRow, { height: 0, width: 0 }, { duration: 1 } );
        // V.setAnimation( row, {
        //   // scrollLeft: 0,
        //   width: itemClickedRect.width + 11,
        //   top: menuStateObj.entitiesTop,
        //   left: menuStateObj.entitiesLeft
        // }, { duration: 1 } );
        // V.getNode( row ).scrollLeft = 0;

        drawContentForItemClicked( $itemClicked );

        // TODO: using setTimeout is questionable, use resolved promise from pill animation
        // setTimeout( () => {return updateCookies( row )}, 1000 );

      } // end if $itemClicked

      function drawContentForItemClicked( $itemClicked ) {
        // const chatId = $itemClicked.getAttribute( 'cid' );
        const path = $itemClicked.getAttribute( 'path' );
        const slug = V.castSlugOrId( path );

        // if ( chatId > 2000 ) {
        //   Chat.draw( chatId );
        //   Button.draw( 'search' );
        // }
        // else if ( chatId == 1001 ) {
        //   // Page.draw( { active: true } );
        //   V.getNavItem( 'active', 'entityNav' ).draw();
        // }
        // else {
        //   // Page.draw( { active: true } );
        //   V.getNavItem( 'active', ['serviceNav', 'entityNav'] ).draw( slug );
        //   // Button.draw( V.getNavItem( 'active', 'serviceNav' ).use.button, { delay: 2 } );
        // }
        V.getNavItem( 'active', ['serviceNav', 'entityNav'] ).draw( slug );

      }

    } // end menuItemClickHandler
  } // end view

  function updateCookies( row ) {
    const $rowAfter = V.getNode( row + ' > ul' ).childNodes;
    const cookieMenu = JSON.parse( V.getCookie( row + '-state' ) );
    for ( let i = 0; i < $rowAfter.length; i++ ) {
      const $li = $rowAfter[i];
      for ( let j = 0; j < cookieMenu.length; j++ ) {
        if ( cookieMenu[j].title == $li.innerHTML ) {
          $li.classList.contains( 'pill--selected' ) ? cookieMenu[j].c += 1 : null;
          cookieMenu[j].l = i;
          break;
        }
      }
    }

    V.setCookie( row + '-state', cookieMenu );

    // debug
    // JSON.parse( V.getCookie( row + '-state' ) ).forEach( item => {
    //   console.log( item );
    // } );
  }

  function movingPillAnimation( row, $itemToAnimate, itemClickedRect, menuStateObj ) {
    // adjusted from LukePH https://stackoverflow.com/questions/907279/jquery-animate-moving-dom-element-to-new-parent
    deselect();
    select( $itemToAnimate );

    let classes = ' absolute font-medium';
    if ( $itemToAnimate.getAttribute( 'cid' ) > 1000 ) {
      classes += ' fs-rr';
    }

    const $tempMover = $itemToAnimate.cloneNode( true );
    $tempMover.className += classes;
    $tempMover.style.left = itemClickedRect.left + 'px';
    $tempMover.style.top = itemClickedRect.top + 'px';

    V.getNode( 'body' ).appendChild( $tempMover );

    $itemToAnimate.style.visibility = 'hidden';
    V.getNode( row + ' > ul' ).prepend( $itemToAnimate );

    V.setAnimation( $tempMover, {
      top: menuStateObj.entitiesTop + 4,
      left: menuStateObj.entitiesLeft + 3
    }, {
      duration: 2
    } ).then( () => {
      $itemToAnimate.style.visibility = 'visible';
      $tempMover.remove();

      /**
       * Update menu status in cookies
       *
       */

      updateCookies( row );

    } );

  }

  function select( $item ) {
    $item.className += ' pill--selected';
    $item.addEventListener( 'click', resetOnClick, { once: true } );

    // V.setState( 'active', { navItem: $itemClicked.innerHTML } );
  }

  function deselect() {
    const $itemSelected = document.getElementsByClassName( 'pill--selected' ); // $( 'header' ).find( '.pill--selected:first' );
    if ( $itemSelected.length ) {
      $itemSelected[0].removeEventListener( 'click', resetOnClick );
      $itemSelected[0].classList.remove( 'pill--selected' ); // .removeClass( 'pill--selected' );
    }
  }

  function resetOnClick( e ) {
    e.stopPropagation();
    reset();
    Page.draw( { position: 'closed', reset: false } );

  }

  function reset() {

    const menuStateObj = V.getState( 'menu' );
    const width = window.innerWidth;
    const defaultHeight = 48; // TODO: this is unclean: initially no height is set

    deselect( menuStateObj );

    V.setState( 'active', { navItem: false } );

    V.getNode( 'entity-nav' ).scrollLeft = 0;
    V.getNode( 'service-nav' ).scrollLeft = 0;

    V.setAnimation( 'entity-nav', {
      // scrollLeft: 0,
      height: defaultHeight,
      width: width
    }, { duration: 1 } );

    V.setAnimation( 'service-nav', {
      // scrollLeft: 0,
      height: defaultHeight,
      width: width,
      top: menuStateObj.navTop,
      left: menuStateObj.navLeft
    }, { duration: 2 } );

    // Feature.draw( { fade: 'out' } );
    // Haze.draw( { fade: 'out' } );
    Form.draw( 'all', { fade: 'out' } );
    Button.draw( 'all', { fade: 'out' } );
    // Chat.drawMessageForm( 'clear' );

  }

  /* ============ public methods and exports ============ */

  function animate( which ) {

    const $itemToAnimate = V.getNode( '#' + which );

    V.setState( 'active', { navItem: $itemToAnimate.innerHTML } );

    const menuStateObj = V.getState( 'menu' );
    const row = $itemToAnimate.parentNode.parentNode.localName;
    const itemClickedRect = $itemToAnimate.getBoundingClientRect();
    const otherRow = row == 'service-nav' ? 'entity-nav' : 'service-nav';

    movingPillAnimation( row, $itemToAnimate, itemClickedRect, menuStateObj );
    V.sA( otherRow, { height: 0, width: 0 }, { duration: 1 } );
    V.setAnimation( row, {
      // scrollLeft: 0,
      width: itemClickedRect.width + 13,
      top: menuStateObj.entitiesTop,
      left: menuStateObj.entitiesLeft
    }, { duration: 1 } );
    V.getNode( row ).scrollLeft = 0;

    Button.draw( V.getNavItem( 'active', ['serviceNav', 'entityNav'] ).use.button, { delay: 2 } );

  }

  function launch() {
    checkCookies();
  }

  function draw( which, options ) {
    view( presenter( which, options ) );
  }

  return {
    animate: animate,
    launch: launch,
    draw: draw
  };

} )();
