const SearchComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Search Components
   *
   */

  'use strict';

  V.setStyle( {
    'search-main': {
      'top': 'var(--search-main-top)',
      'left': 'var(--search-main-left)',
      'border-radius': '20px',
      'background': 'white',
      'height': '2.5rem',
      'width': '2.5rem',
      'transition': 'all 0.3s ease-in-out', // using transition instead of V.setAnimation is better here
    },
    'search__btn': {
      'width': '2rem',
      'height': '2rem',
      'top': '4px',
      'right': '4px',
      'background': 'white',
      'border-radius': '9999px',
      'align-items': 'center',
    },
    'search__input': {
      border: '0',
      top: '4px',
      left: '11px',
      width: '70%',
      height: '2rem',
      background: 'white',

    },
    'search__overlay': {
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
    },
  } );

  /* ================== private methods ================= */

  let $form, $input, $overlay, sc, isOpen;

  function handleSearchMain() {
    $overlay = V.getNode( '.search__overlay' );
    $form = V.getNode( 'search-main' );
    $input = $form.getNode( '.search__input' );
    sc = V.getState( 'screen' );

    if ( isOpen ) {
      if ( $input.value != '' ) {
        if ( $input.value.length < 2 ) { return }
        handleQuery( $input.value );
      }
      close();
    }
    else {
      open();
    }

  }

  function close() {

    isOpen = false;
    $input.style.display = 'none';
    $overlay.style.display = 'none';
    $input.value = '';

    // V.setAnimation( 'search-main', { width: '2.5rem' } );
    $form.style.width = '2.5rem'; // using css transition

    animateNav(); // has to be placed here, needed for search__overlay click

  }

  function open() {
    isOpen = true;
    $input.style.display = 'block';
    $overlay.style.display = 'block';
    $input.focus();

    // V.setAnimation( 'search-main', { width: '14rem' } );
    $form.style.width = sc.width > 800 ? '240px' : '195px'; // using css transition

    animateNav();

  }

  function animateNav() {

    /* animate the correct nav to the right of the search field */

    let nav = V.getState( 'active' ).navItem;

    nav = V.getVisibility( 'user-nav' )
      ? 'user-nav'
      : nav
        ? nav.includes( '/profile' )
          ? 'entity-nav'
          : 'service-nav'
        : 'entity-nav';

    const distLeft = isOpen
      ? sc.width > 800 ? '340px' : '272px'
      : V.getState( 'header' ).entityNavLeft + 'px';

    V.setAnimation( nav, { left: distLeft } );
  }

  function handleQuery( query ) {
    const data = {
      query: query,
    };
    Marketplace.draw( V.getState( 'active' ).navItem, data );
  }

  /* ================  public components ================ */

  function searchMain() {
    return V.cN( {
      t: 'search-main',
      c: 'search-main flex relative pill-shadow',
      h: [
        {
          t: 'div',
          c: 'search__overlay fixed hidden',
          k: close,
        },
        {
          t: 'input',
          c: 'search__input relative hidden',
          a: {
            type: 'search',
          },
        },
        {
          t: 'div',
          c: 'search__btn flex absolute justify-center',
          h: V.getIcon( 'search' ),
          k: handleSearchMain,
        },
      ],
    } );
  }

  /* ====================== export ====================== */

  return {
    searchMain: searchMain,
  };

} )();
