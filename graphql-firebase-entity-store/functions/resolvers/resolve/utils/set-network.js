
const { namespaceDb } = require( '../../../resources/databases-setup' );

const findByAuth = require( '../find-by-auth' );
const getSingleEntity = require( '../get-single-entity' );

module.exports = async ( context ) => {

  if ( !context.i ) {
    return;
  }

  /**
   * Get the latest version of the authDoc,
   * as context may not include field g (the active networks)
   */

  const authDoc = await findByAuth( context.i );

  if ( authDoc && authDoc.g ) {
    const entityDoc = await getSingleEntity( context, { uuidE: authDoc.d } );
    const dataArray = [].concat( entityDoc[0].holderOf, entityDoc[0] );

    authDoc.g.forEach( item => {
      const network = item.replace( /\./g, '_' ).replace( ':', '_' );
      dataArray.forEach( entity => {
        // namespaceDb.database()
        //   .ref( 'networks/' + network + '/cluster' )
        //   .child( entity.a )
        //   .update( {
        //     a: entity.a,
        //   } );

        namespaceDb.database()
          .ref( 'networks/' + network + '/cache/points' )
          .child( entity.a )
          .update( {
            a: entity.a,
            c: entity.c,
            d: entity.d,
            f: entity.zz && ( entity.zz.f || entity.zz.f === 0 )
              ? entity.zz.f // sets privacy value from tracked fields
              : entity.privacy || entity.privacy === 0
                ? entity.privacy // sets privacy value from held entity
                : null,
            zz: {
              i: entity.zz && entity.zz.i
                ? entity.zz.i // sets coordinates from tracked fields
                : entity.geo
                  ? entity.geo // sets coordinates from held entity
                  : null,
              m: entity.zz && entity.zz.m
                ? entity.zz.m // sets continent value from tracked fields
                : entity.continent
                  ? entity.continent // sets continent value from held entity
                  : null,
            },
          } );

      } );

    } );
  }
};
