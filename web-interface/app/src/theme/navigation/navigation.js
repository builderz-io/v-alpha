const Navigation = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Module driving the app's navigation
   *
   */

  'use strict';

  /* ================== private methods ================= */

  // start test new nav code

  function presenterV2( newEntity ) {

    /**
     * Update serviceNavOrder from plugins (always)
     * Plugins have already registered their service nav items at this stage
     *
     */

    const serviceNavOrder = V.castJson( V.getCookie( 'service-nav-order' ) || '{}' );
    const serviceNav = V.getState( 'serviceNav' );
    //
    // console.log( V.getState() );
    // console.log( serviceNav );
    // console.log( V.castJson( serviceNavOrder, 'clone' ) );

    syncNavOrder( serviceNavOrder, serviceNav );

    V.setCookie( 'service-nav-order', serviceNavOrder );

    // console.log( V.castJson( V.getCookie( 'service-nav-order' ) ) );

    /**
     * Update entityNavOrder from plugins
     * Plugins have already registered their entity nav items at this stage
     *
     * AND
     *
     * Update entityNav in app state from entityNavOrder, as well as
     * newly viewed profile (newEntity parameter)
     *
     */

    const entityNavOrder = V.castJson( V.getCookie( 'entity-nav-order' ) || '{}' );
    const entityNav = V.getState( 'entityNav' );

    for ( const item in entityNavOrder ) {
      if ( !entityNav[item] ) {
        V.setNavItem( 'entityNav', {
          title: entityNavOrder[item].title,
          path: entityNavOrder[item].path,
          draw: function( path ) { Profile.draw( path ) }
        } );
      }
    }

    if ( newEntity && newEntity.fullId && !entityNav[newEntity.path] ) {
      V.setNavItem( 'entityNav', {
        title: V.castInitials( newEntity.profile.title ),
        path: newEntity.path,
        draw: function( path ) { Profile.draw( path ) }
      } );
    }

    // console.log( entityNav );
    // console.log( V.castJson( entityNavOrder, 'clone' ) );

    syncNavOrder( entityNavOrder, entityNav );

    V.setCookie( 'entity-nav-order', entityNavOrder );

    // console.log( V.castJson( V.getCookie( 'entity-nav-order' ) ) );

    return {
      success: true,
      status: 'navigation updated',
      data: [{
        which: typeof newEntity == 'object' ? newEntity.profile.path : newEntity,
        entityNav: entityNavOrder,
        serviceNav: serviceNavOrder,
        keep: 5
      }]
    };
  }

  function viewV2( viewData ) {

    /**
     * draw serviceNav
     *
     */

    const $serviceNavUl = NavComponents.serviceNavUl();
    $serviceNavUl.addEventListener( 'click', navItemClickHandler );

    const serviceRow = castNavDrawingOrder( viewData.data[0].serviceNav, 3 );

    for ( let i = 0; i < serviceRow.length; i++ ) {
      const $pill = NavComponents.pill( serviceRow[i] );
      V.setNode( $serviceNavUl, $pill );
    }

    V.setNode( $serviceNavUl, NavComponents.pill( { title: '' } ) ); // a last placeholder pill

    V.setNode( 'service-nav', '' );
    V.setNode( 'service-nav', $serviceNavUl );

    /**
     * draw entityNav
     *
     */

    const $entityNavUl = NavComponents.entityNavUl();
    $entityNavUl.addEventListener( 'click', navItemClickHandler );

    const entityRow = castNavDrawingOrder( viewData.data[0].entityNav, 3 );

    for ( let i = 0; i < entityRow.length; i++ ) {
      const $pill = NavComponents.pill( entityRow[i] );
      V.setNode( $entityNavUl, $pill );
    }

    V.setNode( $entityNavUl, NavComponents.pill( { title: 'zzzzz' } ) ); // a last placeholder pill

    V.setNode( 'entity-nav', '' );
    V.setNode( 'entity-nav', $entityNavUl );

    /**
     * animate, if path was provided
     *
     */

    if ( viewData.data[0].which ) {
      animate( viewData.data[0].which );
    }

  }

  function castNavDrawingOrder( rowObj, keep ) {
    const row = Object.values( rowObj );
    const orderedRow = row.sort( function( a, b ) { return a.l - b.l } );
    const weightedRow = orderedRow.slice( keep ).sort( function( a, b ) { return b.c - a.c } );
    return orderedRow.slice( 0 ).splice( 0, keep ).concat( weightedRow );
  }

  function syncNavOrder( a, b ) {
    // remove old entries
    for ( const oldKey in a ) {
      if( !b.hasOwnProperty( oldKey ) ) {
        delete a[oldKey];
      }
    }
    // add new entries
    for ( const newKey in b ) {
      if( !a.hasOwnProperty( newKey ) ) {
        a[b[newKey].path] = {
          // c: 0,
          // l: -1,
          title: b[newKey].title,
          path: b[newKey].path
        };
      }
    }
  }

  // end test new nav code

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

    const orderedRow = rowData.sort( function( a, b ) { return a.l - b.l } );
    const weightedRow = orderedRow.slice( options.keep ).sort( function( a, b ) { return b.c - a.c } );
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

    rowData.ul.addEventListener( 'click', navItemClickHandler );

    // if ( rowData.row == 'entity-nav' ) {
    //   V.setNode( 'entity-nav', rowData.ul );
    // }
    // else if ( rowData.row == 'service-nav' ) {
    //   V.setNode( 'service-nav', rowData.ul );
    // }
  }

  function navItemClickHandler( e ) {

    e.stopPropagation(); // no need to bubble any further

    const $itemClicked = ( ( e ) => {
      //In case svg is used in the pill, return the correct li clicked
      const t = e.target;
      if ( t.localName == 'li' ) { return t }
      else if ( t.localName == 'svg' ) { return t.parentNode }
      else if ( t.localName == 'path' ) { return t.parentNode.parentNode }
    } )( e );

    if ( $itemClicked ) {

      // const menuStateObj = V.getState( 'header' );
      // const row = $itemClicked.parentNode.parentNode.localName;
      // const itemClickedRect = $itemClicked.getBoundingClientRect();
      // const otherRow = row == 'service-nav' ? 'entity-nav' : 'service-nav';

      // select( $itemClicked );

      const path = $itemClicked.getAttribute( 'path' );

      V.setState( 'active', { navItem: path } );

      V.setBrowserHistory( { path: path } );

      // const slug = V.castSlugOrId( path );
      console.log( V.getState() );
      V.getNavItem( 'active', ['serviceNav', 'entityNav'] ).draw( path );

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

      // drawContentForItemClicked( $itemClicked );

      // TODO: using setTimeout is questionable, use resolved promise from pill animation
      // setTimeout( () => {return setCountAndLastIndex( row )}, 1000 );

    } // end if $itemClicked

  }

  // function drawContentForItemClicked( $itemClicked ) {
  //   // const chatId = $itemClicked.getAttribute( 'cid' );
  //   const path = $itemClicked.getAttribute( 'path' );
  //   const slug = V.castSlugOrId( path );
  //
  //   // if ( chatId > 2000 ) {
  //   //   Chat.draw( chatId );
  //   //   Button.draw( 'search' );
  //   // }
  //   // else if ( chatId == 1001 ) {
  //   //   // Page.draw( { active: true } );
  //   //   V.getNavItem( 'active', 'entityNav' ).draw();
  //   // }
  //   // else {
  //   //   // Page.draw( { active: true } );
  //   //   V.getNavItem( 'active', ['serviceNav', 'entityNav'] ).draw( path );
  //   //   // Button.draw( V.getNavItem( 'active', 'serviceNav' ).use.button, { delay: 2 } );
  //   // }
  //   V.getNavItem( 'active', ['serviceNav', 'entityNav'] ).draw( path );
  //
  // }

  function setCountAndLastIndex( row ) {
    const $rowAfter = V.getNode( row + ' > ul' ).childNodes;
    const navOrder = V.castJson( V.getCookie( row + '-order' ) );

    for ( let i = 0; i < $rowAfter.length - 1; i++ ) { // -1 to ignore placeholder pill
      const $li = $rowAfter[i];
      const path = $li.getAttribute( 'path' );

      $li.classList.contains( 'pill--selected' ) ?
        navOrder[ path ].c ? navOrder[ path ].c += 1 : navOrder[ path ].c = 1 : null;

      navOrder[ path ].l = i;
      // for ( let j = 0; j < navOrder.length; j++ ) {
      //   if ( navOrder[j].path == $li.getAttribute( 'path' ) ) {
      //     $li.classList.contains( 'pill--selected' ) ? navOrder[j].c += 1 : null;
      //     navOrder[j].l = i;
      //     break;
      //   }
      // }
    }

    V.setCookie( row + '-order', navOrder );

    // debug
    const debug = V.castJson( V.getCookie( row + '-order' ) );
    for( const item in debug ) {
      console.log( /*'key', item, 'value', */ debug[item] );
    }
  }

  function movingPillAnimation( row, $itemToAnimate, itemClickedRect, menuStateObj ) {
    // adjusted from LukePH https://stackoverflow.com/questions/907279/jquery-animate-moving-dom-element-to-new-parent
    deselect();
    select( $itemToAnimate );

    let classes = ' absolute font-medium';
    if ( row == 'entity-nav' ) {
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
       * Update nav status in cookies
       *
       */

      setCountAndLastIndex( row );

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
      for ( let i = 0; i < $itemSelected.length; i++ ) {
        $itemSelected[i].removeEventListener( 'click', resetOnClick );
        $itemSelected[i].classList.remove( 'pill--selected' ); // .removeClass( 'pill--selected' );
      }
    }
  }

  function resetOnClick( e ) {
    e.stopPropagation();
    reset();
    Page.draw( { position: 'closed', reset: false } );

  }

  function reset() {

    const menuStateObj = V.getState( 'header' );
    const width = window.innerWidth;
    const defaultHeight = 48; // TODO: this is unclean: initially no height is set

    deselect();

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

    const $itemToAnimate = V.getNode( '[path="' + which + '"]' /* '#' + which */ );

    V.setState( 'active', { navItem: $itemToAnimate.getAttribute( 'path' ) } );

    const menuStateObj = V.getState( 'header' );
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

    // Button.draw( V.getNavItem( 'active', ['serviceNav', 'entityNav'] ).use.button, { delay: 2 } );

  }

  function launch() {
    checkCookies();
  }

  function draw( which, options ) {
    view( presenter( which, options ) );
  }

  function drawV2( entity, options ) {
    viewV2( presenterV2( entity, options ) );
  }

  return {
    animate: animate,
    launch: launch,
    draw: draw,
    drawV2: drawV2
  };

} )();
