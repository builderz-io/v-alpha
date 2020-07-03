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
    },
    'pool__funding-pie': {
      'stroke-width': '50',
      'fill': '#ddd',
      'stroke': 'rgb(65, 183, 135)'
    },
    'pool__funding-chart': {
      'margin': '23px 0 0 4px',
      'transform': 'rotate(-90deg)',
      'border-radius': '50%',
      'display': 'block',
      'background': '#ddd',
    },
    'pool__spending-pie': {
      'stroke-width': '50',
      'fill': '#ddd',
      'stroke': 'rgb(99, 82, 185)'
    },
    'pool__spending-chart': {
      'margin': '23px 0 0 4px',
      'transform': 'rotate(-90deg)',
      'border-radius': '50%',
      'display': 'block',
      'background': '#ddd',
    }
  } );

  /* ============== user interface strings ============== */

  const
    strEdit = 'edit',
    strChgImg  = 'Change this image',
    strBaseLoc  = 'base location',
    strCurrLoc  = 'current location',
    strUTCOffset  = 'current UTC offset',
    strNotFunded = 'Not yet successfully funded',
    strSuccessFunded = 'Successfully funded',
    strNoneSpent = 'None yet spent',
    strSpent = 'Budget spent';

  function uiStr( string, description ) {
    return V.i18n( string, 'user components', description || 'card entry' ) + ' ';
  }

  /* ================== event handlers ================== */

  function handleEntryFocus() {
    DOM.entry = this.value ? this.value : this.innerHTML;
    if ( ['edit', 'not valid'].includes( DOM.entry )  ) {
      this.innerHTML = '';
      this.value = '';
    }
  }

  function handleEntry() {
    let str, entry;
    this.value ? str = this.value : str = this.innerHTML;
    str = V.stripHtml( str );
    const title = this.getAttribute( 'title' );
    const db = this.getAttribute( 'db' );

    if ( str != DOM.entry ) {
      if ( str == '' ) {
        this.innerHTML = 'edit';
        setEntity( db + '.' + title, '' );
        return;
      }

      if ( ['facebook', 'twitter', 'telegram'].includes( title ) ) {
        str = str.endsWith( '/' ) ? str.slice( 0, -1 ) : str;
        const split = str.split( '/' );
        entry = split.pop().replace( '@', '' );
      }
      else if ( title == 'email' ) {
        entry = str.includes( '@' ) ? str.includes( '.' ) ? str : 'not valid' : str == '' ? '' : 'not valid';
      }
      else if ( title == 'website' ) {
        entry = str.includes( '.' ) ? str : 'not valid';
      }
      else if ( ['address', 'evm'].includes( title ) ) {
        entry = str.includes( '0x' ) && str.length == 42 ? str : 'not valid';
      }
      else if ( title == 'currentUTC' ) {
        entry = isNaN( str ) ? 'not valid' : str;
      }
      else if ( title == 'description' ) {
        entry = str.length > 2000 ? 'not valid' : str;
      }
      else {
        entry = str;
      }

      if ( entry == 'not valid' ) {
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
    V.getNode( '.location__curr' ).value = this.value;

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

  function handleImageUpload( e ) {
    V.castImageUpload( e ).then( res => {
      if ( res.success ) {
        const aE = V.getState( 'activeEntity' );
        const auth = V.getCookie( 'last-active-uphrase' ).replace( /"/g, '' );
        const imageUpload = V.getState( 'imageUpload' );
        const tinyImageUpload = V.getState( 'tinyImageUpload' );
        Object.assign( imageUpload, { entity: aE.fullId } );
        Object.assign( tinyImageUpload, { entity: aE.fullId } );
        V.setEntity( aE.fullId, {
          field: 'thumbnail',
          data: imageUpload,
          auth: auth
        } ).then( () => {
          V.setEntity( aE.fullId, {
            field: 'tinyImage',
            data: tinyImageUpload,
            auth: auth
          } );
          V.setNode( '#img-upload-profile__label', uiStr( strChgImg ) );
          V.setNode( '#img-upload-profile__preview', '' );
          V.setNode( '#img-upload-profile__preview', V.cN( {
            t: 'img',
            y: {
              'max-width': '100%'
            },
            src: res.src
          } ) );
        } );
      }
    } );
  }

  /* ================== private methods ================= */

  function castCard( $innerContent, whichTitle ) {
    return CanvasComponents.card( $innerContent, whichTitle );
  }

  function castTableNode( titles, db, editable, css ) {
    const $table = V.cN( {
      t: 'table',
      c: 'w-full pxy',
      h: titles.map( title => {
        const inner = entity[db] ? entity[db][title] : undefined;

        const leftTd = {
          t: 'td',
          c: 'capitalize',
          h: uiStr( title )
        };

        const editTd = setEditable( {
          t: 'td',
          c: 'txt-right',
          a: { title: title, db: db },
          h: inner
        } );

        const noEditTd = {
          t: 'td',
          c: 'txt-right' + ( css ? ' ' + css : '' ),
          h: inner
        };

        let $row = V.cN( {
          t: 'tr',
          h: [
            leftTd,
            editable ? editTd : noEditTd,
          ]
        } );

        if ( !inner ) {
          $row = editable ? V.cN( {
            t: 'tr',
            h: [
              leftTd,
              editTd
            ]
          } ) : '';
        }

        return $row;

      } ).filter( item => {return item != ''} )
    } );

    return $table.firstChild ? $table : null;
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

  function handleViewKeyFocus( e ) {
    if ( this.type === 'password' ) {
      this.type = 'text';
      this.previousSibling.innerHTML = '';
      setTimeout( function() {
        e.target.setSelectionRange( 0, 9999 );
      }, 50 );
    }
    else {
      const selection = window.getSelection();
      selection.removeAllRanges();
      this.previousSibling.innerHTML = 'vx';
      this.type = 'password';
    }
  }

  function caseUphraseNode( uPhrase, css = '' ) {
    return V.cN( {
      t: 'div',
      c: 'pxy ' + css,
      h: [
        { t: 'span', h: 'vx' },
        {
          t: 'input',
          c: css,
          a: {
            value: uPhrase,
            type: 'password',
          },
          y: {
            width: '190px',
            padding: 0
          },
          e: {
            focus: handleViewKeyFocus,
            blur: handleViewKeyFocus,
          }
        }
      ]
    } );

  }

  function setData( data ) {
    entity = data.entity;
    editable = data.editable ? true : false;
  }

  function topcontent() {
    return V.cN( {
      t: 'div',
      h: {
        tag: 'h1',
        class: 'font-bold txt-center pxy',
        html: entity.fullId,
      }
    } );
  }

  function descriptionCard() {
    const descr = entity.properties ? entity.properties.description : undefined;

    if( descr || ( !descr && editable ) ) {
      const $innerContent = V.cN( editable ? {
        t: 'textarea',
        c: 'w-full pxy',
        a: { rows: '6', title: 'description', db: 'properties' },
        e: {
          focus: handleEntryFocus,
          blur: handleEntry
        },
        h: descr ? descr : 'edit',
      } : {
        t: 'div',
        c: 'pxy',
        h: V.castLinks( descr.replace( /\n/g, ' <br>' ) ).iframes,
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
      const $innerContent = V.cN( editable ? setEditable( {
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

  function uPhraseCard() {
    const uPhrase = entity.private.uPhrase;
    if( uPhrase ) {
      const $innerContent = caseUphraseNode( uPhrase );
      return castCard( $innerContent, 'Entity Management Key' );
    }
    else {
      return '';
    }
  }

  function evmAddressCard() {
    const address = entity.evmCredentials ? entity.evmCredentials.address : undefined;
    if( address ) {
      // const $innerContent = V.cN( {
      //   t: 'svg',
      //   a: {
      //     viewBox: '0 0 56 18'
      //   },
      //   h: `<text x="0" y="15">${address}</text>`,
      // } );
      const $innerContent = V.cN( {
        t: 'p',
        c: 'pxy fs-s',
        h: address,
      } );

      return castCard( $innerContent, 'Entity Ethereum Address' );
    }
    else {
      return '';
    }
  }

  function evmReceiverAddressCard() {
    let address = entity.evmCredentials ? entity.evmCredentials.address : undefined;

    /**
     * Overwrite address if another receivingAddress has been defined by user
     */

    entity.receivingAddresses ? entity.receivingAddresses.evm ? address = entity.receivingAddresses.evm : undefined : undefined;

    if( address || ( !address && editable ) ) {
      const $innerContent = V.cN( editable ? setEditable( {
        t: 'p',
        c: 'pxy fs-s',
        a: { title: 'evm', db: 'receivingAddresses' },
        h: address,
      } ) : {
        t: 'p',
        c: 'pxy fs-s',
        h: address,
      } );
      return castCard( $innerContent, 'Receiving Ethereum Address' );
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
        h: [
          {
            t: 'tr',
            h: [
              { t: 'td', c: 'capitalize', h: uiStr( strBaseLoc ) },
              editable ? {
                t: 'input',
                i: 'user__loc',
                c: 'location__base pxy w-full txt-right',
                a: { value: loc },
                e: {
                  focus: handleBaseLocationFocus,
                  blur: handleBaseLocation
                }
              } : {
                t: 'p',
                c: 'location__base pxy txt-right',
                h: loc
              },
            ]
          },
          {
            t: 'tr',
            h: [
              { t: 'td', c: 'capitalize', h: uiStr( strCurrLoc ) },
              editable ? {
                t: 'input',
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
              },
            ]
          },
          {
            t: 'tr',
            h: [
              { t: 'td', c: 'capitalize', h: uiStr( strUTCOffset ) },
              editable ? setEditable( {
                t: 'td',
                c: 'txt-right',
                a: { title: 'currentUTC', db: 'properties' },
                h: entity['properties'] ? entity['properties']['currentUTC'] : undefined
              } ) : {
                t: 'td',
                c: 'txt-right',
                h: entity['properties'] ? entity['properties']['currentUTC'] : undefined
              },
            ]
          }
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
    const $innerContent = castTableNode( titles, db, false, 'capitalize' );
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
    return $innerContent ? castCard( $innerContent, 'Social' ) : '';
  }

  function entityListCard( entity ) {
    const $innerContent = V.cN( {
      t: 'div',
      h: [
        {
          t: 'h2',
          c: 'pxy font-bold fs-l',
          h: entity.fullId,
        },
        caseUphraseNode( entity.private.uPhrase )
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
          {
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
          },
          {
            t: 'span',
            h: '🇬🇧'
          },
          {
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
          },
          {
            t: 'span',
            h: '🇩🇪'
          },
        ]
      } );
      return castCard( $innerContent, 'App Language' );
    }
    else {
      return '';
    }
  }

  function fundingStatusCard( sendVolume, receiveVolume ) {

    /**
     * this component has been ported from the first alpha version
     *
     */

    if ( entity.profile.role == 'pool' ) {

      const i18n = {
        strPfPg432: uiStr( strNotFunded ),
        strPfPg433: uiStr( strSuccessFunded ),
        strPfPg434: uiStr( strNoneSpent ),
        strPfPg435: uiStr( strSpent ),
      };

      let svgFunded = '';
      let svgSpent = '';
      let fundSuccess = i18n.strPfPg432;
      let budgetPercent = '', budgetUsed = i18n.strPfPg434;

      const funded = receiveVolume > 0 ? Math.floor( receiveVolume / entity.properties.target * 100 ) : 0;
      const spent = receiveVolume > 0 ? Math.ceil( ( sendVolume * ( 1 + V.getSetting( 'transactionFee' )/100**2 ) ) / receiveVolume * 100 ) : 0;

      if ( funded >= 0 ) {
        svgFunded = '<svg width="100" height="100" class="pool__funding-chart">\
               <circle r="25" cx="50" cy="50" class="pool__funding-pie" stroke-dasharray="' + Math.floor( 158 * ( funded / 100 ) ) + ' ' + ( 158 ) + '"/>\
             </svg>';
      }

      if ( funded > 66 ) {
        fundSuccess = '<span class="">' + i18n.strPfPg433 + '</span>';
      }

      if ( spent >= 0 ) {
        svgSpent = '<svg width="100" height="100" class="pool__spending-chart">\
      <circle r="25" cx="50" cy="50" class="pool__spending-pie" stroke-dasharray="' + Math.floor( 158 * ( spent / 100 ) ) + ' ' + ( 158 ) + '"/>\
      </svg>';
      }

      if ( spent > 0 ) {
        budgetUsed = '<span class="">' + i18n.strPfPg435 + '</span>';
        budgetPercent = '<span class="">' + spent + ' %</span>';
      }

      const $innerContent = V.cN( {
        t: 'table',
        c: 'w-full pxy',
        h: [
          {
            t: 'tr',
            h: [ { t: 'td', h: svgFunded }, { t: 'td', h: funded + ' %<br><br>' + fundSuccess } ]
          },
          {
            t: 'tr',
            h: [ { t: 'td', h: svgSpent }, { t: 'td', h: budgetPercent + '<br><br>' + budgetUsed } ]
          }
        ]
      } );

      return castCard( $innerContent, 'Funding Status' );
    }
    else {
      return '';
    }
  }

  function thumbnailCard() {
    if ( entity.thumbnail ) {
      const $img = V.castEntityThumbnail( entity.thumbnail ).img;
      return V.cN( {
        t: 'li',
        h: $img
      } );
      // return castCard( $img, '' );
    }
    else {
      return '';
    }
  }

  function addOrChangeImage() {
    let $innerContent;
    // const tinyImage = entity.tinyImage;
    const thumbnail = entity.thumbnail;

    if( thumbnail ) {
      const img = V.castEntityThumbnail( thumbnail ).img;
      $innerContent = V.castNode( {
        t: 'div',
        c: 'pxy',
        h: [
          {
            t: 'div',
            c: 'pxy',
            h: [
              {
                t: 'label',
                c: 'pxy',
                i: 'img-upload-profile__label',
                a: {
                  for: 'img-upload-profile__file',
                },
                h: uiStr( strChgImg )
              },
              {
                t: 'input',
                i: 'img-upload-profile__file',
                c: 'hidden',
                a: {
                  type: 'file',
                  accept: 'image/*'
                },
                e: {
                  change: handleImageUpload
                }
              }
            ]
          },
          {
            t: 'div',
            i: 'img-upload-profile__preview',
            h: img
          },
          // {
          //   t: 'p',
          //   h: 'Navigation Image Preview'
          // },
          // {
          //   t: 'div',
          //   h: V.castEntityThumbnail( tinyImage ).img
          // }
        ],
      } );
    }
    else {
      $innerContent = V.cN( {
        t: 'div',
        c: 'pxy',
        h: [
          {
            t: 'label',
            i: 'img-upload-profile__label',
            a: {
              for: 'img-upload-profile__file',
            },
            h: uiStr( strEdit )
          },
          {
            t: 'input',
            i: 'img-upload-profile__file',
            c: 'hidden',
            a: {
              type: 'file',
              accept: 'image/*'
            },
            e: {
              change: handleImageUpload
            }
          },
          {
            t: 'div',
            i: 'img-upload-profile__preview',
          }
        ]
      } );
    }

    return castCard( $innerContent, 'Image' );

  }

  /* ====================== export ====================== */

  return {
    handleViewKeyFocus: handleViewKeyFocus,
    caseUphraseNode: caseUphraseNode,
    setData: setData,
    topcontent: topcontent,
    descriptionCard: descriptionCard,
    uPhraseCard: uPhraseCard,
    evmAddressCard: evmAddressCard,
    evmReceiverAddressCard: evmReceiverAddressCard,
    locationCard: locationCard,
    entityCard: entityCard,
    entityListCard: entityListCard,
    financialCard: financialCard,
    socialCard: socialCard,
    preferredLangsCard: preferredLangsCard,
    appLanguageCard: appLanguageCard,
    fundingStatusCard: fundingStatusCard,
    thumbnailCard: thumbnailCard,
    addOrChangeImage: addOrChangeImage
  };

} )();
