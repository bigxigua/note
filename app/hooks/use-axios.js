import { useState, useCallback } from 'react';
import axiosInstance from '@util/axiosInstance';

export default function useAxios() {
  const [loading, setLoading] = useState(false);
  const request = useCallback((method) => {
    return async (url = '', params = {}) => {
      setLoading(true);
      const [error, data] = await axiosInstance[method](url, params);
      setLoading(false);
      return [error, data];
    };
  }, []);
  return {
    loading,
    request: {
      get: request('get'),
      post: request('post')
    }
  };
}