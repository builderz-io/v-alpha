const Navigation = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Module controlling the app's navigation
   *
   */

  'use strict';

  V.setStyle( {

    /* Gain scrollable space adding invisible last pill to navs */
    'entity-nav__ul > *:last-child': {
      visibility: 'hidden'
    },
    'service-nav__ul > *:last-child': {
      visibility: 'hidden'
    }
  } );

  /* ================== private methods ================= */

  function presenter(
    data,
    whichPath = typeof data == 'object' ? data.profile.path : data
  ) {

    const doesNodeExist = V.getNode( '[path="' + whichPath + '"]' );
    if (
      doesNodeExist &&
      doesNodeExist.closest( 'header' )
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
     * Update entityNavOrder
     * Plugins have already registered their entity nav items at this stage
     *
     * AND
     *
     * Update entityNav in app state from entityNavOrder, as well as
     * newly viewed profile (data parameter)
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

    if ( data && data.fullId && !entityNav[data.path] ) {
      V.setNavItem( 'entityNav', {
        title: V.castInitials( data.profile.title ),
        path: data.path,
        draw: function( path ) { Profile.draw( path ) }
      } );
    }

    syncNavOrder( entityNavOrder, entityNav );

    V.setCookie( 'entity-nav-order', entityNavOrder );

    return {
      success: true,
      status: 'navigation updated',
      data: [{
        which: whichPath,
        entityNav: entityNavOrder,
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
        const $pill = NavComponents.pill( entityRow[i] );
        V.setNode( $entityNavUl, $pill );
      }

      V.setNode( $entityNavUl, NavComponents.pill( { title: 'zzzzz' } ) ); // a last placeholder pill

      V.setNode( 'entity-nav', '' );
      V.setNode( 'entity-nav', $entityNavUl );

    }

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

  function itemClickHandler( e ) {

    e.stopPropagation(); // no need to bubble any further

    const $itemClicked = ( ( e ) => {
      // in case svg is used in the pill, return the correct li clicked
      const t = e.target;
      if ( t.localName == 'li' ) { return t }
      else if ( t.localName == 'svg' ) { return t.parentNode }
      else if ( t.localName == 'path' ) { return t.parentNode.parentNode }
    } )( e );

    if ( $itemClicked ) {

      const path = $itemClicked.getAttribute( 'path' );

      V.setState( 'active', { navItem: path } );

      V.setBrowserHistory( { path: path } );

      V.getNavItem( 'active', ['serviceNav', 'entityNav'] ).draw( path );

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
    $item.className += ' pill--selected';
    $item.addEventListener( 'click', resetOnClick, { once: true } );
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

    deselect();

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

    const menuStateObj = V.getState( 'header' );
    const row = $itemToAnimate.parentNode.parentNode.localName;
    const itemClickedRect = $itemToAnimate.getBoundingClientRect();
    const otherRow = row == 'service-nav' ? 'entity-nav' : 'service-nav';

    movingPillAnimation( row, $itemToAnimate, itemClickedRect, menuStateObj );

    V.sA( otherRow, { width: 0 }, { duration: 1 } );
    // V.sA( otherRow, { opacity: 0 }, { duration: 0.5, visibility: 'hidden' } ); // alternative animation

    V.setAnimation( row, {
      width: itemClickedRect.width + 13,
      top: menuStateObj.entityNavTop,
      left: menuStateObj.entityNavLeft
    }, { duration: 1 } );
    V.getNode( row ).scrollLeft = 0;

    /**
     * Update nav status in cookies
     *
     */

    setCountAndLastIndex( row );

  }

  /* ============ public methods and exports ============ */

  function draw( data ) {
    view( presenter( data ) );
  }

  return {
    draw: draw
  };

} )();
