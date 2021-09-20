
const { namespaceDb } = require( '../../../resources/databases-setup' );

const findByAuth = require( '../find-by-auth' );
const getSingleEntity = require( '../get-single-entity' );

module.exports = async ( context ) => {

  /**
   * Get the latest version of the authDoc,
   * as context may not include field g (the active networks)
   */

  const authDoc = await findByAuth( context.i );

  if ( authDoc && authDoc.g ) {
    const now = Math.floor( Date.now() / 1000 );
    const entityDoc = await getSingleEntity( {}, { uuidE: authDoc.d } );
    const dataArray = [].concat( entityDoc[0].holderOf, entityDoc[0] );

    authDoc.g.forEach( item => {
      const network = item.replace( /\./g, '_' ).replace( ':', '_' );
      dataArray.forEach( entity => {

        namespaceDb.database()
          .ref( 'networks/' + network + '/cluster' )
          .child( entity.a )
          .update( {
            a: entity.a,
            y: {
              a: now,
            },
          } );

        namespaceDb.database()
          .ref( 'networks/' + network + '/cache/points' )
          .child( entity.a )
          .update( {
            a: entity.a,
            c: entity.c,
            zz: {
              i: entity.zz && entity.zz.i
                ? entity.zz.i
                : entity.geo
                  ? entity.geo
                  : null,
            },
          } );

      } );

    } );
  }
};
