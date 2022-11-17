
const namespaceDb = global.db.namespaceDb;

module.exports = ( context, emphasis ) => {
  const network = context.host.replace( /[.:]/g, '_' );
  const coll = namespaceDb.database().ref( 'networks/' + network + '/' + emphasis + 's' );

  return coll
    .orderByChild( 'y/c' )
    .startAt( Math.floor( Date.now() / 1000 ) )
    .once( 'value' )
    .then( snap => Object.values( snap.val() ) );

};
