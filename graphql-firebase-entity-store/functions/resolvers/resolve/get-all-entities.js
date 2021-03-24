// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );
const colE = namespaceDb.database().ref( 'entities' );

module.exports = ( context ) => colE.once( 'value' )
  .then( snap => snap.val() )
  .then( val => Object.values( val ).filter( E =>
    context.host.includes( 'localhost' )
      ? E // return all for localhost
      : E.g == context.host
  ) );
