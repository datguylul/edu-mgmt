import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookie from 'js-cookie';
import Auth, { Group } from 'components/Auth';
import Socials from 'components/Auth/Socials';
import Layout from 'Layouts';
import { login } from 'core/services/user';
import { useAuth } from '@contexts/AuthContext';
import withoutAuth from '@hocs/withoutAuth';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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

  const onCheckbox = () => {
    // v will be true or false
  };

  const onSubmit = (data: any) => {
    setLoading(true);
    login(data)
      .then((res) => {
        const data = res.data?.Data;
        if (data?.account) {
          setAuthenticated(true);
          Cookie.set('accessToken', data?.token, { expires: 7 });
          localStorage.setItem('roles', JSON.stringify(data.roles));
          localStorage.setItem('username', data?.account?.Username);
        }
      })
      .catch((error) => {
        console.log('error', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Layout title="Đăng nhập">
      <Auth title="Đăng Nhập" subTitle="Đăng nhập để quản lý shop ngay!">
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup fullWidth>
            <input
              type="text"
              placeholder="Username"
              // onChange={(e) =>
              //   setUser({
              //     ...user,
              //     username: e.target.value,
              //   })
              // }
              {...register('username')}
            />
          </InputGroup>
          <p>{errors.username?.message}</p>
          <InputGroup fullWidth>
            <input
              type="password"
              placeholder="Password"
              // onChange={(e) =>
              //   setUser({
              //     ...user,
              //     password: e.target.value,
              //   })
              // }
              {...register('password')}
            />
          </InputGroup>
          <p>{errors.password?.message}</p>
          {/* <Group>
            <Checkbox checked onChange={onCheckbox}>
              Remember me
            </Checkbox>
            <Link href="/auth/request-password">
              <a>Quên mật khẩu?</a>
            </Link>
          </Group> */}
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
