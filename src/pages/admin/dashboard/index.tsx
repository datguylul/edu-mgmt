import React from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';

const Home = () => {
  return <Layout title="Trang chủ admin" />;
};
export default withAuth(Home);
