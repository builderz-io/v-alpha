const UserComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V User Plugin (display user's tx history and editable profile)
   *
   */

  'use strict';

  let entity, editable;

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
      setEntity( db + '.' + title, entry );
    }
  }

  function handleLocationFocus() {
    DOM.location = this.value;
  }

  function handleLocation() {
    const lat = this.getAttribute( 'lat' );
    const lng = this.getAttribute( 'lng' );
    const value = this.value;

    if ( DOM.location.length && value == '' ) {
      const gen = V.castRandLatLng();
      setEntity( 'properties.location', {
        lat: gen.lat,
        lng: gen.lng,
        value: undefined
      } );
    }
    else if ( lat ) {
      setEntity( 'properties.location', {
        lat: lat,
        lng: lng,
        value: value
      } );
      // delete lat and lng in order for "if" to work
      this.removeAttribute( 'lat' );
      this.removeAttribute( 'lng' );
    }
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

  function setEntity( field, data ) {
    const aE = V.getState( 'activeEntity' );
    V.setEntity( aE.fullId, {
      field: field,
      data: data,
      auth: V.getCookie( 'lastActiveUphrase' ).replace( /"/g, '' )
    } );
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
    const descr = entity.properties.description;
    if( descr || ( !descr && editable ) ) {
      const $innerContent = V.castNode( editable ? setEditable( {
        t: 'p',
        c: 'pxy',
        a: { title: 'description', db: 'properties' },
        h: descr,
      } ) : {
        t: 'p',
        c: 'pxy',
        h: descr,
      } );
      return castCard( $innerContent, 'Description' );
    }
    else {
      return '';
    }
  }

  function locationCard() {
    const loc = entity.properties.location;

    if( loc || ( !loc && editable ) ) {
      const $innerContent = V.castNode( editable ? {
        tag: 'input',
        i: 'user__loc',
        c: 'pxy w-full',
        a: {
          value: loc
        },
        e: {
          focus: handleLocationFocus,
          blur: handleLocation
        }
      } : {
        t: 'p',
        c: 'pxy',
        h: loc
      } );
      return castCard( $innerContent, 'Location' );
    }
    else {
      return '';
    }
  }

  function entityCard() {
    const titles = ['title', 'tag', 'role'];
    const db = 'profile';
    const $innerContent = castTableNode( titles, db );
    return castCard( $innerContent, 'Entity' );
  }

  function financialCard() {
    const target = entity.properties.target;
    if( target || ( !target && editable ) ) {
      const titles = ['target', 'unit'];
      const db = 'properties';
      const $innerContent = castTableNode( titles, db, editable );
      return castCard( $innerContent, 'Financial' );
    }
    else {
      return '';
    }
  }

  function socialCard() {
    const titles = ['facebook', 'twitter', 'telegram', 'website', 'email'];
    const db = 'social';
    const $innerContent = castTableNode( titles, db, editable );
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
