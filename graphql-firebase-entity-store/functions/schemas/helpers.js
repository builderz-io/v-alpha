String.prototype.uncomment = function() {
  return this.replace( /\s+\/\/\s.+/g, '' );
};

module.exports.castTypeAndInputDefs = ( which, schema, schemaTypes ) => {
  const clean = schema.uncomment().trim();
  return castType( which, clean ) + castInput( which, clean, schemaTypes );
};

function castType( which, schema ) {
  return 'type ' + which + ' ' + schema + '\n';
}
function castInput( which, schema, schemaTypes ) {
  if ( ['Entity', 'Profile', 'ChangeLogE', 'ChangeLogP'].includes( which ) ) {
    schemaTypes.forEach( schemaType => {
      schema = schema.replace( schemaType, 'Input' + schemaType );
    } );
  }
  return 'input Input' + which + ' ' + schema + '\n';
}
