// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );
const colE = namespaceDb.database().ref( 'entities' );

module.exports = ( context, filter ) => {

  if (
    filter
     && filter.isAutofill
  ) {
    const q = filter.query[0].toUpperCase()
    + filter.query[1].toLowerCase()
    + filter.query[2].toLowerCase();

    return colE.orderByChild( 'm' )
      .startAt( q )
      .endAt( q + '\uf8ff' )
      .once( 'value' )
      .then( snap => Object.values( snap.val() ) );
  }

  if (
    context.host.includes( 'localhost' )
    || context.host.includes( 'staging' )
  ) {
    return colE.limitToLast( 1000 ).once( 'value' )
      .then( snap => Object.values( snap.val() ) );
  }
  else {
    return colE.orderByChild( 'g' ).equalTo( context.host )
      .limitToLast( 1000 ).once( 'value' )
      .then( snap => Object.values( snap.val() ) );
  }

};
