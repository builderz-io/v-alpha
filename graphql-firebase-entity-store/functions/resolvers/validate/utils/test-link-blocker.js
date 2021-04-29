/** testing the link checker locally */

const linkBlocker = require( './link-blocker' );

async function runCheck() {
  return linkBlocker( 'https://linkedin.com/' );
}

runCheck().then( res => {
  console.log( res );
} );
