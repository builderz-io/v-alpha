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
      'width': '300px',
      'padding': '25px 0',
    },
    'pool__funding-pie': {
      'stroke-width': '50',
      'fill': '#ddd',
      'stroke': 'rgb(65, 183, 135)',
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
      'stroke': 'rgb(99, 82, 185)',
    },
    'pool__spending-chart': {
      'margin': '23px 0 0 4px',
      'transform': 'rotate(-90deg)',
      'border-radius': '50%',
      'display': 'block',
      'background': '#ddd',
    },
    'td-right': {
      'max-width': '205px',
    },
    'share-by-email': {
      color: 'gray',
      position: 'relative',
      top: '-3px',
      left: '6px',
    },
    'toggle-switch__input': {
      height: 0,
      width: 0,
      visibility: 'hidden',
    },
    'toggle-switch': {
      'cursor': 'pointer',
      'text-indent': '-9999px',
      'width': '60px',
      'height': '25px',
      'background': 'grey',
      'display': 'block',
      'border-radius': '100px',
      'position': 'relative',
    },
    'toggle-switch:after': {
      'content': '\'\'',
      'position': 'absolute',
      'top': '3px',
      'left': '5px',
      'width': '26px',
      'height': '19px',
      'background': '#fff',
      'border-radius': '90px',
      'transition': '0.3s',
    },
    'toggle-switch__input:checked + .toggle-switch': {
      background: '#bada55',
    },
    'toggle-switch__input:checked + .toggle-switch:after': {
      left: 'calc(100% - 5px)',
      transform: 'translateX(-100%)',
    },
    'toggle-switch:active:after': {
      width: '130px',
    },
    'join-loc-picker__input-profile-view': {
      display: 'none',
    },
    'entity-mng-radio-wrapper': {
      'display': 'flex',
      'justify-content': 'space-around',
      'margin': '0.5rem',
      'width': '23rem',
    },
  } );

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      edit: 'edit',
      invalid: 'not valid',
      chgImg: 'Change this image',
      baseLoc: 'base location',
      currLoc: 'current location',
      UTCOffset: 'current UTC offset',

      title: 'Title',
      tag: 'Tag',

      description: 'Description',
      questionnaire: 'Questionnaire',
      shortened: '[ ... shortened ]',
      prefLang: 'Preferred Languages',
      lang: 'App Language',
      management: 'Entity Management',
      ethAddress: 'Entity Ethereum Address',
      ethAddressReceiver: 'Receiving Ethereum Address',
      loc: 'Location',
      entity: 'Entity',
      fin: 'Financial',
      social: 'Social',
      contact: 'Contact',
      img: 'Image',
      holder: 'Holder',
      holderOf: 'Holder of',
      mappedBy: 'Mapped by',
      accessKeys: 'Access Keys',
      notAuthenticated: 'not authorized to view',
      deactivated: 'activate',
      activated: 'activated',
      viewMode: 'edit',
      editMode: 'editing',

      emailSubject: 'Contacting you via',
      emailGreeting: 'Dear',

      share: 'share this profile on',
      socialSubject: 'is on',

      notPrivate: 'fully visible',
      private: 'not visible',
      pointVisible: 'point visible',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ================== event handlers ================== */

  function handleEditProfileDraw( e ) {
    const path = V.castPathOrId( e.target.textContent );
    User.draw( path );
  }

  function handleProfileDraw() {
    const path = V.castPathOrId( this.textContent );
    V.setState( 'active', { navItem: path } );
    V.setBrowserHistory( path );
    Profile.draw( path );
  }

  function handleBaseLocationFocus() {
    DOM.location = this.getAttribute( 'loc' );
  }

  function handleViewKeyFocus( e ) {
    if ( this.type === 'password' ) {
      this.type = 'text';
      this.previousSibling.textContent = '';
      setTimeout( function() {
        e.target.setSelectionRange( 0, 9999 );
      }, 50 );
    }
    else {
      const selection = window.getSelection();
      selection.removeAllRanges();
      this.previousSibling.textContent = this.value.length > 18 ? '0x' : this.value.length ? 'vx' : '';
      this.type = 'password';
    }
  }

  function handleEntryFocus() {

    const $list = V.getNode( 'list' );
    const $table = this.closest( 'table' );

    const offset = ( $table ? $table.offsetTop + this.offsetTop : this.offsetTop )
     - $list.getBoundingClientRect().height / 2;

    $list.scrollTo( {
      top: offset,
      behavior: 'smooth',
    } );

    DOM.entry = this.value ? this.value : this.textContent;
    if ( [ V.getString( ui.edit ), V.getString( ui.invalid ) ].includes( DOM.entry )  ) {
      this.textContent = '';
      this.value = '';
    }
  }

  function handleViewMode() {
    const data = {
      uuidE: V.getState( 'active' ).lastViewedUuidE,
      uuidP: V.getState( 'active' ).lastViewedUuidP,
      navReset: false,
    };
    this.checked
      ? User.draw( data )
      : Profile.draw( data );

  }

  function handlePrivacyRadioButton( e ) {
    setField( 'privacy', { privacy: e.target.value } );
  }

  /* ============ event handlers (edit entity) ========== */

  function handleActive() {
    setField( 'status.active', this.checked ? true : false ).then( () => {
      V.getNode( '.active__title' ).textContent = this.checked ? ui.activated : ui.deactivated;
    } );
  }

  function handleEntry() {
    let str, entry;
    this.nodeName == 'TEXTAREA' ? str = this.value : str = this.textContent;

    str = V.stripHtml( str );
    const title = this.getAttribute( 'title' );
    const db = this.getAttribute( 'db' );

    if ( str != DOM.entry ) {
      if ( str == '' ) {
        this.textContent = V.getString( ui.edit );
        this.value = V.getString( ui.edit );
        setField( db + '.' + title, '' );
        return;
      }

      if ( ['facebook', 'twitter', 'telegram', 'instagram', 'tiktok'].includes( title ) ) {
        str = str.endsWith( '/' ) ? str.slice( 0, -1 ) : str;
        const split = str.split( '/' );
        entry = split.pop().replace( '@', '' );
      }
      else if ( title == 'email' ) {
        const regex = new RegExp( /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ );
        entry = regex.test( str ) ? str : V.getString( ui.invalid );
      }
      else if ( title == 'youtube' ) {
        // must be a channel, not a video
        entry = str.includes( '/c/' ) ? str : V.getString( ui.invalid );
      }
      else if ( title == 'website' ) {
        entry = str.includes( '.' ) && str.includes( 'http' ) ? str : V.getString( ui.invalid );
      }
      else if ( ['address', 'evm'].includes( title ) ) {
        entry = str.includes( '0x' ) && str.length == 42 ? str : V.getString( ui.invalid );
      }
      else if ( title == 'currentUTC' ) {
        entry = isNaN( str ) ? V.getString( ui.invalid ) : str;
      }
      else if ( ['description', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'].includes( title ) ) {
        const words = str.split( ' ' );
        if ( words.length > 2000 ) {
          words.length = 2000;
          entry = words.join( ' ' ) + ' ' + V.getString( ui.shortened );
        }
        else {
          entry = words.join( ' ' );
        }
      }
      else {
        entry = str;
      }

      if ( entry == V.getString( ui.invalid ) ) {
        this.textContent = V.getString( ui.invalid );
        return;
      }
      else {
        this.textContent = entry;
      }
      setField( db + '.' + title, entry );
    }
  }

  function handleBaseLocation() {
    const lat = this.getAttribute( 'lat' );
    const lng = this.getAttribute( 'lng' );
    const loc = this.getAttribute( 'loc' );

    if ( DOM.location.length && loc == '' ) {
      setField( 'geometry.baseLocation', {
        loc: null,
      } );
    }
    else if ( lat ) {
      setField( 'geometry.baseLocation', {
        lat: lat,
        lng: lng,
        loc: loc,
      } ).then( res => {

        /** Draw the new map position */
        V.setState( 'active', {
          lastLngLat: res.data[0].n.a,
        } );

        if ( 'MongoDB' == V.getSetting( 'entityLedger' ) ) {
          VMap.draw( res.data );
        }
        if ( 'Firebase' == V.getSetting( 'entityLedger' ) && res.data[0] && res.data[0].n ) {

          /** Create GeoJSON object and mixin data from active entity */

          VMap.draw( [{
            isBaseLocationUpdate: true,
            uuidE: V.getState( 'active' ).lastViewedUuidE,
            uuidP: V.getState( 'active' ).lastViewedUuidP,
            role: V.getState( 'active' ).lastViewedRoleCode, // key has to be role here
            fullId: V.aE().fullId,
            path: V.aE().path,
            profile: {
              role: V.aE().role,
            },
            properties: {
              description: V.aE().properties.description,
            },
            images: {
              thumbnail: V.aE().images.thumbnail,
            },
            geometry: {
              coordinates: res.data[0].n.a,
              type: 'Point',
              rand: false,
            },
            type: 'Feature',
          }] );
        }
      } );
      // delete lat and lng in order for "if" to work
      this.removeAttribute( 'lat' );
      this.removeAttribute( 'lng' );
    }
  }

  function handleRadioEntry() {
    // const title = this.getAttribute( 'title' );
    // const db = this.getAttribute( 'db' );
    const entry = this.getAttribute( 'value' );
    // setField( db + '.' + title, entry );
    V.setLocal( 'locale', entry );
    setTimeout( function reloadAfterLangChange() {
      location = window.location.origin;
    }, 800 );
  }

  function handleImageUpload( e ) {
    V.castImageUpload( e ).then( res => {
      if ( res.success ) {
        if ( 'MongoDB' == V.getSetting( 'entityLedger' ) ) {
          setField( 'tinyImage', V.getState( 'tinyImageUpload' ) ).then( () => {
            setField( 'thumbnail', V.getState( 'thumbnailUpload' ) ).then( () => {
              setField( 'mediumImage', V.getState( 'mediumImageUpload' ) ).then( () => {
                V.setNode( '#img-upload-profile__label', V.getString( ui.chgImg ) );
                V.setNode( '#img-upload-profile__preview', '' );
                V.setNode( '#img-upload-profile__preview', V.cN( {
                  t: 'img',
                  y: {
                    'max-width': '100%',
                  },
                  r: res.src,
                } ) );
              } );
            } );
          } );
        }
        else if ( 'Firebase' == V.getSetting( 'entityLedger' ) ) {
          setField( 'images', {
            tiny: V.getState( 'tinyImageUpload' ),
            thumb: V.getState( 'thumbnailUpload' ),
            medium: V.getState( 'mediumImageUpload' ),
          } ).then( () => {

            Navigation.drawImage( {
              path: V.getState( 'active' ).path,
              images: { tinyImage: V.getState( 'tinyImageUpload' ).dataUrl },
            } );

            V.setNode( '#img-upload-profile__label', V.getString( ui.chgImg ) );
            V.setNode( '#img-upload-profile__preview', '' );
            V.setNode( '#img-upload-profile__preview', V.cN( {
              t: 'img',
              y: {
                'max-width': '100%',
              },
              r: V.getState( 'mediumImageUpload' ).dataUrl,
            } ) );
          } );
        }
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
        const inner = entity[db] ? entity[db][title] : false;
        let linkedInner;

        if ( inner ) {
          switch ( title ) {
          // case 'facebook':
          //   linkedInner = '<a href="https://facebook.com/' + inner + '">' + inner + '</a>';
          //   break;
          // case 'twitter':
          //   linkedInner = '<a href="https://twitter.com/' + inner + '">' + inner + '</a>';
          //   break;
          // case 'telegram':
          //   linkedInner = '<a href="https://t.me/' + inner + '">' + inner + '</a>';
          //   break;
          // case 'instagram':
          //   linkedInner = '<a href="https://www.instagram.com/' + inner + '">' + inner + '</a>';
          //   break;
          // case 'tiktok':
          //   linkedInner = '<a href="https://tiktok.com/@' + inner + '">' + inner + '</a>';
          //   break;
          // case 'youtube':
          //   linkedInner = '<a href="https://youtube.com/c/' + inner + '">' + inner + '</a>';
          //   break;
          case 'email':
            // linkedInner = `<a href="mailto:${ inner }?subject=${ V.getString( ui.emailSubject.replace( ' ', '%20' ) ) }%20${ window.location }&amp;body=${ V.getString( ui.emailGreeting.replace( ' ', '%20' ) ) }%20${ entity.title }">` + inner /* .replace( /@.+/, '' ) */ + '</a>';
            linkedInner = {
              t: 'a',
              f: `mailto:${ inner }?subject=${ V.getString( ui.emailSubject.replace( ' ', '%20' ) ) }%20${ window.location }&amp;body=${ V.getString( ui.emailGreeting.replace( ' ', '%20' ) ) }%20${ entity.title }`,
              h: inner,
            };
            break;
          // case 'website':
          //   linkedInner = V.castLinks( inner ).links;
          //   break;
          default:
            linkedInner = inner;
          }
        }

        return {
          x: inner || editable,
          t: 'tr',
          h: [
            {
              t: 'td',
              c: 'capitalize',
              h: V.getString( title ),
            },
            setEditable( {
              x: editable,
              t: 'td',
              c: 'td-right txt-right break-words',
              a: { title: title, db: db },
              h: inner,
            } ),
            {
              x: !editable,
              t: 'td',
              c: 'td-right txt-right break-words' + ( css ? ' ' + css : '' ),
              h: inner ? linkedInner : '',
            },
          ],
        };
      } ).filter( item => item != '' ),
    } );

    return $table.firstChild ? $table : null;
  }

  function setEditable( obj ) {
    obj.e = {
      focus: handleEntryFocus,
      blur: handleEntry,
    };
    if ( obj.a ) {
      Object.assign( obj.a, { contenteditable: 'true' } );
    }
    else {
      obj.a = { contenteditable: 'true' };
    }
    if ( !obj.h ) {
      obj.h = V.getString( ui.edit );
    }
    return obj;
  }

  function setField( field, data ) {
    return V.setEntity( V.getState( 'active' ).lastViewed, {
      field: field,
      data: data === '' ? null : data,
    } ).then( res => {
      if ( 'MongoDB' == V.getSetting( 'entityLedger' ) ) {

        /* also update caches after an edit */
        updateEntityInCaches( res );
      }
      if ( !res.success /*res.data && res.data[0].error */ ) {
        if ( res.message.includes( '-200' ) ) {
          Modal.draw( 'confirm uPhrase' );
        }
        else {
          Modal.draw( 'validation error', res.message );
        }
      }
      return res;
    } );
  }

  function updateEntityInCaches( response ) {
    ['managedEntities', 'preview', 'viewed'].forEach( cache => {
      if ( !V.getCache( cache ) ) {return}
      const index = V.getCache( cache ).data.findIndex( item => item.fullId == V.getState( 'active' ).lastViewed );
      V.getCache( cache ).data.splice( index, 1, response.data[0] );
    } );
  }

  /* ================== public methods ================== */

  function setData( data ) {
    entity = data.entity;
    editable = data.editable ? true : false;
  }

  function castAccessKeyNode( phrase, css = '' ) {
    return V.cN( {
      c: 'pxy fs-s' + css,
      h: [
        { t: 'span', h: phrase ? phrase.length > 18 ? '0x' : 'vx' : '' },
        {
          t: 'input',
          c: css,
          a: {
            value: phrase,
            type: 'password',
          },
          y: {
            width: '230px',
            padding: 0,
          },
          e: {
            focus: handleViewKeyFocus,
            blur: handleViewKeyFocus,
          },
        },
      ],
    } );

  }

  function topcontent() {
    return V.cN( {
      h: {
        tag: 'h1',
        class: 'font-bold txt-center pxy',
        html: entity.fullId,
      },
    } );
  }

  function descriptionCard() {
    const descr = entity.properties ? entity.properties.description : undefined;
    const filteredDescr = entity.properties ? entity.properties.filteredDescription : undefined;
    if( descr || ( !descr && editable ) ) {
      const castDescr = V.castDescription( filteredDescr || descr );
      const $innerContent = V.cN( editable ? {
        t: 'textarea',
        c: 'w-full pxy',
        a: { rows: '8', title: 'description', db: 'properties' },
        e: {
          focus: handleEntryFocus,
          blur: handleEntry,
        },
        h: descr ? descr : V.getString( ui.edit ),
      } : {
        c: 'pxy w-full',
        h: [
          castDescr.$feature,
          castDescr.$socialUl,
          castDescr.$description,
        ],
      } );
      return castCard( $innerContent, editable ? entity.role + ' ' + V.getString( ui.description ) : entity.role );
    }
    else {
      return '';
    }
  }

  function questionnaireCard() {
    const questions = V.getSetting( 'questionnaire' );

    if ( !questions ) { return '' }

    const responses = entity.questionnaire;

    let count = 0;

    for ( const question in responses ) {
      if ( responses.hasOwnProperty( question ) ) {
        responses[question] ? count += 1 : null;
      }
    }

    if ( ['Business', 'Institution'].includes( entity.role ) && ( count || editable ) ) {
      const $innerContent = V.cN( {
        h: questions.map( question => {
          const response = responses['q' + question.qid] || false;
          return V.cN( {
            h: [
              {
                x: editable || response,
                t: 'h3',
                c: 'font-bold pxy AAA',
                h: question.q,
              },
              {
                x: editable,
                t: 'textarea',
                c: 'w-full pxy BBB',
                a: { title: 'q' + question.qid, db: 'questionnaire' },
                e: {
                  focus: handleEntryFocus,
                  blur: handleEntry,
                },
                h: response ? response : V.getString( ui.edit ),
              },
              {
                x: !editable && response,
                c: 'pxy CCC',
                h: response, // V.castLinks( response ? response.replace( /\n/g, ' <br>' ) : '-' ).links,
              },
            ],
          } );
        } ),
      } );
      return castCard( $innerContent, V.getString( ui.questionnaire ) );
    }

    return '';

  }

  function preferredLangsCard() {
    const langs = entity.properties ? entity.properties.preferredLangs : undefined;

    if( langs || ( !langs && editable ) ) {
      const $innerContent = V.cN( editable ? setEditable( {
        t: 'p',
        c: 'pxy w-full',
        i: 'pref-lang-edit',
        a: { title: 'preferredLangs', db: 'properties' },
        h: langs,
      } ) : {
        t: 'p',
        c: 'pxy',
        h: langs,
      } );
      return castCard( $innerContent, V.getString( ui.prefLang ) );
    }
    else {
      return '';
    }
  }

  function managementCard() {
    if (
      V.aE()
      && (
        V.getLastViewed().holders.includes( V.aE().fullId ) // || // new model
        // V.aE().adminOf.includes( V.getState( 'active' ).lastViewed ) // previous model
      )
    ) {

      const active = entity.status.active;
      const priv = entity.privacy;
      // const $innerContent = V.cN( {} );

      const $inputRadioElem = V.cN( {
        c: 'entity-mng-radio-wrapper',
        h: [
          {
            t: 'input',
            c: 'entity-mng-input-radio',
            i: 'entity-mng-input-0',
            a: {
              type: 'radio',
              name: 'entity-mng',
              checked: !priv ? true : undefined,
            },
            e: {
              change: handlePrivacyRadioButton,
            },
            v: '0',
          },
          {
            t: 'label',
            c: 'entity-mng-input-radio-label',
            for: 'entity-mng-input-0',
            h: V.getString( ui.notPrivate ),
          },
          {
            t: 'input',
            c: 'entity-mng-input-radio',
            i: 'entity-mng-input-1',
            a: {
              type: 'radio',
              name: 'entity-mng',
              checked: priv == 1 ? true : undefined,
            },
            e: {
              change: handlePrivacyRadioButton,
            },
            v: '1',
          },
          {
            t: 'label',
            c: 'entity-mng-input-radio-label',
            for: 'entity-mng-input-1',
            h: V.getString( ui.private ),
          },
          {
            t: 'input',
            c: 'entity-mng-input-radio',
            i: 'entity-mng-input-2',
            a: {
              type: 'radio',
              name: 'entity-mng',
              checked: priv == 2 ? true : undefined,
            },
            e: {
              change: handlePrivacyRadioButton,
            },
            v: '2',
          },
          {
            t: 'label',
            c: 'entity-mng-input-radio-label',
            for: 'entity-mng-input-2',
            h: V.getString( ui.pointVisible ),
          },
        ],
      } );

      const $innerContent = V.cN( {
        h: [
          $inputRadioElem,
          {
            c: 'pxy flex ',
            h: [
              {
                t: 'input',
                i: 'active',
                c: 'toggle-switch__input',
                a: {
                  type: 'checkbox',
                  checked: active ? true : undefined,
                },
                e: {
                  change: handleActive,
                },
              },
              {
                t: 'label',
                c: 'toggle-switch',
                a: { for: 'active' },
                h: 'toggle',
              },
              {
                t: 'p',
                c: 'active__title fs-xs pxy',
                h: V.getString( active ? ui.activated : ui.deactivated ),
              },
            ],
          },
          {
            c: 'pxy flex ',
            h: [
              {
                t: 'input',
                i: 'view-mode',
                c: 'toggle-switch__input',
                a: {
                  type: 'checkbox',
                  checked: editable ? true : undefined,
                },
                e: {
                  change: handleViewMode,
                },
              },
              {
                t: 'label',
                c: 'toggle-switch',
                a: { for: 'view-mode' },
                h: 'toggle',
              },
              {
                t: 'p',
                c: 'active__title fs-xs pxy',
                h: V.getString( editable ? ui.editMode : ui.viewMode ),
              },
            ],
          },
        ],
      } );

      return castCard( $innerContent, V.getString( ui.management ) );
    }
    else {
      return '';
    }
  }

  function accessKeysCard() {
    const uPhrase = entity.auth ? entity.auth.uPhrase : undefined;
    const privateKey = entity.auth ? entity.auth.evmCredentials ? entity.auth.evmCredentials.privateKey || '' : '' : '';

    const $innerContent = V.cN( {} );

    if( uPhrase ) {
      V.setNode( $innerContent, V.cN( { h: castAccessKeyNode( uPhrase ) } ) );
    }
    else {
      V.setNode( $innerContent, V.cN( { c: 'pxy fs-s', h: V.getString( ui.notAuthenticated ) } ) );
    }
    if( privateKey ) {
      V.setNode( $innerContent, V.cN( { h: castAccessKeyNode( privateKey ) } ) );
    }
    return castCard( $innerContent, V.getString( ui.accessKeys ) );
  }

  function evmAddressCard() {
    const address = entity.evmCredentials ? entity.evmCredentials.address : undefined;
    if( address ) {
      // const $innerContent = V.cN( {
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

      return castCard( $innerContent, V.getString( ui.ethAddress ) );
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
        c: 'pxy fs-s w-full',
        a: { title: 'evm', db: 'receivingAddresses' },
        h: address,
      } ) : {
        t: 'p',
        c: 'pxy fs-s w-full',
        h: address,
      } );
      return castCard( $innerContent, V.getString( ui.ethAddressReceiver ) );
    }
    else {
      return '';
    }
  }

  function locationCard() {
    const loc = entity.geometry
      ? entity.geometry.baseLocation == 'picked location'
        ? 'Lat ' + entity.geometry.coordinates[1] + ' Lng ' + entity.geometry.coordinates[0]
        : entity.geometry.baseLocation
      : undefined;

    if( loc || ( !loc && editable ) ) {
      const $innerContent = V.cN( {
        c: 'location-card-wrapper w-full',
        h: [
          {
            c: 'join-loc-picker__map',
          },
          {
            t: 'input',
            c: 'join-loc-picker__input-profile-view',
          },
          V.cN( {
            c: 'w-full pxy',
            y: {
              'display': 'flex',
              'justify-content': 'space-between',
            },
            h: [
              { t: 'span', c: 'capitalize', h: V.getString( ui.baseLoc ) },
              editable ? {
                t: 'input',
                i: 'user__loc',
                c: 'location__base w-full txt-right',
                a: {
                  loc: loc,
                  placeholder: 'Test',
                },
                e: {
                  focus: handleBaseLocationFocus,
                  blur: handleBaseLocation,
                },
              } : {
                t: 'span',
                c: 'location__base txt-right',
                h: loc,
              },
            ],
          } ),
        ],
      } );
      return castCard( $innerContent, V.getString( ui.loc ) );
    }
    else {
      return '';
    }
  }

  function entityCard() {
    // const titles = ['title', 'tag' /*, 'role' */];
    // const db = 'profile';
    // const $innerContent = castTableNode( titles, db, false, 'capitalize' );
    // const holders = V.castJson( entity.holders, 'clone' );
    // holders.splice( holders.indexOf( entity.fullId ), 1 );

    const descr = entity.properties ? entity.properties.description : undefined;
    const filteredDescr = entity.properties ? entity.properties.filteredDescription : undefined;

    const $innerContent = V.cN( {
      t: 'table',
      c: 'is-single-entity-view pxy w-full',
      h: [
        {
          t: 'tr',
          h: [
            {
              t: 'td',
              h: V.getString( ui.title ),
            },
            setEditable( {
              x: editable,
              t: 'td',
              c: 'txt-right',
              h: entity.title,
              a: { title: 'title', db: 'profile' },
            } ),
            {
              x: !editable,
              t: 'td',
              c: 'txt-right',
              h: entity.title,
            },
          ],
        },
        {
          t: 'tr',
          h: [
            {
              t: 'td',
              h: V.getString( ui.tag ),
            },
            {
              t: 'td',
              c: 'txt-right',
              h: entity.tag,
            },
          ],
        },
        // {
        //   t: 'tr',
        //   h: [
        //     {
        //       t: 'td',
        //     },
        //     {
        //       t: 'td',
        //       c: 'txt-right',
        //       h: entity.role,
        //     },
        //   ],
        // },
        {
          // x: holders.length >= 1,
          x: entity.holders[0] != entity.fullId,
          t: 'tr',
          h: [
            {
              t: 'td',
              h: entity.role == 'Person' ? V.getString( ui.mappedBy ) : V.getString( ui.holder ),
            },
            {
              t: 'td',
              c: 'txt-right cursor-pointer',
              h: entity.holders.join( ' & ' ),
              k: handleProfileDraw,
            },
          ],
        },
      ],
    } );

    // get holders into view
    // const holders = V.castJson( entity.holders, 'clone' );
    // holders.splice( holders.indexOf( entity.fullId ), 1 );
    // let $holders;
    // if (
    //   holders.length
    // ) {
    //   $holders = V.cN( {
    //     t: 'table',
    //     c: 'pxy w-full',
    //     h: {
    //       t: 'tr',
    //       h: [
    //         {
    //           t: 'td',
    //           h: V.getString( ui.holder ),
    //         },
    //         {
    //           t: 'td',
    //           c: 'txt-right cursor-pointer',
    //           h: holders.join( ' & ' ),
    //           k: handleProfileDraw,
    //         },
    //       ],
    //     },
    //   } );
    // }
    // else {
    //   $holders = '';
    // }
    // const $combined = V.cN( { c: 'w-full' } );
    // V.setNode( $combined, [$innerContent, $holders] );

    return castCard( $innerContent,
      editable || descr || filteredDescr
        ? V.getString( ui.entity )
        : V.getString( entity.role ),
    );
  }

  function holderOfCard() {
    // const holderOf = V.castJson( entity.holderOf, 'clone' );
    // holderOf.splice( holderOf.indexOf( entity.fullId ), 1 );

    if ( !entity.holderOf.length ) {
      return '';
    }

    const $innerContent = V.cN( {
      h: entity.holderOf.map( item => V.cN( {
        t: 'p',
        c: 'pxy',
        y: {
          cursor: 'pointer',
        },
        h: item.fullId,
        k: handleProfileDraw,
      } ) ),
    } );
    return castCard( $innerContent, V.getString( ui.holderOf ) );
  }

  function financialCard() {
    const target = entity.properties ? entity.properties.target : undefined;

    if( target || ( !target && editable ) ) {
      const titles = ['target', 'unit'];
      const db = 'properties';
      const $innerContent = castTableNode( titles, db, editable );
      return castCard( $innerContent, V.getString( ui.fin ) );
    }
    else {
      return '';
    }
  }

  function socialCard() {
    const titles = ['email' /*'facebook', 'twitter', 'telegram', 'instagram', 'tiktok', 'youtube', 'website', */];
    const db = 'properties';
    const $innerContent = castTableNode( titles, db, editable );
    return $innerContent ? castCard( $innerContent, V.getString( ui.contact ) ) : '';
  }

  function entityListCard( entity ) {
    const uPhrase = entity.auth ? entity.auth.uPhrase : '';
    const privateKey = entity.auth ? entity.auth.evmCredentials ? entity.auth.evmCredentials.privateKey || '' : '' : '';

    const $cardContentFrame = V.cN( {
      c: 'contents',
    } );

    const $topLeft = V.cN( {
      c: 'card__top-left flex flex-wrap justify-center items-center pxy',
      h: [
        MarketplaceComponents.castCircle( entity, 'editable' ),
        {
          t: 'p',
          c: 'pxy fs-s font-bold capitalize cursor-pointer',
          h: entity.role,
        },
      ],
    } );

    const $topRight = V.cN( {
      c: 'card__top-right items-center pxy',
      h: [
        {
          t: 'h2',
          c: 'pxy font-bold fs-l cursor-pointer',
          h: entity.fullId,
          k: handleEditProfileDraw,
        },
        {
          t: 'p',
          c: 'pxy fs-s capitalize',
          h: V.getString( ui.accessKeys ),
        },
        castAccessKeyNode( uPhrase ),
        castAccessKeyNode( privateKey ),
      ],
    } );

    V.setNode( $cardContentFrame, [ $topLeft, $topRight ] );

    return castCard( $cardContentFrame, '' );

  }

  function appLanguageCard() {
    const appLang = VTranslation.getAppLocale();
    if( appLang || ( !appLang && editable ) ) {
      const $innerContent = V.cN( {
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
              checked: appLang == 'en_US' ? true : undefined,
            },
            k: handleRadioEntry,
          },
          {
            t: 'span',
            h: '🇬🇧',
          },
          {
            t: 'input',
            a: {
              type: 'radio',
              name: 'app-lang',
              value: 'de_DE_du',
              title: 'appLang',
              db: 'properties',
              checked: appLang == 'de_DE_du' ? true : undefined,
            },
            k: handleRadioEntry,
          },
          {
            t: 'span',
            h: '🇩🇪 "Du"',
          },
          {
            t: 'input',
            a: {
              type: 'radio',
              name: 'app-lang',
              value: 'de_DE_sie',
              title: 'appLang',
              db: 'properties',
              checked: appLang == 'de_DE_sie' ? true : undefined,
            },
            k: handleRadioEntry,
          },
          {
            t: 'span',
            h: '🇩🇪 "Sie"',
          },
        ],
      } );
      return castCard( $innerContent, V.getString( ui.lang ) );
    }
    else {
      return '';
    }
  }

  function mediumImageCard() {
    if ( entity.mediumImage ) {
      const $img = V.castEntityThumbnail( entity.mediumImage  ).img;
      return V.cN( {
        t: 'li',
        h: $img,
      } );
      // return castCard( $img, '' );
    }
    else if ( entity.images.mediumImage ) { // new model
      return V.cN( {
        y: {
          'display': 'flex',
          'justify-content': 'center',
          'min-height': '20vh',
          'max-height': '20vh',
          'background-image': `url(${ entity.images.mediumImage })`,
          'background-repeat': 'no-repeat',
          'background-position': 'center',
        },
        // h: {
        //   t: 'img',
        //   r: entity.images.mediumImage,
        // },
      } );
    }
    else {
      return '';
    }
  }

  function roleCard() {
    return V.cN( {
      c: 'pxy',
      h: {
        t: 'h3',
        c: 'pxy txt-center capitalize',
        h: entity.role,
      },
    } );
  }

  function addOrChangeImage() {
    let $innerContent;

    if( entity.mediumImage || ( entity.images && entity.images.mediumImage ) ) {
      // const img = V.castEntityThumbnail( entity.mediumImage ).img;
      $innerContent = V.cN( {
        c: 'pxy',
        h: [
          {
            i: 'img-upload-profile__preview',
            h: entity.mediumImage
              ? V.castEntityThumbnail( entity.mediumImage ).img
              : {
                t: 'img',
                y: {
                  'max-width': '100%',
                },
                r: entity.images.mediumImage,
              },
          },
          {
            c: 'pxy txt-right',
            h: [
              {
                t: 'label',
                c: 'pxy',
                i: 'img-upload-profile__label',
                a: {
                  for: 'img-upload-profile__file',
                },
                h: V.getString( ui.chgImg ),
              },
              {
                t: 'input',
                i: 'img-upload-profile__file',
                c: 'hidden',
                a: {
                  type: 'file',
                  accept: 'image/*',
                },
                e: {
                  change: handleImageUpload,
                },
              },
            ],
          },
          // {
          //   t: 'p',
          //   h: 'Navigation Image Preview'
          // },
          // {
          //   h: V.castEntityThumbnail( tinyImage ).img
          // }
        ],
      } );
    }
    else {
      $innerContent = V.cN( {
        c: 'pxy',
        h: [
          {
            t: 'label',
            i: 'img-upload-profile__label',
            a: {
              for: 'img-upload-profile__file',
            },
            h: V.getString( ui.edit ),
          },
          {
            t: 'input',
            i: 'img-upload-profile__file',
            c: 'hidden',
            a: {
              type: 'file',
              accept: 'image/*',
            },
            e: {
              change: handleImageUpload,
            },
          },
          {
            i: 'img-upload-profile__preview',
          },
        ],
      } );
    }

    return castCard( $innerContent, V.getString( ui.img ) );

  }

  function socialShareButtons() {
    // https://sharingbuttons.io/
    const subject = ( `${entity.title}%20${ V.getString( ui.socialSubject ) }${ window.location.hostname }` ).replace( /\s/g, '%20' ); // getString adds a whitespace
    const profileLink = `https%3A%2F%2F${ window.location.hostname + entity.path}`;
    // const activeUserLink = V.aE() ? '%20%20%20%20My%20Profile:%20https%3A%2F%2F' + window.location.hostname + V.aE().path : '';

    return V.cN( {
      c: 'w-screen',
      h: [
        {
          t: 'p',
          c: 'pxy fs-s txt-center',
          h: V.getString( ui.share ),
        },
        {
          y: {
            'display': 'flex',
            'justify-content': 'space-evenly',
          },
          s: {
            'sharing-button__icon svg': {
              'width': '1em',
              'height': '1em',
              'margin-right': '1.4em',
            },
            'sharing-button__icon--solid': {
              fill: 'rgba(var(--brandPrimary), 1)',
            },
          },
          h: [
            {
              link: `https://facebook.com/sharer/sharer.php?u=${ profileLink }`,
              icon: 'M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z',
            },
            {
              link: `https://twitter.com/intent/tweet/?text=${ subject }&url=${ profileLink }`,
              icon: 'M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z',
            },
            {
              link: `https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2F${ window.location.hostname }&amp;title=${ subject }&amp;summary=${ subject }&amp;source=${ profileLink }`,
              icon: 'M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z',
            },
            {
              link: `https://telegram.me/share/url?text=${ subject }&url=${ profileLink }`,
              icon: 'M.707 8.475C.275 8.64 0 9.508 0 9.508s.284.867.718 1.03l5.09 1.897 1.986 6.38a1.102 1.102 0 0 0 1.75.527l2.96-2.41a.405.405 0 0 1 .494-.013l5.34 3.87a1.1 1.1 0 0 0 1.046.135 1.1 1.1 0 0 0 .682-.803l3.91-18.795A1.102 1.102 0 0 0 22.5.075L.706 8.475z',
            },
          ]
            .map( network => ( {
              t: 'a',
              c: 'inline-block pxy',
              f: network.link,
              a: {
                target: '_blank',
                rel: 'noopener',
              },
              h: {
                c: 'pxy',
                h: {
                  c: 'sharing-button__icon sharing-button__icon--solid',
                  h: {
                    svg: true,
                    a: {
                      viewBox: '0 0 24 24',
                    },
                    h: {
                      t: 'path',
                      a: {
                        d: network.icon,
                      },
                    },
                  },
                },
              },
            } ) )
            .concat( [
              V.cN( {
                t: 'a',
                y: {
                  'display': 'flex',
                  'align-items': 'center',
                },
                c: 'share-by-email inline-block pxy font-bold',
                f: `mailto:?subject=${ subject }&body=Profile:%20${ profileLink }`, // optionally add ${ activeUserLink }
                h: '@',
              } ),
            ] ),
        },
      ],
    } );
  }

  function entityPlaceholderCard() {

    const $cardContentFrame = V.cN( {
      c: 'placeholder',
    } );

    // is-single-entity-view is used to check whether to place highlights into the page

    const $top = V.cN( {
      c: 'is-single-entity-view animated-background',
      y: {
        'height': '20px',
        'width': '200px',
        'border-radius': '4px',
        'margin': '0 0 10px 0',
      },
    } );

    const $mid = V.cN( {
      c: 'animated-background',
      y: {
        'height': '20px',
        'width': '100px',
        'border-radius': '4px',
        'margin': '0 0 10px 0',
      },
    } );

    const $bottom = V.cN( {
      c: 'animated-background',
      y: {
        'height': '20px',
        'width': '180px',
        'border-radius': '4px',
      },
    } );

    V.setNode( $cardContentFrame, [ $top, $mid, $bottom ] );

    return $cardContentFrame;

  }

  function entityPlaceholderImage() {
    // thanks to Justin Bellefontaine https://codepen.io/artboardartisan/pen/VLzKVN
    return V.cN( {
      c: 'animated-background',
      y: {
        width: '100%',
        height: '300px',
      },
      h: {
        c: 'progress-bar',
        h: {
          t: 'span',
          c: 'bar',
          h: {
            t: 'span',
            c: 'progress',
          },
        },
      },
    } );
  }

  /*
  <a class="share-by-email font-bold" href="mailto:?subject=${ entity.fullId }%20is%20on%20${ window.location.hostname }&amp;
   body=Profile%20Link:%20%3Ca+href%3D%22${ window.location.hostname }${entity.paths.entity}%22%3E${ window.location.hostname }${entity.paths.entity}%3C%2Fa%3E
   <br/><br/>My%20Profile%20Link:%3Ca+href%3D%22${entity.fullId}%22%3E${entity.fullId}%3C%2Fa%3E">@</a>
*/
  /* ====================== export ====================== */

  return {
    setData: setData,
    castAccessKeyNode: castAccessKeyNode,
    topcontent: topcontent,
    descriptionCard: descriptionCard,
    questionnaireCard: questionnaireCard,
    managementCard: managementCard,
    accessKeysCard: accessKeysCard,
    evmAddressCard: evmAddressCard,
    evmReceiverAddressCard: evmReceiverAddressCard,
    locationCard: locationCard,
    entityCard: entityCard,
    holderOfCard: holderOfCard,
    entityListCard: entityListCard,
    financialCard: financialCard,
    socialCard: socialCard,
    preferredLangsCard: preferredLangsCard,
    appLanguageCard: appLanguageCard,
    mediumImageCard: mediumImageCard,
    roleCard: roleCard,
    addOrChangeImage: addOrChangeImage,
    socialShareButtons: socialShareButtons,
    entityPlaceholderCard: entityPlaceholderCard,
    entityPlaceholderImage: entityPlaceholderImage,
  };

} )();
