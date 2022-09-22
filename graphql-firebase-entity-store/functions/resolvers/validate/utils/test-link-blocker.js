/** testing the link checker locally */

const linkBlocker = require( './link-blocker' );

async function runCheck() {
  return linkBlocker( 'https://podcasts.apple.com/us/podcast/heather-mcgee-on-the-solidarity-dividend-and-the-sum-of-us/id1460720864?i=1000510122140' );
}

runCheck().then( res => {
  console.log( res );
} );
