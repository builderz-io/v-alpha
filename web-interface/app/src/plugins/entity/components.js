const UserComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V User Plugin (display user's tx history and editable profile)
   *
   */

  'use strict';

  let entity, editable;

  const DOM = {};

  V.setStyle( {
    'app-lang-selector': {
      'display': 'flex',
      'justify-content': 'space-evenly',
      'width': '190px',
      'padding': '25px 0'
    }
  } );

  /* ================== event handlers ================== */

  function handleEntryFocus() {
    DOM.entry = this.innerHTML;
    if ( ['edit', 'not valid'].includes( this.innerHTML )  ) {
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
      else if ( title == 'evm-address' ) {
        entry = str.includes( '0x' ) && str.length == 42 ? str : 'not valid';
      }
      else if ( title == 'currentUTC' ) {
        entry = isNaN( str ) ? 'not valid' : str;
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

  function handleBaseLocationFocus() {
    DOM.location = this.value;
  }

  function handleBaseLocation() {
    const lat = this.getAttribute( 'lat' );
    const lng = this.getAttribute( 'lng' );
    const value = this.value;

    if ( DOM.location.length && value == '' ) {
      const gen = V.castRandLatLng();
      setEntity( 'properties.baseLocation', {
        lat: gen.lat,
        lng: gen.lng,
        value: undefined,
        rand: true
      } );
    }
    else if ( lat ) {
      setEntity( 'properties.baseLocation', {
        lat: lat,
        lng: lng,
        value: value,
        rand: false
      } );
      // delete lat and lng in order for "if" to work
      this.removeAttribute( 'lat' );
      this.removeAttribute( 'lng' );
    }
  }

  function handleRadioEntry() {
    const title = this.getAttribute( 'title' );
    const db = this.getAttribute( 'db' );
    const entry = this.getAttribute( 'value' );
    setEntity( db + '.' + title, entry );
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
        const inner = entity[db] ? entity[db][title] : undefined;
        return V.cN( {
          t: 'tr',
          h: [
            V.cN( {
              t: 'td',
              c: 'capitalize',
              h: V.i18n( title, 'user-profile', 'card entry' )
            } ),
            V.cN( editable ? setEditable( {
              t: 'td',
              c: 'txt-right',
              a: { title: title, db: db },
              h: inner
            } ) : {
              t: 'td',
              c: 'txt-right',
              h: inner
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
      auth: V.getCookie( 'last-active-uphrase' ).replace( /"/g, '' )
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
          html: entity.fullId,
        } )
      ]
    } );
  }

  function introCard() {
    const descr = entity.properties ? entity.properties.description : undefined;

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

  function preferredLangsCard() {
    const langs = entity.properties ? entity.properties.preferredLangs : undefined;

    if( langs || ( !langs && editable ) ) {
      const $innerContent = V.castNode( editable ? setEditable( {
        t: 'p',
        c: 'pxy',
        a: { title: 'preferredLangs', db: 'properties' },
        h: langs,
      } ) : {
        t: 'p',
        c: 'pxy',
        h: langs,
      } );
      return castCard( $innerContent, 'Preferred Languages' );
    }
    else {
      return '';
    }
  }

  function evmAddressCard() {
    const address = entity.evmCredentials ? entity.evmCredentials.address : undefined;
    if( address || ( !address && editable ) ) {
      const $innerContent = V.castNode( editable ? setEditable( {
        t: 'p',
        c: 'pxy fs-rr',
        a: { title: 'evm-address', db: 'evmCredentials' },
        h: address,
      } ) : {
        t: 'p',
        c: 'pxy fs-rr',
        h: address,
      } );
      return castCard( $innerContent, 'Ethereum address' );
    }
    else {
      return '';
    }
  }

  function locationCard() {
    const loc = entity.properties ? entity.properties.baseLocation || entity.properties.currentLocation : undefined;

    if( loc || ( !loc && editable ) ) {
      const $innerContent = V.cN( {
        t: 'table',
        c: 'w-full pxy',
        h: [V.cN( {
          t: 'tr',
          h: [
            V.cN( { t: 'td', c: 'capitalize', h: V.i18n( 'base location', 'user-profile', 'card entry' ) } ),
            V.castNode( editable ? {
              tag: 'input',
              i: 'user__loc',
              c: 'location__base pxy w-full txt-right',
              a: {
                value: loc
              },
              e: {
                focus: handleBaseLocationFocus,
                blur: handleBaseLocation
              }
            } : {
              t: 'p',
              c: 'location__base pxy txt-right',
              h: loc
            } ),
          ]
        } ),
        V.cN( {
          t: 'tr',
          h: [
            V.cN( { t: 'td', c: 'capitalize', h: V.i18n( 'current location', 'user-profile', 'card entry' ) } ),
            V.castNode( editable ? {
              tag: 'input',
              c: 'location__curr pxy w-full txt-right',
              a: {
                value: loc
              },
              e: {
                focus: handleBaseLocationFocus,
                // blur: handleBaseLocation
              }
            } : {
              t: 'p',
              c: 'location__curr pxy txt-right',
              h: loc
            } ),
          ]
        } ),
        V.cN( {
          t: 'tr',
          h: [
            V.cN( { t: 'td', c: 'capitalize', h: V.i18n( 'current UTC offset', 'user-profile', 'card entry' ) } ),
            V.cN( editable ? setEditable( {
              t: 'td',
              c: 'txt-right',
              a: { title: 'currentUTC', db: 'properties' },
              h: entity['properties'] ? entity['properties']['currentUTC'] : undefined
            } ) : {
              t: 'td',
              c: 'txt-right',
              h: entity['properties'] ? entity['properties']['currentUTC'] : undefined
            } ),
          ]
        } )
        ]
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
    const target = entity.properties ? entity.properties.target : undefined;

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

  function entityListCard( entity ) {
    const $innerContent = V.cN( {
      t: 'div',
      h: [
        V.cN( {
          t: 'h2',
          c: 'pxy font-bold fs-l',
          h: entity.fullId,
        } ),
        V.cN( {
          t: 'p',
          c: 'pxy',
          h: entity.private.uPhrase,
        } )
      ],
    } );
    return castCard( $innerContent, '' );
  }

  function appLanguageCard() {
    const appLang = entity.properties ? entity.properties.appLang ? entity.properties.appLang : 'en_US' : 'en_US';
    if( appLang || ( !appLang && editable ) ) {
      const $innerContent = V.cN( {
        t: 'div',
        c: 'app-lang-selector',
        h: [
          V.cN( {
            t: 'input',
            a: {
              type: 'radio',
              name: 'app-lang',
              value: 'en_US',
              title: 'appLang',
              db: 'properties',
              checked: appLang == 'en_US' ? true : false
            },
            k: handleRadioEntry
          } ),
          V.cN( {
            t: 'span',
            h: '🇬🇧'
          } ),
          V.cN( {
            t: 'input',
            a: {
              type: 'radio',
              name: 'app-lang',
              value: 'de_DE',
              title: 'appLang',
              db: 'properties',
              checked: appLang == 'de_DE' ? true : false
            },
            k: handleRadioEntry
          } ),
          V.cN( {
            t: 'span',
            h: '🇩🇪'
          } ),
        ]
      } );
      return castCard( $innerContent, 'App Language' );
    }
    else {
      return '';
    }
  }

  /* ====================== export ====================== */

  return {
    setData: setData,
    topcontent: topcontent,
    introCard: introCard,
    evmAddressCard: evmAddressCard,
    locationCard: locationCard,
    entityCard: entityCard,
    entityListCard: entityListCard,
    financialCard: financialCard,
    socialCard: socialCard,
    preferredLangsCard: preferredLangsCard,
    appLanguageCard: appLanguageCard,
  };

} )();
