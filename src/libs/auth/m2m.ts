'use server';

const keycloakHost = String(process.env.KEYCLOAK_HOST);
const vardefM2mClientId = Number(process.env.VARDEF_M2M_CLIENT_ID);
const vardefM2mClientSecret = Number(process.env.VARDEF_M2M_CLIENT_SECRET);

export async function getM2mToken() {
  let response = await fetch(keycloakHost + '/realms/ssb/protocol/openid-connect/token', {
    method: 'POST',
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: vardefM2mClientId,
      client_secret: vardefM2mClientSecret,
    }),
  });
  return (await response.json())['access_token'];
}
