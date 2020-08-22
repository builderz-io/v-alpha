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
    'page': {
      'bottom': 0,
      'height': 'var(--page-position-peek)',
      'z-index': 9999,
      // 'max-height': 'calc(100vh - var(--page-position-top-selected))'
    },
    'network-logo': {
      height: '25px',
    }
  } );

  /* ============== user interface strings ============== */

  const ui = {
    transaction: 'No transactions found',
    message: 'No messages found',
    entity: 'No entities found',
    marketplace: 'No marketplace items found',
    media: 'No media items found',
  };

  function getString( string, scope ) {
    return V.i18n( string, 'canvas', scope || 'not found' ) + ' ';
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
      tag: 'background',
      id: 'background',
      classes: 'background fixed w-screen',
      setStyle: {
        background: {
          'background': 'rgba(211,232,235,1)',
          // 'background': 'rgba(115,182,230,1)',
          'height': '100vh', // 'calc(var(--screen-height) - var(--page-position-closed))',
          'z-index': -2
        }
      },
      // h: `<div class="preloader">
      //       <div class="preloader__ring"></div>
      //       <loader class="preloader__text">Loading Map<loader>
      //     </div>`
    } );
  }

  function haze() {
    return V.setNode( {
      tag: 'haze',
      classes: 'haze fixed w-screen bkg-white hidden',
      setStyle: {
        haze: {
          'top': 0,
          'height': '45vh',
          'z-index': -1
        }
      }
    } );
  }

  function feature() {
    const dimensions = V.getState( 'page' ).featureDimensions;
    return V.setNode( {
      tag: 'feature',
      classes: 'feature fixed hidden',
      setStyle: {
        feature: {
          top: 'var(--page-position-top-selected)',
          height: dimensions.height + 'px', // 'calc(var(--screen-width) * (9 / 16))'
          width: dimensions.width + 'px'
        }
      }
    } );
  }

  function balance() {
    const sc = V.getState( 'screen' );

    return V.setNode( {
      tag: 'balance',
      classes: 'balance fixed cursor-pointer txt-anchor-mid',
      y: sc.width > 800 ? { top: '12px', left: '12px' } : { top: '2px', left: '2px' }
    } );
  }

  function interactions() {
    const sc = V.getState( 'screen' );

    return V.setNode( {
      tag: 'interactions',
      classes: 'interactions fixed',
      setStyle: {
        interactions: {
          top: sc.width > 800 ? '23px' : '11px',
          right: 0,
          width: '45%'
        }
      },
      html: {
        tag: 'ul',
        classes: 'flex items-center justify-end'
      }
    } );
  }

  function handle() {
    return V.setNode( {
      tag: 'handle',
      classes: 'handle',
      setStyle: {
        handle: {
          'padding-top': '12px',
          'height': '26px',
          'display': 'block'
        }
      },
      html: {
        tag: 'div',
        classes: 'handle__bar rounded-full bkg-offblack',
        setStyle: {
          handle__bar: {
            'margin-left': 'auto',
            'margin-right': 'auto',
            'height': '4px',
            'width': '5%',
            'max-width': '40px'
          }
        },
      }
    } );
  }

  function topSlider() {
    return V.setNode( {
      tag: 'topslider'
    } );
  }

  function slider() {
    return V.castNode( {
      tag: 'slider',
      classes: 'flex overflow-x-scroll list-none pb-s'
    } );
  }

  function listings() {
    return V.setNode( {
      tag: 'listings'
    } );
  }

  function list( which ) {

    const $list = V.setNode( {
      tag: 'list',
      classes: 'list flex flex-wrap content-start justify-evenly overflow-y-scroll list-none h-full',
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
      tag: 'header',
    } );
  }

  function page() {
    return V.setNode( {
      tag: 'page',
      classes: 'page fixed w-screen bkg-white pill-shadow overflow-hidden'
    } );
  }

  function content() {
    return V.setNode( {
      tag: 'content'
    } );
  }

  function topContent() {
    return V.setNode( {
      tag: 'topcontent'
    } );
  }

  function networkLogo() {
    return V.cN( {
      t: 'logo',
      c: 'fixed hidden',
      h: {
        t: 'img',
        c: 'network-logo',
        src: '/assets/img/builderz-logo.png'
      }
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
    networkLogo: networkLogo
  };

} )();
