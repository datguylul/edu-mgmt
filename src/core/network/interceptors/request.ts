import { Cookies } from 'react-cookie';

export function addAccessToken(initialConfig: any) {
  const config = initialConfig;

  const cookies = new Cookies();
  const token = cookies.get('accessToken');

  if (token) {
    Object.assign(config.headers, {
      Authorization: `Bearer ${token}`,
    });
  }

  return config;
}

export function onRejected(error: any) {
  return Promise.reject(error);
}
