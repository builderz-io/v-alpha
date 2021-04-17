/** testing the link checker locally */

const linkChecker = require( './link-blocker' );

async function runCheck() {
  return linkChecker( 'https://www.grassrootseconomics.org/' );
}

runCheck().then( res => {
  console.log( res );
} );
