import { useEffect, useContext } from 'react';

import { useAuth } from '@contexts/AuthContext';
import withAuth from '@hocs/withAuth';
import { logOut } from 'core/services/user';
// import { UserContext } from '@contexts/UserContext';
import Cookie from 'js-cookie';

export default withAuth(function Logout() {
  // const [userInfo, setUserInfo] = useContext(UserContext);
  const { setAuthenticated } = useAuth();
  useEffect(() => {
    async function doLogout() {
      logOut()
        .then(async (resp) => {
          const response = await fetch('/api/logout');
          if (response.status === 200) {
          } else {
            Cookie.remove('accessToken');
          }
        })
        .catch((error) => {
          console.log('error', error);
        });

      localStorage.removeItem('roles');
      localStorage.removeItem('username');
      setAuthenticated(false);
    }
    doLogout();
  }, [setAuthenticated]);
  return (
    <div className="loading-spinnder">
      <span className="sr-only">Loging Out...</span>
    </div>
  );
}, '/');
