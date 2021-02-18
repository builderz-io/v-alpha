/* eslint global-require: "off" */

module.exports = async data => {

  /** allow max chars */
  data.profileInputServerSide.descr = require( '../../resources/max-chars' )( data.profileInputServerSide.descr, 2200 );

  /** check for spammy links */
  const filteredText = await require( '../utils/link-blocker' )( data.profileInputServerSide.descr );

  /** if links were blocked, also store a filtered version of the description */

  data.profileInputServerSide.filteredDescr = filteredText;

};
