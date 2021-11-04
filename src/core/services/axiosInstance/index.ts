import axios from 'axios';
import * as RequestInterceptor from '../../network/interceptors/request';
import * as ResponseInterceptor from '../../network/interceptors/response';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const token = cookies.get('accessToken');
const BASE_URL = 'https://salemodel.somee.com/';

const getInstance = (baseUrl: string) => {
  const instance = axios.create({
    baseURL: baseUrl,
    timeout: 30000,
    withCredentials: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
  });
  instance.interceptors.request.use(RequestInterceptor.addAccessToken, RequestInterceptor.onRejected);
  instance.interceptors.response.use(ResponseInterceptor.onFullfilled, ResponseInterceptor.onRejected);
  return instance;
};

axios.defaults.headers.common = {
  Authorization: `bearer ${token}`,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': 'X-Requested-With',
};

export const apiClient = getInstance(BASE_URL);
// const API = {
//   get: (endpoint: string, params = {}, token?: any) => axios.get(endpoint, { params, token }),
//   post: (endpoint: string, data: any = {}, token?: any, config?: any) =>
//     axios.post(endpoint, data, { token, ...config }),
//   put: (endpoint: string, data: any = {}, token?: any) => axios.put(endpoint, data, { token }),
//   del: (endpoint: string, params = {}, token?: any) => axios.delete(endpoint, { params, token }),
// };

// export default API;
