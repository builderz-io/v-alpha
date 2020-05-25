const UserComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V User Plugin (display user's tx history and editable profile)
   *
   */

  'use strict';

  let entity, editable;

  // function handleViewAccount( e ) {
  //   e.stopPropagation();
  //   V.setBrowserHistory( { path: '/me/account' } );
  //   Account.draw();
  // }
  const DOM = {};

  /* ================== event handlers ================== */

  function handleEntryFocus() {
    DOM.entry = this.innerHTML;
    if ( this.innerHTML == 'edit' ) {
      this.innerHTML = '';
    }
  }

  function handleEntry() {
    let str = this.innerHTML, entry;
    const title = this.getAttribute( 'title' );
    const db = this.getAttribute( 'db' );

    if ( str != DOM.entry ) {
      if ( ['facebook', 'twitter', 'telegram'].includes( title ) ) {
        str = str.endsWith( '/' ) ? str.slice( 0, -1 ) : str;
        const split = str.replace( /(<([^>]+)>)/ig, '' ).split( '/' );
        entry = split.pop().replace( '@', '' );
      }
      else if ( title == 'email' ) {
        entry = str.includes( '@' ) ? str.includes( '.' ) ? str : 'not valid' : str == '' ? '' : 'not valid';
      }
      else if ( title == 'website' ) {
        entry = str.includes( '.' ) ? str : 'not valid';
      }
      else {
        entry = str;
      }

      if ( entry == '' ) {
        this.innerHTML = 'edit';
      }
      else if ( entry == 'not valid' ) {
        this.innerHTML = 'not valid';
        return;
      }
      else {
        this.innerHTML = entry;
      }
      const aE = V.getState( 'activeEntity' );
      V.setEntity( aE.fullId, {
        field: db + '.' + title,
        data: entry,
        auth: V.getCookie( 'lastActiveUphrase' ).replace( /"/g, '' )
      } );
    }
  }

  function handleLocation() {
    const lat = this.getAttribute( 'lat' );
    const lng = this.getAttribute( 'lng' );
    const value = this.value;
    console.log( lat, lng, value );
  }

  /* ================== private methods ================= */

  function castCard( $innerContent, whichTitle ) {
    return CanvasComponents.card( $innerContent, whichTitle );
  }

  function castTableNode( titles, db, editable ) {
    return V.cN( {
      t: 'table',
      c: 'w-full pxy',
      h: titles.map( title => {
        return V.cN( {
          t: 'tr',
          h: [
            V.cN( { t: 'td', c: 'capitalize', h: title } ),
            V.cN( editable ? setEditable( {
              t: 'td',
              c: 'txt-right txt-brand',
              a: { title: title, db: db },
              h: entity[db] ? entity[db][title] : undefined
            } ) : {
              t: 'td',
              c: 'txt-right',
              h: entity[db] ? entity[db][title] : undefined
            } ),
          ]
        } );
      } )
    } );
  }

  function setEditable( obj ) {
    if ( editable ) {
      obj.e = {
        focus: handleEntryFocus,
        blur: handleEntry
      };
      if ( obj.a ) {
        Object.assign( obj.a, { contenteditable: 'true' } );
      }
      else {
        obj.a = { contenteditable: 'true' };
      }
      if ( !obj.h ) {
        obj.h = 'edit';
      }
      return obj;
    }
    else {
      return obj;
    }
  }

  /* ================== public methods ================== */

  function setData( data ) {
    entity = data.entity;
    editable = data.editable ? true : false;
  }

  function topcontent() {
    return V.cN( {
      t: 'div',
      h: [
        V.cN( {
          tag: 'h1',
          class: 'font-bold txt-center pxy',
          html: /* V.i18n( 'Your Profile', 'account' ) + '<br>' + */ entity.fullId,
        } )
      ]
    } );
  }

  function introCard() {
    const $innerContent = V.castNode( setEditable( {
      t: 'p',
      c: 'pxy',
      a: { title: 'description', db: 'properties' },
      h: entity.properties.description,
    } ) );
    return castCard( $innerContent, 'Description' );
  }

  function locationCard() {
    const $innerContent = V.castNode( {
      tag: 'input',
      i: 'user__loc',
      c: 'pxy w-full',
      html: entity.properties.location,
      e: {
        input: handleLocation
      }
    } );
    return castCard( $innerContent, 'Location' );
  }

  function entityCard() {
    const titles = ['title', 'tag', 'role', 'creator', 'creatorTag'];
    const db = 'profile';
    const $innerContent = castTableNode( titles, db );
    return castCard( $innerContent, 'Entity' );
  }

  function financialCard() {
    const titles = ['target', 'unit'];
    const db = 'properties';
    const $innerContent = castTableNode( titles, db, 'editable' );
    return castCard( $innerContent, 'Financial' );
  }

  function socialCard() {
    const titles = ['facebook', 'twitter', 'telegram', 'website', 'email'];
    const db = 'social';
    const $innerContent = castTableNode( titles, db, 'editable' );
    return castCard( $innerContent, 'Social' );
  }

  /* ====================== export ====================== */

  return {
    setData: setData,
    topcontent: topcontent,
    introCard: introCard,
    locationCard: locationCard,
    entityCard: entityCard,
    financialCard: financialCard,
    socialCard: socialCard,
  };

} )();
