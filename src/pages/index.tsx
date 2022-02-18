import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { USER_ROLE } from '@core/constants/role';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';

function Index() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('roles');
    console.log('localStorageData', role);

    if (role === USER_ROLE.admin) {
      router.push('/admin/dashboard');
      return;
    }
    if (role === USER_ROLE.student) {
      router.push('/student/dashboard');
      return;
    }
    if (role === USER_ROLE.teacher) {
      router.push('/teacher/dashboard');
      return;
    }
  }),
    [];

  return <Layout title="Trang chủ" />;
}

export default withAuth(Index);
