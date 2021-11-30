import axios from 'axios';
import * as RequestInterceptor from '../../network/interceptors/request';
import * as ResponseInterceptor from '../../network/interceptors/response';
import { getAPIHostName } from '@utils/APIHostUtil';

const getInstance = (URL: string) => {
  const instance = axios.create({
    baseURL: URL,
    timeout: 30000,
  });
  instance.interceptors.request.use(RequestInterceptor.addAccessToken, RequestInterceptor.onRejected);
  instance.interceptors.response.use(ResponseInterceptor.onFullfilled, ResponseInterceptor.onRejected);
  return instance;
};

// API_BASE_URL: "https://salemodel.somee.com/",
// API_LOCAL: "https://localhost:5001/",

export const apiClient = getInstance(process.env.API_LOCAL!);
