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

  function setData( data ) {
    entity = data.entity;
    editable = data.editable ? true : false;
  }

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

      }
      else {
        this.innerHTML = entry;
        const aE = V.getState( 'activeEntity' );
        V.setEntity( aE.fullId, {
          // endpoint: 'update',
          field: db + '.' + title,
          data: entry
        } );
      }
    }
  }

  function card( $innerContent, whichTitle ) {
    return CanvasComponents.card( $innerContent, whichTitle );
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

  function locationCard() {
    const $innerContent = V.castNode( {
      tag: 'p',
      c: 'pxy',
      html: `${entity.properties.location}`
    } );
    return card( $innerContent, 'Location' );
  }

  function entityCard() {
    const data = entity.profile;
    const $innerContent = V.castNode( {
      tag: 'p',
      c: 'pxy',
      html: data.title
    } );
    return card( $innerContent, 'Entity' );
  }

  function financialCard() {
    const data = entity.properties;
    const $innerContent = V.castNode( {
      tag: 'p',
      c: 'pxy',
      html: data.target,
      a: editable ? { contenteditable: 'true' } : {},
    } );
    return card( $innerContent, 'Financial' );
  }

  function introCard() {
    const data = entity.properties.description;
    const $innerContent = V.castNode( setEditable( {
      t: 'p',
      c: 'pxy',
      h: data,
    } ) );
    return card( $innerContent, 'Introduction' );
  }

  function socialCard() {
    const titles = ['facebook', 'twitter', 'telegram', 'website', 'email'];
    const db = 'social';
    const $innerContent = V.cN( {
      t: 'table',
      c: 'w-full pxy',
      h: titles.map( title => {
        return V.cN( {
          t: 'tr',
          h: [
            V.cN( { t: 'td', c: 'capitalize', h: title } ),
            V.cN( setEditable( {
              t: 'td',
              c: 'txt-right',
              a: { title: title, db: db },
              h: entity.social ? entity.social[title] : undefined
            } ) ),
          ]
        } );
      } )
    } );
    return card( $innerContent, 'Social' );
  }

  return {
    setData: setData,
    topcontent: topcontent,
    entityCard: entityCard,
    introCard: introCard,
    locationCard: locationCard,
    socialCard: socialCard,
    financialCard: financialCard
  };

} )();
