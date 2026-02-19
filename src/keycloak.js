import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://auth.tst.local',
  realm: 'TST',
  clientId: 'weblab',
});

export default keycloak;