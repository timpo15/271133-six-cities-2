import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { Token } from './utils';

export const BACKEND_URL = 'http://127.0.0.1:3015/';
const REQUEST_TIMEOUT = 5000;

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const token = Token.get();

      if (token) {
        config.headers['authorization'] = token;
      }

      return config;
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      toast.dismiss();
      toast.warn(error.response ? error.response.data.error : error.message);

      return Promise.reject(error);
    }
  );

  return api;
};
