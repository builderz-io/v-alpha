// Connect to firebase database
const { profileDb } = require( '../../resources/databases-setup' );
const colP = profileDb.database().ref( 'profiles' );

const { checkAuth } = require( './utils/check-auth' );

module.exports = ( context, uuidP ) => colP.child( uuidP ).once( 'value' )
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
    return [item];
  } );
