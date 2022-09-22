/** testing the uuid generation locally */

const runXTimes = 100;
const outputLength = 10;

const uuid = require( './v-core' ).castUuid;

const startsWith = {};
const has = {};

for ( let i = 0; i < runXTimes; i++ ) {

  const str = uuid().base64Url;

  const char1 = str.substr( 3, 1 );

  if ( !startsWith[char1] ) {
    startsWith[char1] = 0;
  }
  startsWith[char1] += 1;

  const shortenedArr = str.substr( 0, outputLength ).split( '' );

  // console.log( shortenedArr );

  for ( let i = 0; i < shortenedArr.length; i++ ) {
    if ( !has[shortenedArr[i]] ) {
      has[shortenedArr[i]] = 1;
    }
  }

}

console.log( startsWith );
console.log( Object.keys( startsWith ).length );
console.log( Object.keys( startsWith ).sort() );
// console.log( has );
// console.log( Object.keys( has ).length );
// console.log( 62**outputLength * 25 * 3 );

/*
100000 runs of old version
{ f: 2330, b: 2332, w: 86750, a: 2275, c: 1667, e: 2321, d: 2325 }

{
a: "acK5YXjCnB9GG8KreMKIwo"
c: "PersonMapped"
zz: { i: [ -157.9519787, 21.4252101] }
}

{
a: "A8KXwoDCh8Ke"
c: "PersonMapped"
zz: { i:  [-123.1323, 49.2654] }
}

*/
