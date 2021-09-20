const roles = [
  'Person', 'PersonMapped',
  'Business', 'Institution', 'NGO', 'GOV', 'Network',
  'Skill', 'Task',
  'Place', 'Event',
  'Media', 'Dataset',
];

module.exports = data => {

  if ( !data.c || !roles.includes( data.c ) ) {
    throw new Error( '-5110 invalid role' );
  }

  return true;
};
