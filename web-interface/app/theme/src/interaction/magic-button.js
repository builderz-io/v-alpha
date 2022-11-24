const MagicButton = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Magic Button Module
   *
   */

  'use strict';

  V.setStyle( {
    'magic-btn': {
      'top': 'var(--magic-btn-top)',
      'left': 'var(--magic-btn-left)',
      'border-radius': '20px',
      'background': 'white',
      'height': '2.5rem',
      'width': '2.5rem',
      'transition': 'all 0.3s ease-in-out', // using transition instead of V.setAnimation is better here
    },
    'magic-btn__btn': {
      'width': '2rem',
      'height': '2rem',
      'top': '4px',
      'right': '4px',
      'background': 'white',
      'border-radius': '9999px',
      'align-items': 'center',
    },
    'magic-btn__input': {
      'border': '0',
      'top': '4px',
      'left': '1rem',
      'max-width': '70%',
      'height': '2rem',
      'background': 'white',

    },
    'magic-btn__overlay': {
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
    },
  } );

  /* ================== private methods ================= */

  let $magicButton, $input, $overlay, sc;

  function handleSetEntity( e ) {
    e.target.removeEventListener( 'click', handleSetEntity );

    V.setNode( '.magic-btn__btn', '' );
    V.setNode( '.magic-btn__btn', InteractionComponents.confirmClickSpinner( { omitMarginLeft: true } ) );

    const $newEntityForm = V.getNode( 'form' );
    const $location = $newEntityForm.getNode( '#plusform__loc' );

    const entityData = {
      title: $newEntityForm.getNode( '#plusform__title' ).value,
      role: V.getNavItem( 'active', 'serviceNav' ).use.role,
      location: $location.value,
      lat: $location.value ? $location.getAttribute( 'lat' ) || undefined : undefined,
      lng: $location.value ? $location.getAttribute( 'lng' ) || undefined : undefined,
      description: $newEntityForm.getNode( '#plusform__descr' ).value,
      unit: $newEntityForm.getNode( '#plusform__unit' ).value,
      target: $newEntityForm.getNode( '#plusform__target' ).value,
    };

    if ( !V.aE() || V.aE().auth == false ) {

      /**
         * ask user to authenticate first
         * save form to cookies to keep user's progress
         *
         */

      V.setLocal( 'last-form', entityData );
      Modal.draw( 'confirm uPhrase' );
      // Join.draw( 'authenticate' );
      e.target.addEventListener( 'click', handleSetEntity );
    }
    else {
      V.setEntity( entityData ).then( res => {
        // V.setNode( '.confirm-click-spinner', 'clear' );

        if ( res.success ) {
          V.setLocal( 'last-form', undefined );
          console.log( res.message );
          console.log( 'set uuidE:', res.data[0].uuidE );
          // e.target.addEventListener( 'click', handleSetEntity );
          // V.setCache( 'points', res.data );
          // V.setCache( 'points', res.data );
          // V.setCache( 'all', 'clear' );
          // V.setCache( res.data[0].role, 'clear' );
          V.setBrowserHistory( res.data[0].path );
          // Navigation.drawEntityNavPill( res.data[0] );
          User.draw( {
            uuidE: res.data[0].uuidE,
            uuidP: res.data[0].uuidP,
          } );
          // Button.draw( 'set', { fade: 'out' } );
          Form.draw( 'all', { fade: 'out' } );

          /**
             * Update "adminOf" Array of activeEntity in database
             *
             */

          if ( 'MongoDB' == V.getSetting( 'entityLedger' ) ) {
            V.setEntity( V.aE().fullId, {
              field: 'adminOf',
              data: res.data[0].fullId,
            } );
          }

          /* update cache with new entity */

          // V.setCache( 'highlights', res.data );

        }
        else {
          Form.draw( 'error', res );
          MagicButton.draw( 'set' );
          // e.target.addEventListener( 'click', handleSetEntity );
          console.error( res );
        }
      } );
    }

  }

  function handleViewMode() {
    const data = {
      uuidE: V.getState( 'active' ).lastViewedUuidE,
      uuidP: V.getState( 'active' ).lastViewedUuidP,
      navReset: false,
    };

    this.edit
      ? User.draw( data )
      : Profile.draw( data );

  }

  function handleMagicBtn() {
    $overlay = V.getNode( '.magic-btn__overlay' );
    $magicButton = V.getNode( 'magic-btn' );

    $input = $magicButton.getNode( '.magic-btn__input' )
    || $magicButton.getNode( '.messageform__input' );

    sc = V.getState( 'screen' );

    V.getNode( '.messageform__response' )
      ? V.getNode( '.messageform__response' ).textContent = ''
      : null;

    if ( V.getState( 'active' ).magicBtnInput ) {
      if ( $input.value != '' ) {
        if ( $input.value.length < 2 ) { return }
        this.isSearch
          ? handleSearchQuery( $input.value )
          : Chat.handleSetMessageBot();
      }
      close();
    }
    else {
      open();
    }

  }

  function handleSearchQuery( query ) {
    const data = {
      query: query,
    };
    Marketplace.draw( V.getState( 'active' ).navItem, data );
  }

  function close() {
    if( !$input ) { return }
    V.setState( 'active', { magicBtnInput: false } );
    $input.style.display = 'none';
    $overlay ? $overlay.style.display = 'none' : null;
    // $input.value = '';

    $magicButton.style.width = '2.5rem'; // using css transition

    animateNav(); // has to be placed here, needed also for magic-btn__overlay click

  }

  function open() {
    V.setState( 'active', { magicBtnInput: true } );
    $input.style.display = 'block';
    $overlay ? $overlay.style.display = 'block' : null;

    setTimeout( function magicBtnInputFocus() {
      $input.focus();
    }, 400 );

    $magicButton.style.width = sc.width > 800 ? '240px' : '195px'; // using css transition

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

    const distLeft = V.getState( 'active' ).magicBtnInput
      ? sc.width > 800 ? '340px' : '272px'
      : V.getState( 'header' ).entityNavLeft + 'px';

    V.setAnimation( nav, { left: distLeft } );
  }

  function view( which, options ) {
    const $magicButton = V.getNode( 'magic-btn' );

    V.setNode( $magicButton, '' );

    if ( 'search' == which ) {
      V.setNode( $magicButton, [
        {
          c: 'magic-btn__overlay fixed hidden',
          k: close,
        },
        {
          t: 'input',
          c: 'magic-btn__input relative hidden',
          a: {
            type: 'search',
          },
        },
        {
          c: 'magic-btn__btn flex absolute justify-center',
          h: V.getIcon( 'search' ),
          k: handleMagicBtn.bind( { isSearch: true } ),
        },
      ] );
    }
    else if ( 'set' == which ) {
      V.setNode( $magicButton, {
        c: 'magic-btn__btn flex absolute justify-center',
        h: V.getIcon( 'upload', '19px' ),
        k: handleSetEntity,
      } );
    }
    else if ( 'edit' == which ) {
      V.setNode( $magicButton, {
        c: 'magic-btn__btn flex absolute justify-center',
        h: V.getIcon( 'edit', '19px' ),
        k: handleViewMode.bind( { edit: true } ),
      } );
    }
    else if ( 'done' == which ) {
      V.setNode( $magicButton, {
        c: 'magic-btn__btn flex absolute justify-center',
        h: V.getIcon( 'done', '19px' ),
        k: handleViewMode.bind( { edit: false } ),
      } );
    }
    else if ( 'chat' == which ) {
      V.setNode( $magicButton, [
        {
          c: 'magic-btn__overlay fixed hidden',
          k: close,
        },
        {
          t: 'input',
          c: 'magic-btn__input relative hidden',
          a: {
            type: 'text',
            value: V.aE() && options == 'no-prefill' ? '' : 'send 10',
          },
          e: {
            focus: function setCursorToEndOfPrefill() {
              // https://stackoverflow.com/a/10576409/9322037
              const that = this;
              setTimeout( function() { that.selectionStart = that.selectionEnd = 10000 }, 0 );
            },
          },
        },
        {
          c: 'messageform__response magic-btn__res whitespace-no-wrap',
          y: {
            top: '48px',
          },
        },
        {
          c: 'magic-btn__btn flex absolute justify-center',
          h: V.getIcon( 'send' ),
          k: handleMagicBtn.bind( { isChat: true } ),
        },
      ] );
    }
    // previous version
    // else if ( 'chat' == which ) {
    //   const prefill = options == 'no-prefill' ? '' : V.getState( 'active' ).lastViewed;
    //
    //   V.setNode( $magicButton, [
    //     {
    //       c: 'magic-btn__overlay fixed hidden',
    //       k: close,
    //     },
    //     ChatComponents.messageInput( prefill ),
    //     {
    //       c: 'magic-btn__btn flex absolute justify-center',
    //       h: V.getIcon( 'send' ),
    //       k: handleMagicBtn,
    //     },
    //     ChatComponents.messageResponse(),
    //   ] );
    // }
  }

  /* ================  public components ================ */

  function draw( which, options ) {
    view( which, options );
  }

  function drawReset() {
    close();
  }

  function frame() {
    return V.cN( {
      t: 'magic-btn',
      c: 'magic-btn flex relative pill-shadow',
    } );
  }

  /* ====================== export ====================== */

  V.handleSetEntity = handleSetEntity;

  return {
    drawReset: drawReset,
    frame: frame,
    draw: draw,
  };

} )();
