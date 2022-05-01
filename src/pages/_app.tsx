import 'antd/dist/antd.css';
import 'react-loading-skeleton/dist/skeleton.css';

import { useEffect } from 'react';
import { AuthProvider } from '@contexts/AuthContext';
import cookie from 'cookie';
import App from 'next/app';
function MyApp(props: any) {
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  return (
    <AuthProvider authenticated={props.authenticated}>
      <props.Component {...props.pageProps} />
    </AuthProvider>
  );
}

MyApp.getInitialProps = async (appContext: any) => {
  let authenticated = false;
  const request = appContext.ctx.req;

  if (request) {
    request.cookies = cookie.parse(request.headers.cookie || '');
    authenticated = !!request.cookies.accessToken;
  }
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps, authenticated };
};

export default MyApp;
