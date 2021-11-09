// Connect to firebase database
const { profileDb } = require( '../../resources/databases-setup' );
const colP = profileDb.database().ref( 'profiles' );

module.exports = async ( profileArray ) => {
  const profiles = [];
  for ( let i = 0; i < profileArray.length; i++ ) {
    const profile = await colP.child( profileArray[i] )
      .once( 'value' )
      .then( snap => snap.val() );
    profiles.push( profile );
  }
  return profiles;
};
