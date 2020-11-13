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
      'padding-bottom': '160px'
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
      width: '100%'
    },
    'card__container': {
      'max-width': '360px',
      'flex-wrap': 'wrap'
    },
    'background': {
      'background': 'rgba(211,232,235,1)',
      // 'background': 'rgba(115,182,230,1)',
      'height': '100vh', // 'calc(var(--screen-height) - var(--page-position-closed))',
      'z-index': -2
    },
    'haze': {
      'top': 0,
      'height': '45vh',
      'z-index': -1
    },
    'handle': {
      'padding-top': '12px',
      'height': '26px',
      'display': 'block'
    },
    'handle__bar': {
      'margin-left': 'auto',
      'margin-right': 'auto',
      'height': '4px',
      'width': '5%',
      'max-width': '40px'
    },
    'page': {
      bottom: 0,
      height: 'var(--page-position-peek)',
    },
    'network-logo': {
      height: '18px',
    }
  } );

  /* ============== user interface strings ============== */

  const ui = {
    transaction: 'No transactions found',
    message: 'No messages found',
    entity: 'No entities found',
    marketplace: 'No marketplace items found',
    media: 'No media items found',
    close: 'close'
  };

  function getString( string, scope ) {
    return V.i18n( string, 'canvas', scope || 'not found' ) + ' ';
  }

  /* ================== event handlers ================== */

  function handleClosePopup() {
    V.setNode( '.leaflet-popup-pane', '' );
    if ( V.getNode( '.popup' ) ) {
      V.setAnimation( '.popup', {
        opacity: 0
      }, { duration: 0.8 }, { delay: 0.5 } ).then( ()=>{
        V.setNode( '.popup-content', '' );
      } );
    }
  }

  /* ================  public components ================ */

  function notFound( which ) {
    return V.setNode( {
      t: 'p',
      c: 'pxy',
      h: getString( ui[which] )
    } );
  }

  function background() {
    return V.setNode( {
      t: 'background',
      id: 'background',
      k: handleClosePopup,
      c: 'background fixed w-screen'
    } );
  }

  function haze() {
    return V.setNode( {
      t: 'haze',
      c: 'haze fixed w-screen bkg-white hidden'
    } );
  }

  function feature() {
    const dimensions = V.getState( 'page' ).featureDimensions;
    return V.setNode( {
      t: 'feature',
      c: 'feature fixed hidden',
      setStyle: {
        feature: {
          top: 'var(--page-position-top-selected)',
          height: dimensions.height + 'px', // 'calc(var(--screen-width) * (9 / 16))'
          width: dimensions.width + 'px'
        },
      }
    } );
  }

  function balance() {
    const sc = V.getState( 'screen' );

    return V.setNode( {
      t: 'balance',
      c: 'balance fixed cursor-pointer txt-anchor-mid',
      y: sc.width > 800 ? { top: '12px', left: '12px' } : { top: '2px', left: '2px' }
    } );
  }

  function interactions() {
    const sc = V.getState( 'screen' );

    return V.setNode( {
      t: 'interactions',
      c: 'interactions fixed',
      s: {
        interactions: {
          top: sc.width > 800 ? '23px' : '11px',
          right: 0,
          width: '45%'
        },
      },
      h: {
        t: 'ul',
        c: 'flex items-center justify-end'
      }
    } );
  }

  function handle() {
    return V.setNode( {
      t: 'handle',
      c: 'handle',
      h: {
        t: 'div',
        c: 'handle__bar rounded-full bkg-offblack'
      }
    } );
  }

  function topSlider() {
    return V.setNode( {
      t: 'topslider'
    } );
  }

  function slider() {
    return V.castNode( {
      t: 'slider',
      c: 'flex overflow-x-scroll list-none pb-s'
    } );
  }

  function listings() {
    return V.setNode( {
      t: 'listings'
    } );
  }

  function list( which ) {

    const $list = V.setNode( {
      t: 'list',
      c: 'list flex flex-wrap content-start justify-evenly overflow-y-scroll list-none h-full',
    } );

    if ( which == 'narrow' ) {
      $list.style['max-width'] = '380px';
      $list.style.margin = '0 auto';
    }

    return $list;
  }

  function card( $cardContent, cardTitle, id ) {

    return V.setNode( {
      t: 'li',
      c: 'pxy w-screen max-w-380',
      i: id,
      h: {
        t: 'card',
        c: 'card__container flex card-shadow rounded bkg-white pxy',
        h: cardTitle ? [
          { t: 'h2', c: 'w-full font-bold pxy', h: cardTitle },
          $cardContent
        ] : $cardContent
      }
    } );
  }

  function header() {
    return V.setNode( {
      t: 'header',
    } );
  }

  function page() {
    return V.setNode( {
      t: 'page',
      c: 'page fixed w-screen bkg-white pill-shadow overflow-hidden'
    } );
  }

  function content() {
    return V.setNode( {
      t: 'content'
    } );
  }

  function topContent() {
    return V.setNode( {
      t: 'topcontent'
    } );
  }

  function logo() {
    return V.cN( {
      t: 'logo',
      c: 'fixed hidden w-screen',
      k: handleClosePopup,
      h: {
        t: 'div',
        c: 'popup',
        // k: handleClosePopup,
        h: [
          {
            t: 'div',
            c: 'popup-content-wrapper flex flex-wrap justify-center items-center',
            h: [
              // {
              //   t: 'p',
              //   c: 'popup-content-close fs-xxs',
              //   h: getString( ui.close )
              // },
              {
                t: 'div',
                c: 'popup-content'
              }
            ]
          },
          {
            t: 'div',
            c: 'popup-tip-container',
            h: {
              t: 'div',
              c: 'popup-tip'
            }
          }
        ]
      }
    } );
  }

  function networkLogo() {
    return V.cN( {
      t: 'img',
      c: 'network-logo',
      src: '/assets/img/builderz-logo.png'
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
    networkLogo: networkLogo
  };

} )();
