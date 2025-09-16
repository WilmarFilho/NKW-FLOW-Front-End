import { useCallback, useMemo } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { apiConfig } from '../../config/api';
import { toast } from 'react-toastify';

export interface ApiError {
  message: string;
  status: number;
}

export const useApi = () => {
  const executeRequest = useCallback(async <T>(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    path: string,
    requestData?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const url = `${apiConfig.node}${path}`;

    try {
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
        case 'patch':
          response = await axios.patch<T>(url, requestData, config);
          break;
        case 'delete':
          response = await axios.delete<T>(url, config);
          break;
        default:
          throw { message: 'Método HTTP não suportado', status: 500 } as ApiError;
      }

      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;

      let message = '';
      let status = 500;

      if (axiosError.response) {
        message = axiosError.response.data?.message || axiosError.response.statusText || 'Erro desconhecido';
        status = axiosError.response.status; // <-- aqui pegamos o status real (ex: 401)
      } else if (axiosError.request) {
        message = 'Nenhuma resposta recebida do servidor.';
        status = 0;
      } else {
        message = axiosError.message;
        status = 500;
      }

      toast.error(message);

      // lança o erro com status correto
      throw { message, status } as ApiError;
    }

  }, []);

  const get = useCallback(<T>(path: string, config?: AxiosRequestConfig) => executeRequest<T>('get', path, undefined, config), [executeRequest]);
  const post = useCallback(<T>(path: string, data?: unknown, config?: AxiosRequestConfig) => executeRequest<T>('post', path, data, config), [executeRequest]);
  const put = useCallback(<T>(path: string, data?: unknown, config?: AxiosRequestConfig) => executeRequest<T>('put', path, data, config), [executeRequest]);
  const patch = useCallback(<T>(path: string, data?: unknown, config?: AxiosRequestConfig) => executeRequest<T>('patch', path, data, config), [executeRequest]);
  const del = useCallback(<T>(path: string, config?: AxiosRequestConfig) => executeRequest<T>('delete', path, undefined, config), [executeRequest]);

  return useMemo(() => ({ get, post, put, patch, del }), [get, post, put, patch, del]);
};
