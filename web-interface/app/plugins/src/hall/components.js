const HallComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Hall Plugin
   *
   */

  'use strict';

  V.setStyle( {
    'iframe-wrapper': {
      'position': 'relative',
      'padding-bottom': '56.25%',
    },
    'paragraph .iframe-wrapper': {
      'margin-bottom': '20px',
    },
    'iframe-wrapper iframe': {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
    },
    'media-text a': {
      color: 'rgba(var(--link), 1)',
    },
    'network-layout__wrapper': {
      width: '100%',
    },
    'calls-to-action__wrapper': {
      width: '100%',
    },
    'call-to-action': {
      'padding': '1rem 3rem',
      'background': 'lemonchiffon',
      'margin': '1rem',
      'border-radius': '5px',
      'color': 'crimson',
    },
    'network-layout__texts': {
      padding: '0 3rem',
    },
    'legal-blabla__wrapper': {
      width: '100%',
      padding: '0 3rem',
    },

  } );

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      about: 'About',
      featuredPeople: 'Featured Members',

      imprint: 'Imprint',
      dataProtection: 'Data Protection',
      privacyPolicy: 'Privacy Policy',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  function handleCallToActionClick() {
    this == 'Skill' && V.setBrowserHistory( '/network/skills' )
    || this == 'Task' && V.setBrowserHistory( '/network/tasks' )
    || this == 'Plot' && V.setBrowserHistory( '/farms/plots' );

    this == 'Skill' && Marketplace.draw( '/network/skills' )
    || this == 'Task' && Marketplace.draw( '/network/tasks' )
    || this == 'Plot' && Farm.draw( '/farms/plots' );
  }

  function handleProfileDraw() {
    const path = V.castPathOrId( this.textContent );
    V.setState( 'active', { navItem: path } );
    V.setBrowserHistory( path );
    Profile.draw( path );
  }

  function videoFeature( link ) {
    if ( link.match( /youtu/ ) ) {
      return V.castYouTubeIframe( link );
    }
    else if ( link.match( /vimeo/ ) ) {
      return V.castVimeoIframe( link );
    }
  }

  function mediaCard( cardData ) {

    const $cardContent = V.cN( {
      t: 'media',
      c: 'contents',
    } );

    const $title = V.cN( {
      t: 'h2',
      c: 'font-bold fs-l pxy cursor-pointer',
      h: cardData.fullId,
      k: handleProfileDraw,
    } );

    const $feature = V.castDescription( cardData.properties.description ).$feature;
    const $descr = V.castDescription( cardData.properties.description ).$description;

    if ( $feature ) {
      V.setNode( $cardContent, [$title, $feature, $descr ] );
    }
    else {
      V.setNode( $cardContent, [$title, $descr ] );
    }

    return $cardContent;
  }

  function featureUl() {
    return V.cN( {
      tag: 'ul',
    } );
  }

  function legalBlabla( lD ) {

    const x = lD.networkImprint;

    x.sitePublisher && ( lD.imprint
    = V.getString( 'Angaben gemäß § 5 TMG' ) + '\n' + '\n'
    + x.sitePublisher + '\n'
    + x.sitePublisherAddress + '\n'
    + x.sitePublisherPhone + '\n'
    + x.sitePublisherEmail + ( x.sitePublisherEmail ? '\n\n' : '' )
    + x.sitePublisherLegal + ( x.sitePublisherLegal ? '\n\n' : '' )
    + x.sitePublisherFreeText + ( x.sitePublisherFreeText ? '\n\n' : '' )
    + V.getString( 'Verantwortlich nach § 55 Abs.2 RStV' ) + '\n'
    + x.contentPublisher + '\n'
    + x.contentPublisherAddress + '\n'
    + x.contentPublisherPhone + '\n'
    + x.contentPublisherEmail + ( x.contentPublisherEmail ? '\n\n' : '' )
    + x.contentPublisherLegal + ( x.contentPublisherLegal ? '\n\n' : '' )
    + x.contentPublisherFreeText );

    return V.cN( {
      c: 'legal-blabla__wrapper',
      h: ['imprint', 'dataProtection', 'privacyPolicy'].map( item => V.cN( {
        c: '',
        h: [
          {
            c: 'legal-blabla__title font-bold fs-l mt-r mb-r legal-title-' + item,
            h: V.getString( ui[item] ),
          },
          {
            c: 'legal-blabla__text legal-text-' + item,
            y: {
              'white-space': 'break-spaces',
            },
            h: lD[item],
          },
        ],
      } ) ),
    } );
  }

  function networkLayout( data ) {
    return V.cN( {
      t: 'li',
      c: 'network-layout__wrapper',
      h: [
        V.cN( {
          y: {
            'display': 'flex',
            'justify-content': 'center',
            'min-height': '15vh',
            'max-height': '20vh',
            'background-image': `url(${ data.images.mediumImage })`,
            'background-repeat': 'no-repeat',
            'background-position': 'center',
          },
        } ),
        V.cN( {
          c: 'network-layout__texts',
          h: [
            {
              c: 'network-layout__about font-bold fs-l mb-r',
              h: V.getString( ui.about ),
            },
            {
              c: 'network-layout__descr',
              h: V.castDescription( data.properties.description ).$description,
            },
            {
              c: 'network-layout__additional-img',
              h: V.cN( {
                t: 'img',
                a: {
                  src: V.getSetting( 'additionalImage' ),
                },
              } ),
            },
            // {
            //   c: 'network-layout__featured font-bold fs-l mt-r mb-r',
            //   h: V.getString( ui.featuredPeople ),
            // },
          ],
        } ),
      ],
    } );
  }
  function vipTitle() {
    return V.cN( {
      c: 'network-layout__featured font-bold fs-l mt-r mb-r',
      h: V.getString( ui.featuredPeople ),
    } );
  }

  function callsToAction( aE ) {

    const rolesHeldbyAe = aE.holderOf.map( item => V.castRole( item.c ) );

    const calls = [];

    rolesHeldbyAe.includes( 'Plot' ) && calls.push( {
      text: 'Hey! Add your next plot',
      onClick: 'Plot',
    } );
    !rolesHeldbyAe.includes( 'Plot' ) && calls.push( {
      text: 'Hey! Add your first plot',
      onClick: 'Plot',
    } );
    !rolesHeldbyAe.includes( 'Skill' ) && calls.push( {
      text: 'Hey! Add your first skill',
      onClick: 'Skill',
    } );
    !rolesHeldbyAe.includes( 'Task' ) && calls.push( {
      text: 'Hey! Add your first task',
      onClick: 'Task',
    } );

    calls.length = 2;

    return V.cN( {
      c: 'calls-to-action__wrapper',
      h: calls.map( item => V.cN( {
        c: 'call-to-action cursor-pointer',
        h: '👋 ' + item.text,
        k: handleCallToActionClick.bind( item.onClick ),
      } ) ),
    } );
  }

  return {
    videoFeature: videoFeature,
    mediaCard: mediaCard,
    featureUl: featureUl,
    networkLayout: networkLayout,
    legalBlabla: legalBlabla,
    callsToAction: callsToAction,
    vipTitle: vipTitle,
  };

} )();
