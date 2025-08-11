import { useCallback, useMemo } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { apiConfig } from '../../config/api';
import { toast } from 'react-toastify';

export const useApi = () => {
  const executeRequest = useCallback(async <T>(
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
    requestData?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T | null> => {

    console.log(`[useApi] Chamando ${method.toUpperCase()} ${path}`);

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
      let errorMessage = '';

      if (axiosError.response) {
        const data = axiosError.response.data as { message?: string; error?: string };
        errorMessage = data?.message || data?.error || `Erro: ${axiosError.response.status} - ${axiosError.response.statusText}`;
      }
      else if (axiosError.request) {
        errorMessage = 'Nenhuma resposta recebida do servidor backend. Verifique sua conexão.';
      } else {
        errorMessage = `Erro na requisição: ${axiosError.message}`;
      }

      toast.error(errorMessage);

      throw new Error

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

  return useMemo(() => ({
    get,
    post,
    put,
    del,
  }), [get, post, put, del]);
};