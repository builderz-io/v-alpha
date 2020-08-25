const Page = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw the page and control the page sliding
   * https://stackoverflow.com/questions/13278087/determine-vertical-direction-of-a-touchmove
   *
   */

  'use strict';

  const DOM = {};

  /* ================== private methods ================= */

  function castPage() {

    /* page nodes */
    const $page = CanvasComponents.page();
    const $handle = CanvasComponents.handle();
    const $content = CanvasComponents.content();
    const $topContent = CanvasComponents.topContent();
    const $topSlider = CanvasComponents.topSlider();
    const $listings = CanvasComponents.listings();

    $handle.addEventListener( 'click', handleClickHandler );
    $handle.addEventListener( 'touchstart', pageFlickStartHandler );
    $handle.addEventListener( 'touchend', pageFlickEndHandler );
    $topContent.addEventListener( 'touchstart', pageFlickStartHandler );
    $topContent.addEventListener( 'touchend', pageFlickEndHandler );
    $topSlider.addEventListener( 'touchstart', pageFlickStartHandler );
    $topSlider.addEventListener( 'touchend', pageFlickEndHandler );
    $listings.addEventListener( 'touchstart', pageFlickStartHandler );
    $listings.addEventListener( 'touchend', pageFlickEndHandler );

    function handleClickHandler() {
      const p = V.getState( 'page' );
      if ( p.height == p.closed ) {
        Page.draw( { position: 'peek', reset: false } );
      }
      else if ( p.height == p.peek ) {
        Page.draw( { position: 'top', reset: false } );
      }
      else if ( p.height == p.featureCalc || p.height >= p.topCalc ) {
        Navigation.draw();
        Page.draw( { position: 'closed', reset: false } );
      }
    }

    function pageFlickStartHandler( e ) {
      V.setState( 'flick', { startX: e.changedTouches[0].clientX } );
      V.setState( 'flick', { startY: e.changedTouches[0].clientY } );
    }

    function pageFlickEndHandler( e ) {

      V.setState( 'flick', { endX: e.changedTouches[0].clientX } );
      V.setState( 'flick', { endY: e.changedTouches[0].clientY } );

      const $list = V.getNode( 'list' );
      let isListingsUlAtTop = true;

      if ( $list && $list.scrollTop > 0 && e.currentTarget.localName == 'listings' ) {
        isListingsUlAtTop = false;
      }

      const p = V.getState( 'page' );
      const f = V.getState( 'flick' );

      if (
        Math.abs( f.startX - f.endX ) < 100 &&
              f.startY > f.endY + 15
      ) {
        if ( p.height == p.peek || p.height == p.featureCalc ) {
          Page.draw( { position: 'top', reset: false } );
        }
        else if ( p.height == p.closed ) {
          Page.draw( { position: 'peek', reset: false } );
        }
      }
      else if (
        isListingsUlAtTop &&
              Math.abs( f.startX - f.endX ) < 100 &&
              f.startY < f.endY - 15
      ) {
        if ( p.height == p.peek ) {
          Page.draw( { position: 'closed', reset: false } );
          // Feature.draw( { fade: 'out' } );
          Navigation.draw();
        }
        else if ( p.height == p.featureCalc || p.height >= p.topCalc ) {
          Page.draw( { position: 'peek', reset: false } );
          // Feature.draw( { fade: 'out' } );
        }
      }
    }

    V.setNode( $content, [$topContent, $topSlider, $listings ] );
    V.setNode( $page, [$handle, $content] );

    V.setNode( 'body', $page );

    DOM.$page = V.getNode( 'page' );
    DOM.$topcontent = V.getNode( 'topcontent' );
    DOM.$topslider = V.getNode( 'topslider' );
    DOM.$listings = V.getNode( 'listings' );

  }

  function view( pageData ) {
    if ( !pageData ) { return }

    pageData.reset == false ? null : reset();

    if ( pageData.topcontent ) {
      V.setNode( DOM.$topcontent, pageData.topcontent );
    }
    if ( pageData.topslider ) {
      V.setNode( DOM.$topslider, pageData.topslider );
    }
    if ( pageData.listings ) {
      V.setNode( DOM.$listings, pageData.listings );
    }
    pageData.position ? slide( pageData.position, pageData.scroll, pageData.haze ) : null;
    pageData.pos ? slide( pageData.pos, pageData.scroll, pageData.haze ) : null;
  }

  function getPageHeight( pagePos ) {
    const p = V.getState( 'page' );
    const aI = V.getState( 'active' );
    switch ( pagePos ) {
    case 'top':
      if ( aI && aI.navItem ) {
        return p.topSelectedCalc;
      }
      else {
        return p.topCalc;
      }
    case 'feature':
      return p.featureCalc;
    case 'peek':
      return p.peek;
    default:
      return p.closed;
    }
  }

  function handlebar( w, h ) {
    V.setAnimation( '.handle__bar', { width: w + '%' } );
    V.setAnimation( 'handle', { height: h + 'px' } );
  }

  function slide( pagePos, pageScroll, showHaze ) {
    const $list = V.getNode( 'list' );
    const $page = V.getNode( 'page' );
    const p = V.getState( 'page' );
    const s = V.getState( 'screen' );

    if ( pageScroll == 'bottom' ) {
      $list.scrollTop = $list.scrollHeight;
    }
    const newHeight = getPageHeight( pagePos );

    if ( newHeight == p.height ) { return }

    V.setAnimation( DOM.$page, { height: newHeight + 'px' }, { duration: 3 } ).then( () => {
      V.setState( 'page', { height: newHeight } );
      if ( $list && !pageScroll ) {
        $list.scrollTop = 0;
      }
    } );

    if ( pagePos == 'top' ) {
      if ( s.width < 800 ) {
        Haze.draw();
        $page.classList.remove( 'pill-shadow' );
      }
      Feature.draw( { fade: 'out' } );
      handlebar( 7, 22 );
    }
    else if ( pagePos == 'feature' ) {
      if ( s.width < 800 ) {
        $page.classList.remove( 'pill-shadow' );
      }
      if ( s.width < 800 && ( showHaze == undefined || showHaze != false ) ) {
        Haze.draw();
      }
      handlebar( 7, 22 );
    }
    else if ( pagePos == 'closed' ) {
      Haze.draw( { fade: 'out' } );
      Feature.draw( { fade: 'out' } );
      handlebar( 5, 35 );
      $page.classList.add( 'pill-shadow' );
      Logo.draw( pagePos );
    }
    else if ( pagePos == 'peek' ) {
      Haze.draw( { fade: 'out' } );
      Feature.draw( { fade: 'out' } );
      // Form.draw( 'all', { fade: 'out' } );
      handlebar( 5, 25 );
      $page.classList.add( 'pill-shadow' );
      Logo.draw( pagePos );
    }
  }

  function reset() {
    DOM.$topcontent.innerHTML = '';
    DOM.$topslider.innerHTML = '';
    DOM.$listings.innerHTML = '';
  }

  /* ============ public methods and exports ============ */

  function launch() {
    castPage();
  }

  function draw( options ) {
    return Promise.resolve( view( options ) );
  }

  return {
    launch: launch,
    draw: draw
  };

} )();
