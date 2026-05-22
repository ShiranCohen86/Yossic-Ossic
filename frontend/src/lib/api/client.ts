import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { store } from '../store';
import { updateTokens, clearCredentials } from '../store/slices/authSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const client: AxiosInstance = axios.create({ baseURL: API_URL });

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(new Error(error.response?.data?.message || error.message));
    }
    const refreshToken = store.getState().auth.refreshToken;
    if (!refreshToken) { store.dispatch(clearCredentials()); return Promise.reject(new Error('יש להתחבר מחדש')); }
    if (isRefreshing) {
      return new Promise((resolve) => { refreshQueue.push((token) => { original.headers.Authorization = `Bearer ${token}`; resolve(client(original)); }); });
    }
    original._retry = true; isRefreshing = true;
    try {
      const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
      store.dispatch(updateTokens(data));
      refreshQueue.forEach(cb => cb(data.token)); refreshQueue = [];
      original.headers.Authorization = `Bearer ${data.token}`;
      return client(original);
    } catch { store.dispatch(clearCredentials()); refreshQueue = []; return Promise.reject(new Error('פג תוקף ה-session')); }
    finally { isRefreshing = false; }
  }
);

export default client;
