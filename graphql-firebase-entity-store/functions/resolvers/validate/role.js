module.exports = data => {

  if ( !data.c || !['Person', 'Business'].includes( data.c ) ) {
    throw new Error( '-5110 invalid role' );
  }

  return true;
};
