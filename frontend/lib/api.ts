import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  clearTokens,
  storeTokens,
} from '@/services/token/token.storage';
const api = axios.create({
<<<<<<< HEAD
  baseURL: 'http://172.28.32.1:4000',
=======
  baseURL: 'http://172.27.16.1:4000',
>>>>>>> a3cd29c76cf9575d585c0dd8aa3711f4fe64b719
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshToken = await getRefreshToken();

        const res = await axios.post(
          'http://172.27.16.1:4000/auth/refresh-token',
          { refreshToken },
        );

        const newAccessToken = res.data.accessToken;
        if (!refreshToken) {
          await clearTokens();
          return Promise.reject(err);
        }
        await storeTokens(newAccessToken, refreshToken);

        original.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(original);
      } catch {
        await clearTokens();
      }
    }

    return Promise.reject(err);
  },
);

export default api;
