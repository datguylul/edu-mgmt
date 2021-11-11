import axios from 'axios';
import * as RequestInterceptor from '../../network/interceptors/request';
import * as ResponseInterceptor from '../../network/interceptors/response';
import { getAPIHostName, setAPIHostName } from '@utils/APIHostUtil';

const getInstance = () => {
  const urlLocal = localStorage.getItem('@cnw/host');
  if (urlLocal && typeof urlLocal === 'string') {
    setAPIHostName(urlLocal);
  }

  const instance = axios.create({
    baseURL: getAPIHostName(),
    timeout: 30000,
  });
  instance.interceptors.request.use(RequestInterceptor.addAccessToken, RequestInterceptor.onRejected);
  instance.interceptors.response.use(ResponseInterceptor.onFullfilled, ResponseInterceptor.onRejected);
  return instance;
};

export const apiClient = getInstance();
