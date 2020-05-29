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
      'padding-bottom': '137px'
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
      // 'height': 'var(--card-height)',
      'max-width': '360px',
      'flex-wrap': 'wrap'
    }
  } );

  function notFound( which ) {
    return V.setNode( {
      t: 'p',
      c: 'pxy',
      h: V.i18n( 'No ' + which + ' found', 'theme' )
    } );
  }

  function background() {
    return V.setNode( {
      tag: 'background',
      id: 'background',
      classes: 'background fixed w-screen',
      setStyle: {
        background: {
          'background': 'rgba(115,182,230,1)',
          'height': 'calc(var(--screen-height) - var(--page-position-closed))',
          'z-index': -2
        }
      }
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
    return V.setNode( {
      tag: 'feature',
      classes: 'feature fixed w-screen hidden',
      setStyle: {
        feature: {
          top: 'var(--page-position-top-selected)',
          height: 'calc(var(--screen-width) * (9 / 16))'
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
      html: V.setNode( {
        tag: 'ul',
        classes: 'flex items-center justify-end'
      } )
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
      html: V.setNode( {
        tag: 'div',
        classes: 'handle__bar rounded-full bkg-offblack',
        setStyle: {
          handle__bar: {
            'margin-left': 'auto',
            'margin-right': 'auto',
            'height': '4px',
            'width': '5%'
          }
        },
      } )
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

  function card( $cardContent, cardTitle ) {

    return V.setNode( {
      t: 'li',
      c: 'pxy min-w-360',
      h: V.setNode( {
        t: 'card',
        c: 'card__container flex card-shadow rounded bkg-white pxy',
        h: cardTitle ? [
          V.cN( { t: 'h2', c: 'w-full font-bold pxy', h: V.i18n( cardTitle, 'user-profile', 'card title' ) } ),
          $cardContent
        ] : $cardContent
      } )
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
      classes: 'page fixed w-screen bkg-white',
      setStyle: {
        page: {
          bottom: 0,
          height: 'var(--page-position-peek)'
        }
      },
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
    topContent: topContent
  };

} )();
