import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookie from 'js-cookie';
import Auth, { Group } from 'components/Auth';
import Layout from 'Layouts';
import { login } from 'core/services/api';
import { useAuth } from '@contexts/AuthContext';
import withoutAuth from '@hocs/withoutAuth';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import _ from 'lodash';

const schema = yup
  .object({
    username: yup.string().required('Tên đăng nhập không thể trống'),
    password: yup.string().required('Mật khẩu không thể trống'),
  })
  .required();

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { setAuthenticated } = useAuth();
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = (data: any) => {
    setLoading(true);
    setMessage('');
    login(data)
      .then((res) => {
        const data = res.data;
        if (data.Success) {
          setAuthenticated(true);
          Cookie.set('accessToken', data.Data?.token, { expires: 7 });
          localStorage.setItem('roles', data.Data?.roles[0]?.RoleName);
          localStorage.setItem('username', data.Data.account.Username);
        } else {
          setMessage(data.Message);
        }
      })
      .catch((error) => {
        console.log('error', error);
        setMessage('Tài khoản không hợp lệ hoặc có lỗi');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Layout title="Đăng nhập">
      <Auth title="Đăng Nhập" subTitle="Đăng nhập ngay!">
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup fullWidth>
            <input type="text" placeholder="Username" {...register('username')} />
          </InputGroup>
          <p>{errors.username?.message}</p>
          <InputGroup fullWidth>
            <input type="password" placeholder="Password" {...register('password')} />
          </InputGroup>
          <p>{errors.password?.message}</p>

          <div>
            {message && (
              <h4
                style={{
                  color: 'red',
                  textAlign: 'center',
                }}
              >
                {message}
              </h4>
            )}
          </div>

          <Button status="Success" type="submit" shape="SemiRound" fullWidth disabled={loading}>
            Đăng Nhập
          </Button>
        </form>
        {/* <Socials /> */}
        {/* <p>
          Don&apos;t have account?{' '}
          <Link href="/auth/register">
            <a>Register</a>
          </Link>
        </p> */}
      </Auth>
    </Layout>
  );
}

export default withoutAuth(Login);
