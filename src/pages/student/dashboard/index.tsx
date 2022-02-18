import React from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';

const Home = () => {
  return <Layout title="Trang chủ học sinh" />;
};
export default withAuth(Home);
