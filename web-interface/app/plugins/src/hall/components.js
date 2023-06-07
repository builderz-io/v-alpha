const HallComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Hall Plugin
   *
   */

  'use strict';

  V.setStyle( {
    'call-to-action__wrapper': {
      margin: '3rem 0',
    },
    'call-to-action__btn1': {
      'display': 'flex',
      'height': '1.5rem',
      'align-items': 'center',
      'padding': '1rem 4rem',
      'background': 'rgba(var(--brandPrimary),1)',
      'color': 'white',
      'border-radius': '16px',
    },
    'call-to-action__btn2': {
      'display': 'flex',
      'height': '1.5rem',
      'align-items': 'center',
      'padding': '1rem 4rem',
      'background': 'rgba(var(--brandPrimary),1)',
      'color': 'white',
      'border-radius': '16px',
    },
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
    'create-entity-nudges__wrapper': {
      width: '100%',
    },
    'create-entity-nudge': {
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
      contactDetails: 'Contact Details',

      imprint: 'Imprint',
      dataProtection: 'Data Protection',
      privacyPolicy: 'Privacy Policy',
      join: 'Join',
      signup: 'Sign up',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  function handleCallToActionClick() {
    if ( 'btn1' == this ) {
      Profile.draw( V.getSetting( 'callToActionProfile' ) );
      V.setBrowserHistory( '/profile/' + V.getSetting( 'callToActionProfile' ) );
    }
    else if ( 'btn2' == this ) {
      Join.draw( 'initialize join' );
    }
  }

  function handleCreateEntityNudgeClick() {
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
      h: ['imprint', 'dataProtection' /*, 'privacyPolicy'*/].map( item => V.cN( {
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
            h: item == 'imprint' ? lD[item] : V.cN( { t: 'a', f: x.dataProtectionLink, h: V.getString( ui[item] ) } ),
          },
        ],
      } ) ),
    } );
  }

  function networkLayout( data ) {
    const castDescr = V.castDescription( data.properties.description );
    return V.cN( {
      t: 'li',
      c: 'network-layout__wrapper',
      h: [
        V.cN( {
          y: {
            'display': 'flex',
            'justify-content': 'center',
            'min-height': '225px',
            'max-height': '20vh',
            'background-image': `url(${ data.images.mediumImage })`,
            'background-repeat': 'no-repeat',
            'background-position': 'center',
            'margin-bottom': '1rem',
          },
        } ),
        V.cN( {
          c: 'network-layout__texts',
          h: [
            // {
            //   c: 'network-layout__about font-bold fs-l mb-r',
            //   h: V.getString( ui.about ),
            // },
            {
              c: 'network-layout__feature mb-r',
              h: castDescr.$feature,
            },
            {
              c: 'network-layout__descr',
              h: castDescr.$description,
            },
            {
              x: V.getSetting( 'additionalImage' ),
              c: 'network-layout__additional-img',
              h: V.cN( {
                t: 'img',
                c: 'w-full',
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
      c: 'network-layout__featured font-bold fs-l mt-r mb-r w-full txt-center',
      h: V.getString( ui.contactDetails ),
    } );
  }

  function createEntityNudges( aE ) {

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
      c: 'create-entity-nudges__wrapper',
      h: calls.map( item => V.cN( {
        c: 'create-entity-nudge cursor-pointer',
        h: '👋 ' + item.text,
        k: handleCreateEntityNudgeClick.bind( item.onClick ),
      } ) ),
    } );
  }

  function callToActionBtns() {
    return V.cN( {
      c: 'call-to-action__wrapper flex items-center flex-col',
      h: [
        {
          x: V.getSetting( 'callToActionText' ),
          c: 'call-to-action__btn1 cursor-pointer',
          h: V.getString( V.getSetting( 'callToActionText' ) ),
          k: handleCallToActionClick.bind( 'btn1' ),
        },
        {
          c: 'call-to-action__btn2 mt-r cursor-pointer',
          h: V.getString( ui.signup ),
          k: handleCallToActionClick.bind( 'btn2' ),
        },
      ],
    } );
  }

  return {
    videoFeature: videoFeature,
    mediaCard: mediaCard,
    featureUl: featureUl,
    networkLayout: networkLayout,
    legalBlabla: legalBlabla,
    vipTitle: vipTitle,
    createEntityNudges: createEntityNudges,
    callToActionBtns: callToActionBtns,
  };

} )();
