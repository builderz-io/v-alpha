const JoinComponents = ( function() { // eslint-disable-line no-unused-vars

    /**
     * V Theme Module for join components
     *
     */
  
    'use strict';
  
    /* ============== user interface strings ============== */
  
    const ui = {
    //   upload: 'uploading...',
    //   change: 'Change',
    //   image: 'Image',
    //   titleOrCity: 'Enter a title or city name',
  
    //   key: 'Key',
    //   title: 'Title',
    //   email: 'Email',
    //   emailConfirm: '4 digits',
    //   loc: 'Location',
    //   descr: 'Description and Links',
    //   target: 'Target',
    //   unit: 'Unit',
    //   search: 'Search',
    //   create: 'create',
    //   query: 'search',
    };
  
    function getString( string, scope ) {
      return V.i18n( string, 'join', scope || 'join content' ) + ' ';
    }

/* ====================== styles ====================== */

  V.setStyle( {
    'join-overlay': {
      position: 'fixed',
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
      background: 'rgba(0,0,0,0.8)',
    },
    'join-card': {
      'position': 'relative',
      'background': 'white',
      'width': '75vw',
      'max-width': '500px',
      'height': '46vh',
      'margin': '14vh auto',
      'padding': '0.5rem',
    },
    'join-content': {
      
    }
   },
  );
  
    /* ================== event handlers ================== */

    function handleJoin() {
        Join.draw( 'initialize join' );
      }


  
    /* ================== private methods ================= */
  

  
    /* ================  public components ================ */

    function joinCard() {
      return V.cN( {
        t: 'joinoverlay',
        c: 'join-overlay',
        h: {
          c: 'join-card',
          h: 'hello world',
        },
      } )  
    }
  
    function joinBtn() {
      const sc = V.getState( 'screen' );
      const colorBkg = 'rgba(' + sc.buttonBkg + ', 1)';
  
      return V.cN( { // #ffa41b
        t: 'join',
        c: 'fixed cursor-pointer txt-anchor-mid',
        y: sc.width > 800 ? { top: '12px', left: '12px' } : { top: '2px', left: '2px' },
        h: {
          svg: true,
          a: {
            width: sc.width > 800 ? '66px' : '54px',
            viewBox: '0 0 36 36',
          },
          h: [
            {
              svg: true,
              t: 'circle',
              a: {
                'stroke-dasharray': '100',
                'transform': 'rotate(-90, 18, 18) translate(0, 36) scale(1, -1)',
                'stroke-dashoffset': '-200',
                'cx': '18',
                'cy': '18',
                'r': '15.91549430918954',
                'fill': colorBkg,
                'stroke': colorBkg,
                'stroke-width': '2.7',
              },
              k: handleJoin,
            },
            {
              svg: true,
              t: 'text',
              c: 'font-medium fs-xs txt-button',
              a: { x: '50%', y: '59%' },
              k: handleJoin,
              h: 'Join',
            },
          ],
        },
      } );
    }
  
    /* ====================== export ====================== */
  
    return {
      joinBtn: joinBtn,
      joinCard: joinCard,
    };
  
  } )();
  