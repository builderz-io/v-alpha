const PoolComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Pool Plugin
   *
   * Note: Currently for DEMO PURPOSE only
   */

  'use strict';

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      notFunded: 'Not yet successfully funded',
      successFunded: 'Successfully funded',
      noneSpent: 'None yet spent',
      spent: 'Received budget spent',
      of: 'of',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  function fundingStatusContent( data ) {

    const funded = Math.floor( data.receiveVolume > 0
      ? data.receiveVolume / data.target * 100
      : 1 );

    const spent = Math.ceil( data.sendVolume > 0
      ? ( data.sendVolume * ( 1 + V.getSetting( 'transactionFee' ) / 100**2 ) ) / data.receiveVolume * 100
      : 1 );

    const svgFunded = '<svg width="100" height="100" class="pool__funding-chart">\
               <circle r="25" cx="50" cy="50" class="pool__funding-pie" stroke-dasharray="' + Math.floor( 158 * ( funded / 100 ) ) + ' ' + ( 158 ) + '"/>\
             </svg>';

    const svgSpent = '<svg width="100" height="100" class="pool__spending-chart">\
      <circle r="25" cx="50" cy="50" class="pool__spending-pie" stroke-dasharray="' + Math.floor( 158 * ( spent / 100 ) ) + ' ' + ( 158 ) + '"/>\
      </svg>';

    const $table = V.cN( {
      t: 'table',
      c: 'w-full pxy',
      h: [
        {
          t: 'tr',
          h: [
            {
              t: 'td',
              innerHtml: svgFunded,
            },
            {
              t: 'td',
              innerHtml: ( funded <= 1 ? '0' : funded ) + ' % '
                           + V.getString( ui.of ) + ' ' + data.target  + ' V'
                           + '<br><br>'
                           + ( funded >= 66
                             ? '<span class="">' + V.getString( ui.successFunded ) + '</span>'
                             : V.getString( ui.notFunded ) ),
            },
          ],
        },
        {
          t: 'tr',
          h: [
            {
              t: 'td',
              innerHtml: svgSpent,
            },
            {
              t: 'td',
              innerHtml: ( spent <= 1 ? '0' : spent ) + ' % '
                           + V.getString( ui.of ) + ' ' + data.receiveVolume + ' V'
                           + '<br><br>'
                           + V.getString( ui.noneSpent ),
            },
          ],
        },
      ],
    } );

    return $table;

  }

  function fundingStatusWrapper( $table ) {
    return V.cN( {
      c: 'funding-status-wrapper w-full',
      h: $table,
    } );
  }

  return {
    fundingStatusWrapper: fundingStatusWrapper,
    fundingStatusContent: fundingStatusContent,
  };

} )();
