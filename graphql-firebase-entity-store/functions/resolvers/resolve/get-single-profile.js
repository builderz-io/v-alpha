
const collP = global.db.collP;

const { checkAuth } = require( './utils/check-auth' );
const { decrypt } = require( '../../resources/crypt' );

module.exports = ( context, uuidP ) => collP.child( uuidP ).once( 'value' )
  .then( snap => {

    const item = snap.val();

    /**
     * block the return of the profile for non-owner/non-holder,
     * as per setting in field f
     */

    if (
      item.f && item.f > 0
      && !checkAuth( context, item )
    ) {
      return [ { success: false } ];
    }

    /** convert encrypted geo data to visible geo data */
    if (
      checkAuth( context, item )
      && item.n && item.n.d
    ) {
      item.n.a = JSON.parse( decrypt( JSON.parse( item.n.d ) ) );
    }

    return [item];
  } );
