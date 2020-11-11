const Navigation = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Module controlling the app's navigation
   *
   */

  'use strict';

  /* ================== private methods ================= */

  function presenter(
    data,
    whichPath = typeof data == 'object' ? data.paths.entity : data
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

    const entityNavOrder = V.castJson( V.getCookie( 'entity-nav-order' ) || '{}' );
    V.getState( 'entityNav' ) ? null : V.setState( 'entityNav', {} ); // ensure entityNav-state exists
    const entityNav = V.getState( 'entityNav' );

    if ( data && data.tinyImage && entityNavOrder[data.path] ) { // update the clicked entity tinyImage if available
      entityNavOrder[data.path].tinyImage = JSON.stringify( data.tinyImage );
    }

    for ( const item in entityNavOrder ) {

      if ( !entityNav[item] ) {
        const obj = {
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

    if ( data && data.fullId && !entityNav[data.path] ) {
      const obj = {
        title: data.profile.title,
        tag: data.profile.tag,
        initials: V.castInitials( data.profile.title ),
        path: data.path,
        draw: function( path ) { Profile.draw( path ) },
      };
      data.tinyImage ? obj.tinyImage = JSON.stringify( data.tinyImage ) : null;
      V.setNavItem( 'entityNav', obj );
    }

    syncNavOrder( entityNavOrder, entityNav );

    V.setCookie( 'entity-nav-order', entityNavOrder );

    /**
     * Check whether we have to also update the other navs
     *
     */

    const doesNodeExist = V.getNode( '[path="' + whichPath + '"]' );

    if (
      doesNodeExist &&
      doesNodeExist.closest( 'header' ) &&
      !data.fullId
    ) {
      return {
        success: false,
        status: 'navigation does not need updating',
        data: [{
          which: whichPath
        }]
      };
    }

    /**
     * Update serviceNavOrder (always)
     * Plugins have already registered their service nav items at this stage
     *
     */

    const serviceNavOrder = V.castJson( V.getCookie( 'service-nav-order' ) || '{}' );
    const serviceNav = V.getState( 'serviceNav' );

    syncNavOrder( serviceNavOrder, serviceNav );

    V.setCookie( 'service-nav-order', serviceNavOrder );

    /**
     * Update userNavOrder (always)
     * User Plugin has already registered its nav items at this stage
     *
     */

    const userNavOrder = V.castJson( V.getCookie( 'user-nav-order' ) || '{}' );
    const userNav = V.getState( 'userNav' );

    syncNavOrder( userNavOrder, userNav );

    V.setCookie( 'user-nav-order', userNavOrder );

    return {
      success: true,
      status: 'navigation updated',
      data: [{
        which: whichPath,
        entityNav: entityNavOrder,
        userNav: userNavOrder,
        serviceNav: serviceNavOrder,
        keep: 5
      }]
    };
  }

  function view( viewData ) {

    if ( viewData.success ) {

      !viewData.data[0].which ? reset() : null;

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

      V.setNode( $entityNavUl, NavComponents.pill( { title: 'zzzzz' } ) ); // a last placeholder pill

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

    /**
     * animate, if path was provided
     *
     */

    const which = viewData.data[0].which;

    if ( which ) {
      animate( which );
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
          title: b[newKey].title,
          tag: b[newKey].tag,
          initials: b[newKey].initials,
          path: b[newKey].path
        };

        b[newKey].tinyImage ? a[b[newKey].path].tinyImage = b[newKey].tinyImage : null;

      }
    }
  }

  function itemClickHandler( e ) {

    e.stopPropagation(); // no need to bubble any further
    const $itemClicked = e.target.closest( 'li' );

    if ( $itemClicked ) {
      const path = $itemClicked.getAttribute( 'path' );
      V.setState( 'active', { navItem: path } );
      V.setBrowserHistory( path );
      V.getNavItem( 'active', ['serviceNav', 'entityNav', 'userNav'] ).draw( path );
    }

  }

  function setCountAndLastIndex( row ) {
    const $rowAfter = V.getNode( row + ' > ul' ).childNodes;
    const navOrder = V.castJson( V.getCookie( row + '-order' ) );

    for ( let i = 0; i < $rowAfter.length - 1; i++ ) { // -1 to ignore placeholder pill
      const $li = $rowAfter[i];
      const path = $li.getAttribute( 'path' );

      $li.classList.contains( 'pill--selected' ) ?
        navOrder[ path ].c ? navOrder[ path ].c += 1 : navOrder[ path ].c = 1 : null;

      navOrder[ path ].l = i;

    }

    V.setCookie( row + '-order', navOrder );

    // debug
    // const debug = V.castJson( V.getCookie( row + '-order' ) );
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
      left: menuStateObj.entityNavLeft + 3
    }, {
      duration: 2
    } ).then( () => {
      $itemToAnimate.style.visibility = 'visible';
      $tempMover.remove();

    } );

  }

  function select( $item ) {
    const span = $item.getElementsByClassName( 'pill__initials' )[0];
    if ( span ) {
      span.innerHTML = $item.getAttribute( 'fullId' );
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
          span.innerHTML = $itemSelected[i].getAttribute( 'initials' );
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
      return;
    }

    /* if an entity is being edited, just return to entity list first */
    if (
      V.getState( 'active' ).path == '/me/entities' &&
      V.getVisibility( '#pref-lang-edit' )
    ) {
      EntityList.draw( '/me/entities' );
      return;
    }

    /* else reset navigation and page */
    reset();
    Page.draw( { position: 'closed', reset: false, navReset: false } );
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

    Chat.drawMessageForm( 'clear' ); // a good place to reset the chat input

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
      width: width
    }, { duration: 1.5 } );

    V.setAnimation( 'service-nav', {
      width: width,
      top: menuStateObj.serviceNavTop,
      left: menuStateObj.serviceNavLeft
    }, { duration: 2.5 } );

    Form.draw( 'all', { fade: 'out' } );
    Button.draw( 'all', { fade: 'out' } );

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
      width: itemClickedRect.width + 11,
      top: menuStateObj.entityNavTop,
      left: menuStateObj.entityNavLeft
    }, { duration: 1 } );
    V.getNode( nav ).scrollLeft = 0;

  }

  /* ============ public methods and exports ============ */

  function draw( data ) {
    view( presenter( data ) );
  }

  function drawReset() {
    reset();
  }

  return {
    draw: draw,
    drawReset: drawReset,
  };

} )();
