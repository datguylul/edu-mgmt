import React from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';

const TestBank = () => {
  return <Layout title="Ngân hàng đề thi" />;
};
export default withAuth(TestBank);
