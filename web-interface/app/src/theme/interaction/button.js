const Button = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw buttons
   *
   */

  'use strict';

  /* ================== private methods ================= */

  function castButtons() {

    const $filter = InteractionComponents.filter();
    const $search = InteractionComponents.searchBtn();
    const $query = InteractionComponents.query();
    const $plus = InteractionComponents.plus();
    const $send = InteractionComponents.sendNav();
    const $close = InteractionComponents.close();

    $plus.addEventListener( 'click', function() {
      Page.draw( { position: 'closed', reset: false } );
      Form.draw( V.getNavItem( 'active', 'serviceNav' ).use.form );
    } );
    $search.addEventListener( 'click', function() {
      Page.draw( { position: 'closed', reset: false } );
      Form.draw( 'search' );
    } );
    $close.addEventListener( 'click', function() {
      Form.draw( 'all', { fade: 'out' } );
      Button.draw( 'all', { fade: 'out' } );
      Button.draw( V.getNavItem( 'active', 'serviceNav' ).use.button, { delay: 1.5 } );
      Page.draw( { position: 'peek', reset: false } );
    } );
    $query.addEventListener( 'click', function() {
      const form = V.getNode( 'form' );
      const query = form.getNode( '#search-input' ).value;
      console.log( query );

    } );
    $send.addEventListener( 'click', function() {
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
            Form.draw( 'all', { fade: 'out' } );
            Button.draw( 'all', { fade: 'out' } );
            Button.draw( 'plus search', { delay: 1 } );
            console.log( res );
            VMap.draw( { type: 'Feature', geometry: res.data[0].geometry } );
            console.log( res.status );
          }
          else {
            Form.draw( 'error', res );
            console.error( res.status );
          }
        } );
        V.setCookie( 'last-form', undefined );
      }

    } );

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
