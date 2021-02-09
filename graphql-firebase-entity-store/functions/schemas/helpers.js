
module.exports.castTypeAndInputDefs = ( which, schema, schemaTypes ) => {
  const clean = schema.uncomment().trim();
  return castType( which, clean ) + castInput( which, clean, schemaTypes );
};

function castType( which, schema ) {
  return 'type ' + which + ' ' + schema + '\n';
}
function castInput( which, schema, schemaTypes ) {
  if ( ['Entity', 'Profile', 'Auth',
    'ChangeLogE', 'ChangeLogP', 'ChangeLogA'].includes( which ) ) {
    schemaTypes.forEach( schemaType => {
      schema = schema.replace( schemaType, 'Input' + schemaType );
    } );
  }
  return 'input Input' + which + ' ' + schema + '\n';
}

module.exports.castInputServerSideDefs = ( which, schema, schemaTypes ) => {
  const clean = schema.uncomment().trim();
  return castInputServerSide( which, clean );
};

function castInputServerSide( which, schema ) {
  return 'input ' + which + ' ' + schema + '\n';
}
