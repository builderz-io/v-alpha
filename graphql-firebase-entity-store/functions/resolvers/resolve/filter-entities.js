// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );
const colE = namespaceDb.database().ref( 'entities' );

module.exports = ( context, filter ) => {
  const q = filter.query.toLowerCase();
  return colE.once( 'value' )
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
      return role && text.includes( q ) && context.host.includes( 'localhost' ) ? true : E.g == context.host; // return all for localhost
    }
    ) );
};
