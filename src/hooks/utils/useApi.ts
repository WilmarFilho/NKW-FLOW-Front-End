import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { apiConfig } from '../../config/api';

export const useApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeRequest = useCallback(async <T>(
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
    requestData?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const url = `${apiConfig.node}${path}`;
      let response: AxiosResponse<T>;
      switch (method) {
        case 'get':
          response = await axios.get<T>(url, config);
          break;
        case 'post':
          response = await axios.post<T>(url, requestData, config);
          break;
        case 'put':
          response = await axios.put<T>(url, requestData, config);
          break;
        case 'delete':
          response = await axios.delete<T>(url, config);
          break;
        default:
          throw new Error('Método HTTP não suportado');
      }
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        setError(`Erro: ${axiosError.response.status} - ${axiosError.response.statusText}`);
      } else if (axiosError.request) {
        setError('Nenhuma resposta recebida do servidor. Verifique sua conexão.');
      } else {
        setError(`Erro na requisição: ${axiosError.message}`);
      }
      console.error('Erro na requisição API:', axiosError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback(<T>(path: string, config?: AxiosRequestConfig) => {
    return executeRequest<T>('get', path, undefined, config);
  }, [executeRequest]);

  const post = useCallback(<T>(path: string, data?: unknown, config?: AxiosRequestConfig) => {
    return executeRequest<T>('post', path, data, config);
  }, [executeRequest]);

  const put = useCallback(<T>(path: string, data?: unknown, config?: AxiosRequestConfig) => {
    return executeRequest<T>('put', path, data, config);
  }, [executeRequest]);

  const del = useCallback(<T>(path: string, config?: AxiosRequestConfig) => {
    return executeRequest<T>('delete', path, undefined, config);
  }, [executeRequest]);

  return {
    loading,
    error,
    get,
    post,
    put,
    del,
  };
};







