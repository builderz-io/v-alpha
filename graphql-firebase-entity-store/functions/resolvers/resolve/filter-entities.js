// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );
const colE = namespaceDb.database().ref( 'entities' );

module.exports = async ( context, filter ) => {
  const q = filter.query.toLowerCase();
  const filtered = await colE.once( 'value' )
    .then( snap => snap.val() )
    .then( val => Object.values( val ).filter( E => {
      let text;
      if ( E.search && E.search.z ) {

        /** uses keyword cache to filter */
        text = E.search.z;
      }
      else {

        /** creates a new keyword cache */
        let strings = [ E.m, E.n ];
        strings = E.o ? strings.concat( [ E.m, E.o ] ) : strings; // title + special tag
        strings = E.search ? strings.concat( [ E.search.a, E.search.b, E.search.c, E.search.d ] ) : strings;
        strings = strings.concat( [ E.i, E.a, E.d ] );
        text = strings.join( ' ' );
        colE.child( E.a ).update( { 'search/z': text } );
      }
      text = text.toLowerCase();
      const role = filter.role != E.c ? filter.role == 'all' ? true : false : true;
      const isLocalHost = context.host.includes( 'localhost' ) ? true : false; // always return results when localhost
      const isNetworkNative = E.g == context.host;
      return role && text.includes( q ) && ( isLocalHost || isNetworkNative );
    } ) );
  return filtered;
};
