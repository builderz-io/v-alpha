// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );
const colE = namespaceDb.database().ref( 'entities' );

module.exports = ( context ) => {

  if ( context.host.includes( 'localhost' ) ) {
    return colE.limitToLast( 1000 ).once( 'value' )
      .then( snap => Object.values( snap.val() ) );
  }
  else {
    return colE.orderByChild( 'g' ).equalTo( context.host )
      .limitToLast( 1000 ).once( 'value' )
      .then( snap => Object.values( snap.val() ) );
  }

};
