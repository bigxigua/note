import { useState, useEffect } from 'react';
import axios from 'axios';
import { DOMAIN } from '../config/index';

const defaultOptions = {
  method: 'get',
  payload: {}
};
export default function useAxios(url, options = defaultOptions) {
  console.log(options);
  const [state, setState] = useState({
    data: null,
    error: null,
    isLoading: false
  });
  const axiosInstance = axios.create({
    baseURL: DOMAIN,
    timeout: 100000,
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      // 'Content-Type': 'application/x-www-form-urlencoded'
      'Content-Type': 'application/json; charset=utf-8'
    },
    params: {},
    data: {}
  });
  // 拦截器-request
  axiosInstance.interceptors.request.use(config => {
    return config;
  }, error => {
    Promise.reject(error);
  });
  // 拦截器-response
  axiosInstance.interceptors.response.use(
    response => {
      if (response && response.data && response.data.status === 'success') {
        return [null, response.data.data];
      }
      return [response.data, null];
    },
    error => {
      return Promise.reject(error);
    }
  );
  const fetch = async () => {
    setState({ ...state, isLoading: false });
    const { method, payload } = options;
    try {
      const [error, data] = await axiosInstance[method](url, payload);
      setState({ data, error, isLoading: false });
    } catch (error) {
      setState({ data: null, error, isLoading: false });
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return [state, setState];
}