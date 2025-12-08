import { CLIENT_ID, CLIENT_SECRET, API_URL } from '@env';
import axios from 'axios';

let token = null;

export async function getAccessToken() {
  if (token) return token;

  const resp = await axios.post(`${API_URL}/oauth/token`, {
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  token = resp.data.access_token;
  return token;
}

export async function getUser(login) {
  const t = await getAccessToken();
  try {
    const resp = await axios.get(`${API_URL}/users/${login}`, {
      headers: { Authorization: `Bearer ${t}` },
    });
    return resp.data;
  } catch (err) {
    throw err;
  }
}
