const Button = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw buttons
   *
   */

  'use strict';

  /* ================== event handlers ================== */

  function handleSetEntity() {
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
          Form.draw( 'all', { fade: 'out' } );
          Button.draw( 'all', { fade: 'out' } );
          Button.draw( 'plus search', { delay: 1 } );
          VMap.draw( { type: 'Feature', geometry: res.data[0].geometry } );

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
          console.error( res.status );
        }
      } );
      V.setCookie( 'last-form', undefined );
    }

  }

  function handleQuery() {
    const query = V.getNode( '#search-input' ).value;
    if ( query.length < 2 ) { return }
    const split = V.getState( 'active' ).navItem.split( '/' );
    const active = split.pop();
    const removePlural = active.slice( 0, -1 ); // TODO improve this, as 'all' becomes 'al'
    Search.draw( {
      role: removePlural,
      query: query,
      // filterCity: V.getNode( '#search-filter__city' ).getAttribute( 'value' ),
      // filterTitle: V.getNode( '#search-filter__title' ).getAttribute( 'value' )
    } );
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

  /* ================== private methods ================= */

  function castButtons() {

    const $filter = InteractionComponents.filter();
    const $search = InteractionComponents.searchBtn();
    const $query = InteractionComponents.query();
    const $plus = InteractionComponents.plus();
    const $send = InteractionComponents.sendNav();
    const $close = InteractionComponents.close();

    $plus.addEventListener( 'click', handleDrawPlusForm );
    $search.addEventListener( 'click', handleDrawSearchForm );
    $close.addEventListener( 'click', handleCloseForms );
    $query.addEventListener( 'click', handleQuery );
    $send.addEventListener( 'click', handleSetEntity );

    // V.setNode( DOM.$backUL, $back );
    V.setNode( 'interactions > ul', [ $close, $plus, $filter, $search, $query, $send ] );
  }

  function presenter( which, options ) {
    const btnArr = which == 'all' ? ['filter', 'search', 'plus', 'close', 'send', 'query'] : which.split( ' ' );
    return {
      btnArr: btnArr,
      options: options
    };
  }

  function view( set ) {
    let fade = 'fadeIn', delay = 0.2;
    set.options && set.options.fade == 'out' ? fade = 'fadeOut' : null;
    set.options && set.options.delay ? delay = set.options.delay : null;
    set.btnArr.forEach( btn => {
      V.setAnimation( '#' + btn, fade, { delay: delay, duration: 1 } );
    } );
  }

  /* ============ public methods and exports ============ */

  function launch() {
    castButtons();
  }

  function draw( which, options ) {
    view( presenter( which, options ) );
  }

  return {
    launch: launch,
    draw: draw
  };

} )();
