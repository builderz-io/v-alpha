const Navigation = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Module controlling the app's navigation
   *
   */

  'use strict';

  /* ================== private methods ================= */

  function presenter(
    data,
    whichPath = typeof data == 'object' ? data.path : data,
  ) {

    /**
     * Always update entityNavOrder
     * Plugins have already registered their entity nav items at this stage
     *
     * AND
     *
     * Update entityNav in app state from entityNavOrder, as well as
     * newly viewed profile (data parameter)
     *
     */

    const entityNavOrder = V.castJson( V.getLocal( 'entity-nav-order' ) || '{}' );
    V.getState( 'entityNav' ) ? null : V.setState( 'entityNav', {} ); // ensure entityNav-state exists
    const entityNav = V.getState( 'entityNav' );

    if ( data && data.tinyImage && entityNavOrder[data.path] ) { // update the clicked entity tinyImage if available
      entityNavOrder[data.path].tinyImage = JSON.stringify( data.tinyImage );
    }
    else if ( data && data.images && data.images.tinyImage && entityNavOrder[data.path] ) { // new model
      entityNavOrder[data.path].tinyImage = data.images.tinyImage;
      entityNavOrder[data.path].useDataUrl = true; // flag to create image from dataUrl in component
    }

    for ( const item in entityNavOrder ) {

      if ( !entityNav[item] ) {
        const obj = {
          uuidE: entityNavOrder[item].uuidE,
          uuidP: entityNavOrder[item].uuidP,
          title: entityNavOrder[item].title,
          tag: entityNavOrder[item].tag,
          initials: entityNavOrder[item].initials,
          path: entityNavOrder[item].path,
          draw: function( path ) { Profile.draw( path ) },
        };
        entityNavOrder[item].tinyImage ? obj.tinyImage = entityNavOrder[item].tinyImage : null;
        V.setNavItem( 'entityNav', obj );
      }
    }

    // add new
    if ( data && data.fullId && !entityNav[data.path] ) {
      const obj = {
        uuidE: data.uuidE,
        uuidP: data.uuidP,
        title: data.title,
        tag: data.tag,
        initials: V.castInitials( data.title ),
        path: data.path,
        draw: function( path ) { Profile.draw( path ) },
      };
      if ( data.tinyImage ) { // old model
        obj.tinyImage = JSON.stringify( data.tinyImage );
      }
      else if ( data.images && data.images.tinyImage ) { // new model
        obj.tinyImage = data.images.tinyImage;
        obj.useDataUrl = true;
      }
      V.setNavItem( 'entityNav', obj );
    }

    syncNavOrder( entityNavOrder, entityNav );

    V.setLocal( 'entity-nav-order', entityNavOrder );

    /**
     * Check whether we have to also update the other navs
     *
     */

    const doesNodeExist = V.getNode( '[path="' + whichPath + '"]' );

    if (
      doesNodeExist
      && doesNodeExist.closest( 'header' )
      && !data.fullId
    ) {
      return {
        success: false,
        status: 'navigation does not need updating',
        data: [{
          which: whichPath,
        }],
      };
    }

    /**
     * Update serviceNavOrder (always)
     * Plugins have already registered their service nav items at this stage
     *
     */

    const serviceNavOrder = V.castJson( V.getLocal( 'service-nav-order' ) || '{}' );
    const serviceNav = V.getState( 'serviceNav' );

    syncNavOrder( serviceNavOrder, serviceNav );

    V.setLocal( 'service-nav-order', serviceNavOrder );

    /**
     * Update userNavOrder (always)
     * User Plugin has already registered its nav items at this stage
     *
     */

    const userNavOrder = V.castJson( V.getLocal( 'user-nav-order' ) || '{}' );
    const userNav = V.getState( 'userNav' );

    syncNavOrder( userNavOrder, userNav );

    V.setLocal( 'user-nav-order', userNavOrder );

    return {
      success: true,
      status: 'navigation updated',
      data: [{
        which: whichPath,
        entityNav: entityNavOrder,
        userNav: userNavOrder,
        serviceNav: serviceNavOrder,
        keep: 5,
      }],
    };
  }

  function view( viewData ) {

    if ( viewData.success ) {

      // !viewData.data[0].which ? reset() : null;

      /**
       * draw serviceNav
       *
       */

      const $serviceNavUl = NavComponents.serviceNavUl();
      $serviceNavUl.addEventListener( 'click', itemClickHandler );

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
      $entityNavUl.addEventListener( 'click', itemClickHandler );

      const entityRow = castNavDrawingOrder( viewData.data[0].entityNav, 3 );

      for ( let i = 0; i < entityRow.length; i++ ) {
        const $pill = NavComponents.entityPill( entityRow[i] );
        V.setNode( $entityNavUl, $pill );
      }

      /* a last placeholder pill. The amount of "z" determine its width */
      V.setNode( $entityNavUl, NavComponents.pill( { title: 'zzzzzzzzzzzzzzzzz' } ) );

      V.setNode( 'entity-nav', '' );
      V.setNode( 'entity-nav', $entityNavUl );

      /**
       * draw userNav
       *
       */

      const $userNavUl = NavComponents.userNavUl();
      $userNavUl.addEventListener( 'click', itemClickHandler );

      const userRow = castNavDrawingOrder( viewData.data[0].userNav, 1 );

      for ( let i = 0; i < userRow.length; i++ ) {
        const $pill = NavComponents.pill( userRow[i] );
        V.setNode( $userNavUl, $pill );
      }

      V.setNode( $userNavUl, NavComponents.pill( { title: 'zzzzz' } ) ); // a last placeholder pill

      V.setNode( 'user-nav', '' );
      V.setNode( 'user-nav', $userNavUl );

    }

    /* animate, if path was provided */

    const which = viewData.data[0].which;

    if ( which ) {

      /**
       * timeout ensures that popup is removed from DOM,
       * to avoid conflicting node being found in $itemToAnimate in animate
       */
      setTimeout( () => ( animate( which ) ), 8 );
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
        // a[b[newKey].path] = {
        //   uuidE: b[newKey].uuidE,
        //   uuidP: b[newKey].uuidP,
        //   title: b[newKey].title,
        //   tag: b[newKey].tag,
        //   initials: b[newKey].initials,
        //   path: b[newKey].path,
        // };
        a[b[newKey].path] = b[newKey];

        b[newKey].tinyImage ? a[b[newKey].path].tinyImage = b[newKey].tinyImage : null;
        b[newKey].useDataUrl ? a[b[newKey].path].useDataUrl = b[newKey].useDataUrl : null;

      }
    }
  }

  function itemClickHandler( e ) {

    e.stopPropagation(); // no need to bubble any further
    const $itemClicked = e.target.closest( 'li' );

    if ( $itemClicked ) {
      const path = $itemClicked.getAttribute( 'path' );
      const uuidE = $itemClicked.getAttribute( 'uuide' );
      const uuidP = $itemClicked.getAttribute( 'uuidp' );
      V.setState( 'active', { navItem: path } );
      V.setBrowserHistory( path );
      if ( uuidE ) { // entity pill
        V.getNavItem( 'active', ['entityNav'] ).draw( { uuidE: uuidE, uuidP: uuidP, path: path } );
      }
      else {
        V.getNavItem( 'active', ['serviceNav', 'userNav'] ).draw( path );
      }
    }

  }

  function setCountAndLastIndex( row ) {
    const $rowAfter = V.getNode( row + ' > ul' ).childNodes;
    const navOrder = V.castJson( V.getLocal( row + '-order' ) );

    for ( let i = 0; i < $rowAfter.length - 1; i++ ) { // -1 to ignore placeholder pill
      const $li = $rowAfter[i];
      const path = $li.getAttribute( 'path' );

      $li.classList.contains( 'pill--selected' )
        ? navOrder[ path ].c
          ? navOrder[ path ].c += 1
          : navOrder[ path ].c = 1
        : null;

      navOrder[ path ].l = i;

    }

    V.setLocal( row + '-order', navOrder );

    // debug
    // const debug = V.castJson( V.getLocal( row + '-order' ) );
    // for( const item in debug ) {
    //   console.log( /*'key', item, 'value', */ debug[item] );
    // }
  }

  function movingPillAnimation( nav, $itemToAnimate, itemClickedRect, menuStateObj ) {
    // adjusted from LukePH https://stackoverflow.com/questions/907279/jquery-animate-moving-dom-element-to-new-parent

    let classes = ' absolute font-medium';
    if ( nav == 'entity-nav' ) {
      classes += ' fs-rr';
    }

    const $tempMover = $itemToAnimate.cloneNode( true );
    $tempMover.className += classes;
    $tempMover.style.left = itemClickedRect.left + 'px';
    $tempMover.style.top = itemClickedRect.top + 'px';

    V.getNode( 'body' ).appendChild( $tempMover );

    $itemToAnimate.style.visibility = 'hidden';
    V.getNode( nav + ' > ul' ).prepend( $itemToAnimate );

    V.setAnimation( $tempMover, {
      top: menuStateObj.entityNavTop + 4,
      left: menuStateObj.entityNavLeft + 3,
    }, {
      duration: 2,
    } ).then( () => {
      $itemToAnimate.style.visibility = 'visible';
      $tempMover.remove();

    } );

  }

  function select( $item ) {
    const span = $item.getElementsByClassName( 'pill__initials' )[0];
    if ( span ) {
      span.textContent = $item.getAttribute( 'fullId' );
      span.previousSibling.style.display = 'none';
      span.classList.add( 'pill__replace' );
      span.classList.remove( 'pill__initials' );
    }
    $item.className += ' pill--selected';
    $item.addEventListener( 'click', resetOnClick /*, { once: true } */ );
  }

  function deselect() {
    const $itemSelected = document.getElementsByClassName( 'pill--selected' );
    if ( $itemSelected.length ) {
      for ( let i = 0; i < $itemSelected.length; i++ ) {
        const span = $itemSelected[i].getElementsByClassName( 'pill__replace' )[0];
        if ( span ) {
          span.textContent = $itemSelected[i].getAttribute( 'initials' );
          span.previousSibling.style.display = 'flex';
          span.classList.add( 'pill__initials' );
          span.classList.remove( 'pill__replace' );
        }
        $itemSelected[i].removeEventListener( 'click', resetOnClick );
        $itemSelected[i].classList.remove( 'pill--selected' );
      }
    }
  }

  function resetOnClick( e ) {
    e.stopPropagation();

    /* if a form is open, just close form first */
    if ( V.getNode( 'form' ) ) {
      handleCloseForms();
    }

    /* else if an entity is being edited, just return to entity list first */
    else if (
      V.getState( 'active' ).path == '/me/edit'
      && V.getVisibility( '#pref-lang-edit' )
    ) {
      EntityList.draw( '/me/edit' );

    }

    // /* else if an entity was viewed, draw the Marketplace */
    // else if (
    //   V.getState( 'active' ).path.includes( 'profile' )
    // ) {
    //   Canvas.draw();
    // }

    /* else reset navigation, page and popup */
    else {
      reset();
      Page.draw( { position: 'closed', reset: false, navReset: false } );
    }

  }

  function handleCloseForms() {
    Form.draw( 'all', { fade: 'out' } );
    Button.draw( 'all', { fade: 'out' } );
    Button.draw( V.getNavItem( 'active', 'serviceNav' ).use.button, { delay: 1.5 } );
    Page.draw( { position: 'peek', reset: false } );
  }

  function reset() {
    const menuStateObj = V.getState( 'header' );
    const width = window.innerWidth;

    deselect();

    /* shorten entityNav */

    const entityNavOrder = V.castJson( V.getLocal( 'entity-nav-order' ) || '{}' );

    const entitiesViewed = Object.keys( entityNavOrder );

    if ( entitiesViewed.length >= 50 ) {
      entitiesViewed.forEach( entityPath => {
        if ( entityNavOrder[entityPath].l > 40 ) {
          delete entityNavOrder[entityPath];
        }
      } );
      V.setLocal( 'entity-nav-order', entityNavOrder );
    }

    // Chat.drawMessageForm( 'clear' ); // a good place to reset the chat input

    // (previous version) also reset path if not account or profile path
    // if ( !['/me/account', '/me/profile'].includes( V.getState( 'active' ).path ) ) {
    V.setBrowserHistory( '/' );
    // }

    if ( V.getVisibility( 'user-nav' ) ) {
      // (alt version) return to full usernav first
      // if ( V.getState( 'active' ).navItem ) {
      //   V.setAnimation( 'user-nav', { width: width } );
      //   V.setState( 'active', { navItem: false } );
      //   return;
      // }
      // else {

      V.setAnimation( 'user-nav', 'fadeOut', { duration: 0.1 } ).then( () => {
        V.setAnimation( 'user-nav', { width: width } );
      } );
      V.setAnimation( 'entity-nav', 'fadeIn', { duration: 0.2 } );
      V.setAnimation( 'service-nav', 'fadeIn', { duration: 0.6 } );
      // }
    }

    V.setState( 'active', { navItem: false } );

    V.getNode( 'entity-nav' ).scrollLeft = 0;
    V.getNode( 'service-nav' ).scrollLeft = 0;

    V.setAnimation( 'entity-nav', {
      width: width,
    }, { duration: 1.5 } );

    V.setAnimation( 'service-nav', {
      width: width,
      top: menuStateObj.serviceNavTop,
      left: menuStateObj.serviceNavLeft,
    }, { duration: 2.5 } );

    Form.draw( 'all', { fade: 'out' } );
    Button.draw( 'all', { fade: 'out' } );

    /* return to the full market view and reset the map (zoom) */
    Marketplace.draw();
    // VMap.draw( { reset: true } );

    drawJoinedUserPill();

  }

  function animate( which ) {

    const $itemToAnimate = V.getNode( '[path="' + which + '"]' );

    V.setState( 'active', { navItem: $itemToAnimate.getAttribute( 'path' ) } );

    const $navToAnimate = $itemToAnimate.closest( '.nav' );
    const nav = $navToAnimate.localName;

    if ( nav != 'user-nav' && !V.getVisibility( 'entity-nav' ) ) {
      $navToAnimate.style.display = 'block';
      V.setAnimation( 'user-nav', 'fadeOut', { duration: 0.1 } );
      V.setAnimation( 'entity-nav', 'fadeIn', { duration: 0.2 } );
      V.setAnimation( 'service-nav', 'fadeIn', { duration: 0.6 } );
    }

    if ( nav == 'user-nav' && !V.getVisibility( 'user-nav' ) ) {
      $navToAnimate.style.display = 'block';
      V.setAnimation( 'entity-nav', 'fadeOut', { duration: 0.1 } );
      V.setAnimation( 'service-nav', 'fadeOut', { duration: 0.6 } );
      V.setAnimation( 'user-nav', 'fadeIn', { duration: 0.2 } );
    }

    const menuStateObj = V.getState( 'header' );

    deselect();
    select( $itemToAnimate );

    const itemClickedRect = $itemToAnimate.getBoundingClientRect();

    movingPillAnimation( nav, $itemToAnimate, itemClickedRect, menuStateObj );

    setCountAndLastIndex( nav ); // updates nav status in cookies after movingPillAnimation

    const otherRow = nav == 'service-nav' ? 'entity-nav' : 'service-nav';

    V.sA( otherRow, { width: 0 }, { duration: 1 } );
    // V.sA( otherRow, 'fadeOut', { duration: 0.5 } ); // alternative animation
    // V.sA( otherRow, { opacity: 0 }, { duration: 0.5, visibility: 'hidden' } ); // alternative animation

    V.setAnimation( nav, {
      width: itemClickedRect.width + 11 /* + V.getState( 'page' ).rectOffset */,
      top: menuStateObj.entityNavTop,
      left: menuStateObj.entityNavLeft,
    }, { duration: 1 } );

    // V.setState( 'page', { rectOffset: 0 } ); // resets the offset to 0 after first page load

    V.getNode( nav ).scrollLeft = 0;

  }

  /* ============ public methods and exports ============ */

  function draw( data ) {
    return Promise.resolve( view( presenter( data ) ) );
  }

  function drawReset() {
    reset();
  }

  function drawUserNav() {
    if ( V.getVisibility( 'user-nav' ) ) {
      V.setState( 'active', { navItem: false } );
      // Chat.drawMessageForm( 'clear' );

      reset();

    }
    else {
      Button.draw( 'all', { fade: 'out' } );
      V.setAnimation( 'entity-nav', 'fadeOut', { duration: 0.1 } );
      V.setAnimation( 'service-nav', 'fadeOut', { duration: 0.6 } );
      V.setAnimation( 'user-nav', 'fadeIn', { duration: 0.2 } );
    }
  }

  function drawEntityNavPill( data ) {

    /**
     * In case Navigation.draw() is not called, this function
     * can draw an entity item (e.g. on entity initialisation)
     *
     */

    /** Create nav object */
    const obj = {
      uuidE: data.uuidE,
      uuidP: data.uuidP,
      title: data.title,
      tag: data.tag,
      initials: V.castInitials( data.title ),
      path: data.path,
      draw: function( path ) { Profile.draw( path ) },
    };
    data.tinyImage ? obj.tinyImage = JSON.stringify( data.tinyImage ) : null;

    /** Set object into state */
    V.setNavItem( 'entityNav', obj );

    /** Update cookies */
    const entityNavOrder = V.castJson( V.getLocal( 'entity-nav-order' ) || '{}' );
    const entityNav = V.getState( 'entityNav' );
    syncNavOrder( entityNavOrder, entityNav );
    V.setLocal( 'entity-nav-order', entityNavOrder );

    /** Place into view */
    const $pill = NavComponents.entityPill( obj );
    V.getNode( 'entity-nav > ul' ).prepend( $pill );
  }

  function drawImage( data ) {

    const entityNavOrder =  V.castJson( V.getLocal( 'entity-nav-order' ) );

    entityNavOrder[data.path].tinyImage = data.images.tinyImage;
    entityNavOrder[data.path].useDataUrl = true;

    V.setLocal( 'entity-nav-order', entityNavOrder );

  }

  function drawJoinedUserPill() {
    if ( V.getState( 'active' ).path != '/' ) { return }
    const $userPill = V.getNode( '[uuide="' + V.getState( 'activeEntity' ).uuidE + '"]' );
    V.getNode( 'entity-nav > ul' ).prepend( $userPill );
    const $span = $userPill.getElementsByClassName( 'pill__initials' )[0];
    if ( $span ) {
      $span.textContent = $userPill.getAttribute( 'fullId' ).replace( /\s#\d{4}/, '' );
    }
  }

  return {
    draw: draw,
    drawReset: drawReset,
    drawUserNav: drawUserNav,
    drawImage: drawImage,
    drawEntityNavPill: drawEntityNavPill,
    drawJoinedUserPill: drawJoinedUserPill,
  };

} )();
