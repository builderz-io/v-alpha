const Button = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw buttons
   *
   */

  'use strict';

  /* ================== event handlers ================== */

  function handleSetEntity( e ) {
    e.target.removeEventListener( 'click', handleSetEntity );
    Button.draw( 'all', { fade: 'out' } );

    const form = V.getNode( 'form' );
    const location = form.getNode( '#plusform__loc' );

    const entityData = {
      title: form.getNode( '#plusform__title' ).value,
      role: V.getNavItem( 'active', 'serviceNav' ).use.role,
      location: location.value,
      lat: location.value ? location.getAttribute( 'lat' ) || undefined : undefined,
      lng: location.value ? location.getAttribute( 'lng' ) || undefined : undefined,
      description: form.getNode( '#plusform__descr' ).value,
      unit: form.getNode( '#plusform__unit' ).value,
      target: form.getNode( '#plusform__target' ).value
    };

    if ( !V.getState( 'activeEntity' ) ) {

      /**
       * ask user to authenticate first
       * save form to cookies to keep user's progress
       *
       */

      V.setCookie( 'last-form', entityData );
      Join.draw( 'authenticate' );
    }
    else {
      V.setEntity( entityData ).then( res => {
        if ( res.success ) {
          console.log( res.status );
          V.setCache( 'all', 'clear' );
          V.setCache( res.data[0].profile.role, 'clear' );
          V.setBrowserHistory( res.data[0].path );
          Profile.draw( res.data[0].path );
          Form.draw( 'all', { fade: 'out' } );
          // Button.draw( 'plus search', { delay: 1 } );
          VMap.draw(
            {
              type: 'Feature',
              geometry: res.data[0].geometry,
              profile: res.data[0].profile,
              thumbnail: res.data[0].thumbnail,
              path: res.data[0].path
            }
          );

          /**
           * Update "adminOf" Array of activeEntity in database
           *
           */

          V.setEntity( V.getState( 'activeEntity' ).fullId, {
            field: 'adminOf',
            data: res.data[0].fullId,
            auth: V.getCookie( 'last-active-uphrase' ).replace( /"/g, '' )
          } );

        }
        else {
          Form.draw( 'error', res );
          Button.draw( 'close set', { delay: 1 } );
          console.error( res.status );
        }
      } );
      V.setCookie( 'last-form', undefined );
    }

  }

  function handleQuery() {
    const query = V.getNode( '#search-input' ).value;
    if ( query.length < 2 ) { return }
    const data = {
      query: query,
      // filterCity: V.getNode( '#search-filter__city' ).getAttribute( 'value' ),
      // filterTitle: V.getNode( '#search-filter__title' ).getAttribute( 'value' )
    };
    Marketplace.draw( V.getState( 'active' ).navItem, data );
  }

  function handleCloseForms() {
    Form.draw( 'all', { fade: 'out' } );
    Button.draw( 'all', { fade: 'out' } );
    Button.draw( V.getNavItem( 'active', 'serviceNav' ).use.button, { delay: 1.5 } );
    Page.draw( { position: 'peek', reset: false } );
  }

  function handleDrawSearchForm() {
    Page.draw( { position: 'closed', reset: false } );
    Form.draw( 'search' );
  }

  function handleDrawPlusForm() {
    Page.draw( { position: 'closed', reset: false } );
    Form.draw( V.getNavItem( 'active', 'serviceNav' ).use.form );
  }

  function handleSend() {
    V.setBrowserHistory( '/me/transfers' );
    V.setState( 'active', { lastViewed: V.getNode( '.pill__replace' ).innerHTML } );
    Canvas.draw( { path: '/me/transfers' } );
  }

  /* ================== private methods ================= */

  function castButtons() {

    const $filter = InteractionComponents.filter();
    const $search = InteractionComponents.searchBtn();
    const $query = InteractionComponents.query();
    const $plus = InteractionComponents.plus();
    const $set = InteractionComponents.set();
    const $send = InteractionComponents.sendNav();
    const $close = InteractionComponents.close();

    $plus.addEventListener( 'click', handleDrawPlusForm );
    $search.addEventListener( 'click', handleDrawSearchForm );
    $close.addEventListener( 'click', handleCloseForms );
    $query.addEventListener( 'click', handleQuery );
    $set.addEventListener( 'click', handleSetEntity );
    $send.addEventListener( 'click', handleSend );

    // V.setNode( DOM.$backUL, $back );
    V.setNode( 'interactions > ul', [ $close, $plus, $filter, $search, $query, $set, $send ] );
  }

  function view( which, options ) {
    const btnArr = which == 'all' ? ['filter', 'search', 'plus', 'close', 'set', 'send', 'query'] : which.split( ' ' );
    let fade = 'fadeIn', delay = 0.2;
    options && options.fade == 'out' ? fade = 'fadeOut' : null;
    options && options.delay ? delay = options.delay : null;
    btnArr.forEach( btn => {
      V.setAnimation( '#' + btn, fade, { delay: delay, duration: 0.5 } );
    } );
  }

  /* ============ public methods and exports ============ */

  function launch() {
    castButtons();
  }

  function draw( which, options ) {
    view( which, options );
  }

  return {
    launch: launch,
    draw: draw
  };

} )();
