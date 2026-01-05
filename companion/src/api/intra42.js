import { CLIENT_ID, CLIENT_SECRET, API_URL } from '@env';
import axios from 'axios';

let token = null;

console.log('🔧 [API] Environment check:', { 
  CLIENT_ID: CLIENT_ID ? 'set' : 'undefined', 
  CLIENT_SECRET: CLIENT_SECRET ? 'set' : 'undefined',
  API_URL 
});

export async function getAccessToken() {
  // if (token) {
  //   console.log('🔑 [API] Using cached access token');
  //   return token;
  // }

  console.log('📡 [API] Requesting new access token');
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);

  try {
    const resp = await axios.post('https://api.intra.42.fr/oauth/token', params);
    token = resp.data.access_token;
    console.log('✅ [API] Access token obtained');
    return token;
  } catch (err) {
    console.error('❌ [API] Failed to obtain access token:', err.response?.status, err.message);
    throw err;
  }
}

export async function getUser(login) {
  console.log(`📡 [API] Fetching user: ${login}`);
  const t = await getAccessToken();
  try {
    const resp = await axios.get(`${API_URL}/users/${login}`, {
      headers: { Authorization: `Bearer ${t}` },
    });
    console.log(`✅ [API] User data received for: ${login}`);
    return resp.data;
  } catch (err) {
    console.error(`❌ [API] Failed to fetch user ${login}:`, err.response?.status, err.message);
    throw err;
  }
}
