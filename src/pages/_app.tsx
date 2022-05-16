import 'antd/dist/antd.css';
import 'react-loading-skeleton/dist/skeleton.css';

import { useEffect } from 'react';
import { AuthProvider } from '@contexts/AuthContext';
import cookie from 'cookie';
import App from 'next/app';
import locale from 'antd/lib/locale/vi_VN';
import { ConfigProvider } from 'antd';
import ErrorBoundary from '@components/ErrorBoundary';
function MyApp(props: any) {
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  return (
    <ErrorBoundary>
      <ConfigProvider locale={locale}>
        <AuthProvider authenticated={props.authenticated}>
          <props.Component {...props.pageProps} />
        </AuthProvider>
      </ConfigProvider>
    </ErrorBoundary>
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
