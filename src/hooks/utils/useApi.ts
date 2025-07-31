import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { apiConfig } from '../../config/api';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  get: (path: string, config?: AxiosRequestConfig) => Promise<T | null>;
  post: (path: string, data?: unknown, config?: AxiosRequestConfig) => Promise<T | null>;
  put: (path: string, data?: unknown, config?: AxiosRequestConfig) => Promise<T | null>;
  del: (path: string, config?: AxiosRequestConfig) => Promise<T | null>;
}

export const useApi = <T = unknown>(): UseApiResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeRequest = useCallback(async (method: 'get' | 'post' | 'put' | 'delete', path: string, requestData?: unknown, config?: AxiosRequestConfig) => {
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
      setData(response.data);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        // O servidor respondeu com um status diferente de 2xx
        setError( `Erro: ${axiosError.response.status} - ${axiosError.response.statusText}`);
      } else if (axiosError.request) {
        // A requisição foi feita, mas não houve resposta
        setError('Nenhuma resposta recebida do servidor. Verifique sua conexão.');
      } else {
        // Algo aconteceu na configuração da requisição que disparou um erro
        setError(`Erro na requisição: ${axiosError.message}`);
      }
      console.error('Erro na requisição API:', axiosError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((path: string, config?: AxiosRequestConfig) => executeRequest('get', path, undefined, config), [executeRequest]);
  const post = useCallback((path: string, requestData?: unknown, config?: AxiosRequestConfig) => executeRequest('post', path, requestData, config), [executeRequest]);
  const put = useCallback((path: string, requestData?: unknown, config?: AxiosRequestConfig) => executeRequest('put', path, requestData, config), [executeRequest]);
  const del = useCallback((path: string, config?: AxiosRequestConfig) => executeRequest('delete', path, undefined, config), [executeRequest]);

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
    del,
  };
};

