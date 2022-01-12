const MarketplaceComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Marketplace Plugin
   *
   */

  'use strict';

  /* ================== event handlers ================== */

  function handleProfileDraw() {
    V.setState( 'active', { navItem: this.path } );
    V.setBrowserHistory( this.path );
    Profile.draw( this );
  }

  function handleEditProfileDraw() {
    User.draw( this );
  }

  function handlePopup() {
    const pu = V.getNode( '.popup-content' );
    const pathOfOpen = pu && pu.firstChild
      ? V.getNode( '.popup-content' ).firstChild.getAttribute( 'path' )
      : null;

    if (
      V.getState( 'page' ).height > V.getState( 'page' ).peek
      || ( pathOfOpen && pathOfOpen == this.path )
    ) {
      V.setBrowserHistory( this.path );
      Profile.draw( this );
      return;
    }

    drawPopup( this.path );

  }

  function handlePopupHover( e ) {
    e.stopPropagation();

    /* hover event is also triggered on touch (together with click), so do nothing on such devices */
    if ( V.getState( 'screen' ).width > 800 ) {
      drawPopup( this.path, 'hover' );
    }

  }

  function drawPopup( path, hover ) {
    const entity = V.getCache( 'highlights' ).data.find( item => item.path == path );
    if ( entity ) {
      V.setNode( '.leaflet-popup-pane', '' );
      V.setNode( '.popup-content', '' );
      V.setNode( '.popup-content', popupContent( entity ) );
      V.getNode( '.popup' ).style.opacity = 1;
      if ( hover ) {
        VMap.draw( [entity], { isHover: true } );
      }
    }
  }

  function handleDrawPlusForm() {
    Page.draw( { position: 'closed', reset: false, navReset: false } );
    Form.draw( V.getNavItem( 'active', 'serviceNav' ).use.form );
  }

  /* ================== private methods ================= */

  function castBackground( cardData ) {
    const sc = V.getState( 'screen' );
    const palette = ['rgba(' + sc.brandSecondary + ', 1)'];

    if ( cardData.thumbnail ) {
      const url = V.castEntityThumbnail( cardData.thumbnail ).src;
      return 'url(\'' + url + '\')';
    }
    else if ( cardData.images && cardData.images.thumbnail ) { // new model
      return 'url(\'' + cardData.images.thumbnail + '\')';
    }

    switch ( '2' /* cardData.tag.charAt( 1 ) */ ) {
    // case '1': return palette[0];
    case '2': return palette[0];
    case '3': return palette[1];
    // case '4': return palette[1];
    case '5': return palette[0];
    case '6': return palette[2];
    // case '7': return palette[2];
    case '8': return palette[0];
    case '9': return palette[3];
    }
  }

  /* ================  public components ================ */

  function castCircle( circleData, whichHandler ) {
    const backgr = castBackground( circleData );
    return V.cN( {
      t: 'div',
      c: 'circle-3 flex justify-center items-center rounded-full cursor-pointer',
      a: {
        style: `background:${backgr}; background-position: center center; background-size: cover;margin: 0 auto;`,
      },
      h: {
        t: 'div',
        c: 'card__initials font-bold fs-xl txt-white',
        h: backgr.includes( 'url' ) ? '' : V.castInitials( circleData.fullId ),
      },
      e: {
        click: whichHandler == 'editable' ?
          handleEditProfileDraw.bind( circleData ) :
          whichHandler == 'popup' ?
            handlePopup.bind( circleData ) :
            handleProfileDraw.bind( circleData ),
        mouseover: whichHandler == 'popup' ?
          handlePopupHover.bind( circleData ) : '',
      },
    } );
  }

  function entitiesAddCard() {
    return V.cN( {
      t: 'li',
      c: 'pxy flex items-center',
      h: {
        t: 'addcard',
        c: 'addcard__container txt-center rounded bkg-white',
        h: {
          t: 'div',
          c: 'circle-2 flex justify-center items-center rounded-full cursor-pointer',
          a: {
            style: 'background:rgba(var(--black), 0.11);margin-left: 5px;', // border: 2px solid rgba(var(--brandPrimary), 1)
          },
          h: {
            t: 'div',
            c: 'card__initials font-bold fs-xxl txt-white',
            h: '+',
          },
          k: handleDrawPlusForm,
        },
      },
    } );
  }

  function entitiesSmallCard( cardData ) {
    return V.cN( {
      t: 'li',
      c: 'pxy',
      h: {
        t: 'smallcard',
        c: 'smallcard__container flex flex-wrap justify-center items-center',
        h: [
          castCircle( cardData, 'popup' ),
        ],
      },
    } );
  }

  function entitiesPlaceholder( options ) {
    return V.cN( {
      t: 'li',
      c: 'pxy',
      h: {
        t: 'smallcard',
        c: 'smallcard__container txt-center rounded bkg-white',
        h: [
          {
            t: 'div',
            c: 'circle-3 rounded-full animated-background',
            y: {
              'margin-bottom': '20px',
            },
          // a: {
          //   style: `background:${backgr}; background-position: center center; background-size: cover;margin: 0 auto;`
          // },
          },
          {
            x: options ? options.showProgress : false,
            t: 'div',
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
        ],
      },
    } );
  }

  function cardContent( cardData ) {

    const text = cardData.properties
      ? cardData.properties.filteredDescription
        ? cardData.properties.filteredDescription
        : cardData.properties.description
          ? cardData.properties.description
          : false
      : false;

    const castDescr = V.castDescription( text );

    const $cardContentFrame = V.cN( {
      t: 'div',
      c: 'contents',
    } );

    const $topLeft = V.cN( {
      t: 'div',
      c: 'card__top-left flex justify-center items-center pxy',
      h: castCircle( cardData ),
      // k: handleProfileDraw.bind( { path: cardData.path, uuidE: cardData.uuidE } ),
    } );

    const $topRight = V.cN( {
      t: 'div',
      c: 'card__top-right flex items-center pxy',
      h: {
        t: 'h2',
        c: 'font-bold fs-l leading-snug cursor-pointer',
        h: cardData.fullId,
        k: handleProfileDraw.bind( cardData ),
      },
    } );

    const $bottomLeft = V.cN( {
      t: 'div',
      c: 'card__bottom-left items-center pxy',
      h: cardData.properties && cardData.properties.target ? [
        {
          t: 'div',
          c: 'circle-2 flex justify-center items-center rounded-full border-shadow font-medium no-txt-select',
          h: cardData.properties.target || '',
          k: handleProfileDraw.bind( cardData ),
        },
        {
          t: 'p',
          c: 'card__unit fs-xxs',
          h: cardData.properties.unit || '',
        },
      ] : '',
    } );

    const $bottomRight = V.cN( {
      t: 'div',
      c: 'card__bottom-right pxy',
      h: [
        { t: 'p', c: 'pxy capitalize', h: cardData.role },
        { x: text, t: 'p', c: 'pxy', h: castDescr.$intro },
        { t: 'p', c: 'pxy', h: cardData.geometry && cardData.geometry.baseLocation ? cardData.geometry.baseLocation : '' },
      ],
      k: handleProfileDraw.bind( cardData ),
    } );

    V.setNode( $cardContentFrame, [ $topLeft, $topRight, $bottomLeft, $bottomRight ] );

    return $cardContentFrame;

  }

  function popupContent( entity ) {
    // const descr = entity.properties && entity.properties.description ? V.castDescription(entity.properties.description) : undefined;
    // const filteredDescr = entity.properties && entity.properties.filteredDescription ? entity.properties.filteredDescription : undefined;
    // const text = filteredDescr ? filteredDescr : descr;

    const isPreview = entity.path ? false : true;

    const text = entity.properties
      ? entity.properties.filteredDescription
        ? entity.properties.filteredDescription
        : entity.properties.description
          ? entity.properties.description
          : false
      : false;

    const castDescr = V.castDescription( text );

    if ( isPreview ) {
      return V.cN( {
        t: 'div',
        i: entity.uuidE + '-map-popup',
        c: 'map-popup-inner flex justify-center',
        y: {
          'min-height': '320px',
        },
        h: entitiesPlaceholder( { showProgress: true } ),
      } );
    }
    else {
      return V.cN( {
        t: 'div',
        c: 'map-popup-inner',
        a: { path: entity.path },
        h: [
          {
            t: 'p',
            c: 'pxy txt-center font-bold cursor-pointer',
            h: entity.fullId,
            k: handleProfileDraw.bind( entity ),
          },
          castCircle( entity ),
          {
            t: 'p',
            c: 'pxy fs-s capitalize txt-center',
            h: entity.role,
          },
          {
            x: text,
            t: 'p',
            c: 'pxy fs-s break-words',
            h: castDescr.$intro,
          },
        ],
      } );
    }
  }

  /* ====================== export ====================== */

  return {
    castCircle: castCircle,
    entitiesAddCard: entitiesAddCard,
    entitiesSmallCard: entitiesSmallCard,
    entitiesPlaceholder: entitiesPlaceholder,
    cardContent: cardContent,
    popupContent: popupContent,
  };

} )();
