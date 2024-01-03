module.exports.whitelist = [
  'http://localhost:4021',
  'https://some.domain.com',
  ' ... ',
];

module.exports.float = {
  rpc: ' ... ',
  contractAddress: '0x ...', // '0xfe611d4a98760fC70B030F9c5A418Da07adD18C1'; builderz.io
  privKey: '0x ...',
};

module.exports.jwtSignature = ' ... ';

module.exports.jwtRefreshSignature = ' ... ';

module.exports.salt = ' ... ';

module.exports.auth = {
  type: 'service_account',
  project_id: ' ... ',
  private_key_id: ' ... ',
  private_key: '-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----',
  client_email: ' ... iam.gserviceaccount.com',
  client_id: ' ... ',
  auth_uri: ' ... ',
  token_uri: ' ... ',
  auth_provider_x509_cert_url: ' ... ',
  client_x509_cert_url: ' ... iam.gserviceaccount.com',
};

module.exports.namespace = {
  type: 'service_account',
  project_id: ' ... ',

};

module.exports.profile = {
  type: 'service_account',
  project_id: ' ... ',

};
