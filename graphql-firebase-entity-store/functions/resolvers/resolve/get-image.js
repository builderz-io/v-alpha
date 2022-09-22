// Connect to firebase database
const { imageDb } = require( '../../resources/databases-setup' );
const colI = imageDb.database().ref( 'images' );

const { checkAuth } = require( './utils/check-auth' );

module.exports = ( context, uuidP ) => colI.child( uuidP ).once( 'value' )
  .then( snap => {
    const item = snap.val();

    /**
     * block the return of the image for non-owner/non-holder,
     * as per setting in field f
     */

    if (
      item.f && item.f > 0
      && !checkAuth( context, item )
    ) {
      return [ { success: false } ];
    }
    return [item];
  } );
