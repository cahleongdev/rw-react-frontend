import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

let accessToken: string | null = null;
let refreshToken: string | null = null;
let onLogout: (() => void) | null = null;
let onTokenRefreshed: ((newAccessToken: string) => void) | null = null;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshToken) {
        if (onLogout) onLogout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${baseURL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        const { access: newAccessToken } = response.data;

        accessToken = newAccessToken;
        localStorage.setItem('accessToken', newAccessToken);

        if (onTokenRefreshed) {
          onTokenRefreshed(newAccessToken);
        }

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (onLogout) onLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const initializeAxios = (
  tokens: { accessToken: string; refreshToken: string },
  logoutCallback: () => void,
  tokenRefreshedCallback: (newAccessToken: string) => void,
) => {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
  if (tokens.accessToken) {
    localStorage.setItem('accessToken', tokens.accessToken);
  }
  if (tokens.refreshToken) {
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }
  onLogout = logoutCallback;
  onTokenRefreshed = tokenRefreshedCallback;
};

// Add a clear method to reset all token state
export const clearAxiosTokens = () => {
  accessToken = null;
  refreshToken = null;
  // We keep the callbacks intact
};

export default axiosInstance;
