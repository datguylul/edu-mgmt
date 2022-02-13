import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { USER_ROLE } from '@core/constants/role';

function Index() {
  const router = useRouter();
  const role = 'admin';

  useEffect(() => {
    if (role === USER_ROLE.admin) {
      router.push('/admin/dashboard');
      return;
    }
    if (role === USER_ROLE.student) {
      router.push('/student/dashboard');
      return;
    }
  }),
    [];

  return <div />;
}

export default Index;
