import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'http://10.10.2.183:4000',
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_access_token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
      _retry?: boolean;
    }

    const originalRequest = error.config as RetryAxiosRequestConfig;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('admin_refresh_token');

        if (!refreshToken) {
          logout();
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post(
          'http://10.10.2.183:4000/admin/auth/refresh-token',
          { refreshToken },
        );

        const newAccessToken = refreshResponse.data.accessToken;

        localStorage.setItem('admin_access_token', newAccessToken);

        // Update header for retried request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

function logout() {
  localStorage.removeItem('admin_access_token');
  localStorage.removeItem('admin_refresh_token');
  window.location.href = '/login';
}

export default api;
