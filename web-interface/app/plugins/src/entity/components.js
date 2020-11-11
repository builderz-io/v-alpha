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

  const ui = {
    edit: 'edit',
    invalid: 'not valid',
    chgImg: 'Change this image',
    baseLoc: 'base location',
    currLoc: 'current location',
    UTCOffset: 'current UTC offset',
    notFunded: 'Not yet successfully funded',
    successFunded: 'Successfully funded',
    noneSpent: 'None yet spent',
    spent: 'Budget spent',

    description: 'Description',
    prefLang: 'Preferred Languages',
    lang: 'App Language',
    uPhrase: 'Entity Management Key',
    ethAddress: 'Entity Ethereum Address',
    ethAddressReceiver: 'Receiving Ethereum Address',
    loc: 'Location',
    entity: 'Entity',
    fin: 'Financial',
    social: 'Social',
    funding: 'Funding Status',
    img: 'Image'
  };

  function getString( string, scope ) {
    return V.i18n( string, 'profile', scope || 'profile cards content' ) + ' ';
  }

  /* ================== event handlers ================== */

  function handleTitleClick( e ) {
    User.draw( V.castPathOrId( e.target.innerHTML ) );
  }

  function handleBaseLocationFocus() {
    DOM.location = this.value;
  }

  function handleEntryFocus() {
    DOM.entry = this.value ? this.value : this.innerHTML;
    if ( [getString( ui.edit ), getString( ui.invalid )].includes( DOM.entry )  ) {
      this.innerHTML = '';
      this.value = '';
    }
  }

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
      this.previousSibling.innerHTML = this.value.length > 18 ? '0x' : this.value.length ? 'vx' : '';
      this.type = 'password';
    }
  }

  /* ============ event handlers (edit entity) ========== */

  function handleEntry() {
    let str, entry;
    this.value ? str = this.value : str = this.innerHTML;
    str = V.stripHtml( str );
    const title = this.getAttribute( 'title' );
    const db = this.getAttribute( 'db' );

    if ( str != DOM.entry ) {
      if ( str == '' ) {
        this.innerHTML = getString( ui.edit );
        setField( db + '.' + title, '' );
        return;
      }

      if ( ['facebook', 'twitter', 'telegram'].includes( title ) ) {
        str = str.endsWith( '/' ) ? str.slice( 0, -1 ) : str;
        const split = str.split( '/' );
        entry = split.pop().replace( '@', '' );
      }
      else if ( title == 'email' ) {
        entry = str.includes( '@' ) ? str.includes( '.' ) ? str : getString( ui.invalid ) : str == '' ? '' : getString( ui.invalid );
      }
      else if ( title == 'website' ) {
        entry = str.includes( '.' ) ? str : getString( ui.invalid );
      }
      else if ( ['address', 'evm'].includes( title ) ) {
        entry = str.includes( '0x' ) && str.length == 42 ? str : getString( ui.invalid );
      }
      else if ( title == 'currentUTC' ) {
        entry = isNaN( str ) ? getString( ui.invalid ) : str;
      }
      else if ( title == 'description' ) {
        entry = str.length > 2000 ? getString( ui.invalid ) : str;
      }
      else {
        entry = str;
      }

      if ( entry == getString( ui.invalid ) ) {
        this.innerHTML = getString( ui.invalid );
        return;
      }
      else {
        this.innerHTML = entry;
      }
      setField( db + '.' + title, entry );
    }
  }

  function handleBaseLocation() {
    const lat = this.getAttribute( 'lat' );
    const lng = this.getAttribute( 'lng' );
    const value = this.value;
    V.getNode( '.location__curr' ).value = this.value;

    if ( DOM.location.length && value == '' ) {
      const gen = V.castRandLatLng();
      setField( 'properties.baseLocation', {
        lat: gen.lat,
        lng: gen.lng,
        value: undefined,
        rand: true
      } );
    }
    else if ( lat ) {
      setField( 'properties.baseLocation', {
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
    setField( db + '.' + title, entry );
  }

  function handleImageUpload( e ) {
    V.castImageUpload( e ).then( res => {
      if ( res.success ) {
        const fullId = V.getState( 'active' ).lastViewed; // V.aE().fullId;
        const imageUpload = V.getState( 'imageUpload' );
        const tinyImageUpload = V.getState( 'tinyImageUpload' );
        Object.assign( imageUpload, { entity: fullId } );
        Object.assign( tinyImageUpload, { entity: fullId } );
        setField( 'thumbnail', imageUpload ).then( () => {
          setField( 'tinyImage', tinyImageUpload );
          V.setNode( '#img-upload-profile__label', getString( ui.chgImg ) );
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
          h: getString( title )
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
      obj.h = getString( ui.edit );
    }
    return obj;
  }

  function setField( field, data ) {
    return V.setEntity( V.getState( 'active' ).lastViewed /* V.aE().fullId */, {
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

  function castUphraseNode( phrase, css = '' ) {
    return V.cN( {
      t: 'div',
      c: 'pxy ' + css,
      h: [
        { t: 'span', h: phrase.length > 18 ? '0x' : phrase.length ? 'vx' : '' },
        {
          t: 'input',
          c: css,
          a: {
            value: phrase,
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
        h: descr ? descr : getString( ui.edit ),
      } : {
        t: 'div',
        c: 'pxy',
        h: V.castLinks( descr.replace( /\n/g, ' <br>' ) ).iframes,
      } );
      return castCard( $innerContent, getString( ui.description ) );
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
        i: 'pref-lang-edit',
        a: { title: 'preferredLangs', db: 'properties' },
        h: langs,
      } ) : {
        t: 'p',
        c: 'pxy',
        h: langs,
      } );
      return castCard( $innerContent, getString( ui.prefLang ) );
    }
    else {
      return '';
    }
  }

  function uPhraseCard() {
    const uPhrase = entity.private.uPhrase;
    if( uPhrase ) {
      const $innerContent = castUphraseNode( uPhrase );
      return castCard( $innerContent, getString( ui.uPhrase ) );
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

      return castCard( $innerContent, getString( ui.ethAddress ) );
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
      return castCard( $innerContent, getString( ui.ethAddressReceiver ) );
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
              { t: 'td', c: 'capitalize', h: getString( ui.baseLoc ) },
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
              { t: 'td', c: 'capitalize', h: getString( ui.currLoc ) },
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
              { t: 'td', c: 'capitalize', h: getString( ui.UTCOffset ) },
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
      return castCard( $innerContent, getString( ui.loc ) );
    }
    else {
      return '';
    }
  }

  function entityCard() {
    const titles = ['title', 'tag' /*, 'role' */];
    const db = 'profile';
    const $innerContent = castTableNode( titles, db, false, 'capitalize' );

    // get owner into view
    let $ownerTable;
    if (
      entity.profile.title != entity.owners[0].ownerName &&
      entity.profile.tag != entity.owners[0].ownerTag
    ) {
      entity.firstOwner = entity.owners[0];
      const owners = ['ownerName', 'ownerTag'];
      const db2 = 'firstOwner';
      $ownerTable = castTableNode( owners, db2, false, 'capitalize' );
    }
    else {
      $ownerTable = '';
    }
    const $combined = V.cN( { t: 'div', c: 'w-full' } );
    V.setNode( $combined, [$innerContent, $ownerTable] );

    return castCard( $combined, getString( ui.entity ) );
  }

  function financialCard() {
    const target = entity.properties ? entity.properties.target : undefined;

    if( target || ( !target && editable ) ) {
      const titles = ['target', 'unit'];
      const db = 'properties';
      const $innerContent = castTableNode( titles, db, editable );
      return castCard( $innerContent, getString( ui.fin ) );
    }
    else {
      return '';
    }
  }

  function socialCard() {
    const titles = ['facebook', 'twitter', 'telegram', 'website', 'email'];
    const db = 'social';
    const $innerContent = castTableNode( titles, db, editable );
    return $innerContent ? castCard( $innerContent, getString( ui.social ) ) : '';
  }

  function entityListCard( entity ) {
    const uPhrase = entity.private.uPhrase;
    const privateKey = entity.private.evmCredentials ? entity.private.evmCredentials.privateKey ? entity.private.evmCredentials.privateKey : '' : '';
    const $innerContent = V.cN( {
      t: 'div',
      h: [
        {
          t: 'h2',
          c: 'pxy font-bold fs-l cursor-pointer',
          h: entity.fullId,
          k: handleTitleClick
        },
        // {
        //   t: 'p',
        //   c: 'pxy',
        //   h: entity.properties.description,
        // },
        castUphraseNode( uPhrase ),
        castUphraseNode( privateKey )
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
      return castCard( $innerContent, getString( ui.lang ) );
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
        strPfPg432: getString( ui.notFunded ),
        strPfPg433: getString( ui.successFunded ),
        strPfPg434: getString( ui.noneSpent ),
        strPfPg435: getString( ui.spent ),
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

      return castCard( $innerContent, getString( ui.funding ) );
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

  function roleCard() {
    return V.cN( {
      t: 'div',
      c: 'pxy',
      h: {
        t: 'h3',
        c: 'pxy txt-center capitalize',
        h: entity.profile.role
      }
    } );
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
                h: getString( ui.chgImg )
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
            h: getString( ui.edit )
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

    return castCard( $innerContent, getString( ui.img ) );

  }

  function socialShareButtons() {
    return V.cN( {
      t: 'div',
      c: 'pxy',
      h: [
        {
          t: 'p',
          c: 'pxy fs-s txt-center',
          h: 'share this profile on'
        },
        {
          t: 'div',
          s: {
            'sharing-button__icon svg': {
              'width': '1em',
              'height': '1em',
              'margin-right': '1.4em'
            },
            'sharing-button__icon--solid': {
              fill: 'rgba(var(--brandPrimary), 1)'
            }
          },
          h: `

      <a class="inline-block pxy" href="https://facebook.com/sharer/sharer.php?u=https%3A%2F%2F${ window.location.hostname }${entity.paths.entity}" target="_blank" rel="noopener" aria-label="">
        <div class="pxy"><div aria-hidden="true" class="sharing-button__icon sharing-button__icon--solid">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>
          </div>
        </div>
      </a>

      <a class="inline-block pxy" href="https://twitter.com/intent/tweet/?text=Found%20this%20on%20${ window.location.hostname }&amp;url=https%3A%2F%2F${ window.location.hostname }${entity.paths.entity}" target="_blank" rel="noopener" aria-label="">
        <div class="pxy"><div aria-hidden="true" class="sharing-button__icon sharing-button__icon--solid">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/></svg>
          </div>
        </div>
      </a>

      <a class="inline-block pxy" href="https://www.linkedin.com/shareArticle?mini=true&amp;url=https%3A%2F%2F${ window.location.hostname }&amp;title=Found%20this%20on%20${ window.location.hostname }&amp;summary=Found%20this%20on%20${ window.location.hostname }&amp;source=https%3A%2F%2F${ window.location.hostname }${entity.paths.entity}" target="_blank" rel="noopener" aria-label="">
        <div class="pxy"><div aria-hidden="true" class="sharing-button__icon sharing-button__icon--solid">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z"/></svg>
          </div>
        </div>
      </a>

      <a class="inline-block pxy" href="https://telegram.me/share/url?text=Found%20this%20on%20${ window.location.hostname }&amp;url=https%3A%2F%2F${ window.location.hostname }${entity.paths.entity}" target="_blank" rel="noopener" aria-label="">
        <div class="pxy"><div aria-hidden="true" class="sharing-button__icon sharing-button__icon--solid">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M.707 8.475C.275 8.64 0 9.508 0 9.508s.284.867.718 1.03l5.09 1.897 1.986 6.38a1.102 1.102 0 0 0 1.75.527l2.96-2.41a.405.405 0 0 1 .494-.013l5.34 3.87a1.1 1.1 0 0 0 1.046.135 1.1 1.1 0 0 0 .682-.803l3.91-18.795A1.102 1.102 0 0 0 22.5.075L.706 8.475z"/></svg>
          </div>
        </div>
      </a>

 `
        }]
    } );
  }

  /* ====================== export ====================== */

  return {
    setData: setData,
    castUphraseNode: castUphraseNode,
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
    roleCard: roleCard,
    addOrChangeImage: addOrChangeImage,
    socialShareButtons: socialShareButtons
  };

} )();
