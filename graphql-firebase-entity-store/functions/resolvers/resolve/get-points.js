// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );

module.exports = async ( context ) => {
  const network = context.host.replace( /\./g, '_' ).replace( ':', '_' );
  const colCache = namespaceDb.database().ref( 'networks/' + network + '/cache' );

  const points = await colCache.child( 'points' ).once( 'value' )
    .then( snap => {
      let items = Object.values( snap.val() );
      items = items.filter( item => item.f != 1 );
      return items;
    } );

  // const used = process.memoryUsage();
  // for ( const key in used ) {
  //   console.log( `${key} ${Math.round( used[key] / 1024 / 1024 * 100 ) / 100} MB` );
  // }

  return points;
};
