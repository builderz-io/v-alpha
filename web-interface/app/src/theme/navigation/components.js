const NavComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Navigation Components
   *
   */

  'use strict';

  function pill( item ) {
    const userOnlineIcon = '<svg class="pill--user-online txt-green" xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z"/></svg>'; // '<img class="filter-green" src="assets/icon/person-24px.svg" height="16px">';

    const pillOnline = item.o ? userOnlineIcon : '';

    return V.setNode( {
      tag: 'li',
      classes: 'pill flex justify-center items-center rounded-full bkg-white pill-shadow cursor-pointer no-txt-select whitespace-no-wrap',
      setStyle: {
        'pill': {
          'height': '2.5rem',
          'padding': '0 1.2rem',
          'margin-right': '0.7rem'
        },
        'pill--selected': {
          'color': 'rgba(var(--brand), 1)',
          'border': '2px solid rgba(var(--brand), 1)',
          'box-shadow': '0px -1px 3px 0px rgba(var(--brand),.50), 0px 1px 3px 0px rgba(var(--brand),.55)'
        },
        'pill--user-online': {
          position: 'relative',
          left: '-3px'
        }
      },
      attributes: {
        cid: item.cid,
        // role: item.role,
        // pagepos: item.p,
        // feature: item.f || 'none'
      },
      html: pillOnline + item.title
    } );

  }

  function entityNavUl() {
    return V.setNode( {
      tag: 'ul',
      classes: 'entity-nav__ul flex items-center font-medium fs-rr',
      setStyle: {
        'entity-nav__ul': {
          'padding-left': '3px' /* needed for selected shadow */
        }
      }
    } );
  }

  function serviceNavUl() {
    return V.setNode( {
      tag: 'ul',
      classes: 'service-nav__ul flex items-center font-medium',
      setStyle: {
        'service-nav__ul': {
          'padding-left': '3px' /* needed for selected shadow */
        }
      }
    } );
  }

  return {
    pill: pill,
    entityNavUl: entityNavUl,
    serviceNavUl: serviceNavUl
  };

} )();
