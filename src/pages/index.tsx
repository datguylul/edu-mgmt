import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';

function Index() {
  return <Layout title="Home" />;
}

export default withAuth(Index);
