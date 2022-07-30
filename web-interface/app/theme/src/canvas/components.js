const CanvasComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module for canvas components
   *
   */

  'use strict';

  const cardLeftWidth = 25;

  V.setStyle( {

    /* Cross-browser bottom list padding */
    'list > *:last-child': {
      'padding-bottom': '160px',
    },
    'card__top-left': {
      width: cardLeftWidth + '%',
    },
    'card__bottom-left': {
      'display': 'grid',
      'justify-items': 'center',
      'text-align': 'center',
      'width': cardLeftWidth + '%',
    },
    'card__top-right': {
      width: 100 - cardLeftWidth - 6 + '%',
    },
    'card__bottom-right': {
      width: 100 - cardLeftWidth - 6 + '%',
    },
    'card__unit': {
      width: '100%',
    },
    'card__container': {
      // 'max-width': '360px',
      'flex-wrap': 'wrap',
    },
    'background': {
      'background': 'rgba(211,232,235,1)',
      // 'background': 'rgba(115,182,230,1)',
      'height': '100vh', // 'calc(var(--screen-height) - var(--page-position-closed))',
      'z-index': -2,
    },
    'haze': {
      'top': 0,
      'height': '45vh',
      'z-index': -1,
    },
    'handle': {
      'padding-top': '12px',
      'height': '26px',
      'display': 'block',
    },
    'handle__bar': {
      'margin-left': 'auto',
      'margin-right': 'auto',
      'height': '4px',
      'width': '5%',
      'max-width': '40px',
    },
    'page': {
      bottom: 0,
      height: 'var(--page-position-peek)',
    },
    'page-full-screen': {
      top: 0,
      bottom: '0 !important',
      height: 'unset !important',
    },
    'network-logo': {
      height: '18px',
    },
  } );

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      transaction: 'No transactions found',
      message: 'No messages found',
      entity: 'No entities found',
      marketplace: 'No items found',
      media: 'No media items found',
      close: 'close',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ================== event handlers ================== */

  function handleClosePopup() {
    V.setNode( '.leaflet-popup-pane', '' );
    if ( V.getVisibility( '.popup' ) ) {
      V.setAnimation( '.popup', {
        opacity: 0,
      }, { duration: 0.8 }, { delay: 0.5 } ).then( ()=>{
        V.setNode( '.popup-content', '' );
      } );
    }
  }

  /* ================  public components ================ */

  function notFound( which ) {
    return V.cN( {
      t: 'p',
      c: 'pxy',
      h: V.getString( ui[which] ),
    } );
  }

  function background() {
    return V.cN( {
      t: 'background',
      i: 'background',
      c: 'background fixed w-screen',
      k: handleClosePopup,
    } );
  }

  function haze() {
    return V.cN( {
      t: 'haze',
      c: 'haze fixed w-screen bkg-white hidden',
    } );
  }

  function feature() {
    const dimensions = V.getState( 'page' ).featureDimensions;
    return V.cN( {
      t: 'feature',
      c: 'feature fixed hidden',
      s: {
        feature: {
          top: 'var(--page-position-top-selected)',
          height: dimensions.height + 'px', // 'calc(var(--screen-width) * (9 / 16))'
          width: dimensions.width + 'px',
          background: 'white',
        },
      },
    } );
  }

  function balance() {
    const sc = V.getState( 'screen' );

    return V.cN( {
      t: 'balance',
      c: 'balance fixed cursor-pointer txt-anchor-mid',
      y: sc.width > 800 ? { top: '12px', left: '12px' } : { top: '2px', left: '2px' },
    } );
  }

  function interactions() {
    const sc = V.getState( 'screen' );

    return V.cN( {
      t: 'interactions',
      c: 'interactions fixed',
      s: {
        interactions: {
          top: sc.width > 800 ? '23px' : '11px',
          right: 0,
          width: '45%',
        },
      },
      h: {
        t: 'ul',
        c: 'flex items-center justify-end',
      },
    } );
  }

  function handle() {
    return V.cN( {
      t: 'handle',
      c: 'handle',
      h: {
        c: 'handle__bar rounded-full bkg-offblack',
      },
    } );
  }

  function topSlider() {
    return V.cN( {
      t: 'topslider',
    } );
  }

  function slider() {
    return V.cN( {
      t: 'slider',
      c: 'flex overflow-x-scroll list-none pb-s',
    } );
  }

  function listings() {
    return V.cN( {
      t: 'listings',
    } );
  }

  function list( which ) {

    const $list = V.cN( {
      t: 'list',
      c: 'list flex flex-wrap content-start justify-evenly overflow-y-scroll list-none h-full',
    } );

    if ( which == 'narrow' ) {
      // $list.style['max-width'] = '380px';
      // $list.style.margin = '0 auto';
    }

    return $list;
  }

  function card( $cardContent, cardTitle, id ) {

    return V.cN( {
      t: 'li',
      c: 'pxy w-screen max-w-list zero-auto',
      i: id,
      h: {
        t: 'card',
        c: 'card__container max-w-list flex card-shadow rounded bkg-white pxy',
        h: cardTitle ? [
          { t: 'h2', c: 'w-full font-bold pxy', h: cardTitle },
          $cardContent,
        ] : $cardContent,
      },
    } );
  }

  function header() {
    return V.cN( {
      t: 'header',
      c: 'absolute',
    } );
  }

  function page() {
    return V.cN( {
      t: 'page',
      c: 'page fixed w-screen bkg-white pill-shadow overflow-hidden',
    } );
  }

  function content() {
    return V.cN( {
      t: 'content',
    } );
  }

  function topContent() {
    return V.cN( {
      t: 'topcontent',
    } );
  }

  function logo() {
    return V.cN( {
      t: 'logo',
      c: 'fixed hidden w-screen',
      k: handleClosePopup,
      h: {
        c: 'popup',
        // k: handleClosePopup,
        h: [
          {
            c: 'popup-content-wrapper flex flex-wrap justify-center items-center',
            h: [
              // {
              //   t: 'p',
              //   c: 'popup-content-close fs-xxs',
              //   h: V.getString( ui.close )
              // },
              {
                c: 'popup-content',
              },
            ],
          },
          {
            c: 'popup-tip-container',
            h: {
              c: 'popup-tip',
            },
          },
        ],
      },
    } );
  }

  function networkLogo() {
    return V.cN( {
      t: 'img',
      c: 'network-logo',
      r: V.getSetting( 'logo' ),
    } );
  }

  /* ====================== export ====================== */

  return {
    notFound: notFound,
    background: background,
    haze: haze,
    feature: feature,
    balance: balance,
    interactions: interactions,
    handle: handle,
    topSlider: topSlider,
    slider: slider,
    listings: listings,
    list: list,
    card: card,
    header: header,
    page: page,
    content: content,
    topContent: topContent,
    logo: logo,
    networkLogo: networkLogo,
    handleClosePopup: handleClosePopup,
  };

} )();
