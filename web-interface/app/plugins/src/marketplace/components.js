const MarketplaceComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Marketplace Plugin
   *
   */

  'use strict';

  /* ================== event handlers ================== */

  function handleProfileDraw() {
    const path = this;
    V.setState( 'active', { navItem: path } );
    V.setBrowserHistory( path );
    Profile.draw( path );
  }

  function handleEditProfileDraw() {
    User.draw( this );
  }

  function handlePopup() {
    const pathOfOpen = V.getNode( '.popup-content' ) ?
      V.getNode( '.popup-content' ).firstChild ?
        V.getNode( '.popup-content' ).firstChild.getAttribute( 'path' ) : false : false;
    if ( pathOfOpen && pathOfOpen == this ) {
      V.setAnimation( '.popup', {
        opacity: 0
      }, { duration: 0.8 }, { delay: 0.5 } ).then( ()=>{
        V.setNode( '.popup-content', '' );
      } );
      return;
    }
    const cache = V.getCache( 'all' );
    if ( cache ) {
      const entities = cache.data;
      for ( let i = 0; i < entities.length; i++ ) {
        if ( entities[i].path == this ) {
          const descr = entities[i].properties.description;
          V.getNode( '.popup' ).style.opacity = 1;
          V.setNode( '.popup-content', '' );
          V.setNode( '.leaflet-popup-pane', '' );
          V.setNode( '.popup-content', V.cN( {
            t: 'div',
            a: { path: entities[i].path },
            h: [
              {
                t: 'p',
                c: 'pxy txt-center font-bold cursor-pointer',
                h: entities[i].fullId,
                k: handleProfileDraw.bind( entities[i].path )
              },
              castCircle( entities[i] ),
              {
                t: 'p',
                c: 'pxy fs-s capitalize txt-center',
                h: entities[i].role
              },
              {
                t: 'p',
                c: 'pxy fs-s cursor-pointer',
                h: descr ? descr.length > 170 ? descr.substr( 0, 170 ) + ' ...' : descr : '',
              }
            ]
          } ) );
          // V.getNode( '.popup-tip-container' ).style.left = ( e.target.getBoundingClientRect().left - 15 ) + 'px';
          break;
        }
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

    switch ( '2' /* cardData.profile.tag.charAt( 1 ) */ ) {
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
        style: `background:${backgr}; background-position: center center; background-size: cover;margin: 0 auto;`
      },
      h: {
        t: 'div',
        c: 'card__initials font-bold fs-xl txt-white',
        h: backgr.includes( 'url' ) ? '' : V.castInitials( circleData.profile.title )
      },
      e: {
        click: whichHandler == 'editable' ?
          handleEditProfileDraw.bind( circleData.path ) :
          whichHandler == 'popup' ?
            handlePopup.bind( circleData.path ) :
            handleProfileDraw.bind( circleData.path )
      }
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
            style: 'background:rgba(var(--black), 0.094);margin-left: 5px;' // border: 2px solid rgba(var(--brandPrimary), 1)
          },
          h: {
            t: 'div',
            c: 'card__initials font-bold fs-xxl txt-white',
            h: '+'
          },
          k: handleDrawPlusForm
        }
      }
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
        ]
      }
    } );
  }

  function entitiesPlaceholder() {
    return V.cN( {
      t: 'li',
      c: 'pxy',
      h: {
        t: 'smallcard',
        c: 'smallcard__container txt-center rounded bkg-white',
        h: V.cN( {
          t: 'div',
          c: 'circle-3 rounded-full animated-background',
          // a: {
          //   style: `background:${backgr}; background-position: center center; background-size: cover;margin: 0 auto;`
          // },
        } )
      }
    } );
  }

  function cardContent( cardData ) {
    cardData.properties ? null : cardData.properties = {};
    const $cardContentFrame = V.cN( {
      t: 'div',
      c: 'contents'
    } );

    const $topLeft = V.cN( {
      t: 'div',
      c: 'card__top-left flex justify-center items-center pxy',
      h: castCircle( cardData ),
      k: handleProfileDraw.bind( cardData.path )
    } );

    const $topRight = V.cN( {
      t: 'div',
      c: 'card__top-right flex items-center pxy',
      h: {
        t: 'h2',
        c: 'font-bold fs-l leading-snug cursor-pointer',
        h: cardData.fullId,
        k: handleProfileDraw.bind( cardData.path )
      }
    } );

    const $bottomLeft = V.cN( {
      t: 'div',
      c: 'card__bottom-left items-center pxy',
      h: cardData.properties && cardData.properties.target ? [
        {
          t: 'div',
          c: 'circle-2 flex justify-center items-center rounded-full border-shadow font-medium no-txt-select',
          h: cardData.properties && cardData.properties.target ? cardData.properties.target : '',
          k: handleProfileDraw.bind( cardData.path )
        },
        {
          t: 'p',
          c: 'card__unit fs-xxs',
          h: cardData.properties && cardData.properties.unit ? cardData.properties.unit : '',
        }
      ] : ''
    } );

    const $bottomRight = V.cN( {
      t: 'div',
      c: 'card__bottom-right pxy',
      h: [
        { t: 'p', c: 'pxy capitalize', h: cardData.profile.role },
        { t: 'p', c: 'pxy', h: cardData.properties && cardData.properties.description ? cardData.properties.description.substr( 0, 160 ) : '' },
        { t: 'p', c: 'pxy', h: cardData.properties && cardData.properties.baseLocation ? cardData.properties.baseLocation : '' }
      ],
      k: handleProfileDraw.bind( cardData.path )
    } );

    V.setNode( $cardContentFrame, [ $topLeft, $topRight, $bottomLeft, $bottomRight ] );

    return $cardContentFrame;

  }

  /* ====================== export ====================== */

  return {
    castCircle: castCircle,
    entitiesAddCard: entitiesAddCard,
    entitiesSmallCard: entitiesSmallCard,
    entitiesPlaceholder: entitiesPlaceholder,
    cardContent: cardContent,
  };

} )();
