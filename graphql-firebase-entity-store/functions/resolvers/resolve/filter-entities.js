// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );
const colE = namespaceDb.database().ref( 'entities' );

const getAllEntities = require( './get-all-entities' );

module.exports = async ( context, filter ) => {

  if ( filter.isAutofill ) {
    return getAllEntities( context, filter );
  }

  const q = filter.query.toLowerCase();

  let snap = await getAllEntities( context );

  snap = snap.filter( E => {
    let text;
    if ( E.zz && E.zz.z ) {

      /** uses keyword cache to filter */
      text = E.zz.z;
    }
    else {

      /** creates a new keyword cache */
      let strings = [ E.m, E.n ];
      strings = E.o ? strings.concat( [ E.m, E.o ] ) : strings; // title + special tag
      strings = E.zz ? strings.concat( [ E.zz.a, E.zz.b, E.zz.d, E.zz.k ] ) : strings;
      strings = strings.concat( [ E.i /*, E.a, E.d */ ] );
      text = strings.join( ' ' );
      colE.child( E.a ).update( { 'zz/z': text } );
    }

    text = text.toLowerCase();

    const role = filter.role == 'all'
      || filter.role == E.c
      ? true
      : filter.role == 'aa'
        ? ['aa', 'ab'].includes( E.c )
        :  false;

    return role && text.includes( q );

  } );

  return snap;
};
