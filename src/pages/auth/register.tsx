import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { signUp } from '@core/services/api';
import Auth from 'components/Auth';
import Layout from 'Layouts';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import _ from 'lodash';
import { Tabs } from 'antd';
import { USER_ROLE_ID } from '@core/constants/userRoleId';
import router from 'next/router';

const { TabPane } = Tabs;

const Input = styled(InputGroup)`
  margin-bottom: 2rem;
`;

const schema = yup
  .object({
    UserName: yup.string().required('Họ tên không thể trống'),
    UserPhone: yup.string().required('Số điện thoại không thể trống'),
    UserPassword: yup.string().required('Mật khẩu không thể trống').min(6, 'Mật khẩu ít nhất 6 kí tự'),
    UserDOB: yup.string().required('Ngày sinh không thể trống'),
    ConfirmUserPassword: yup
      .string()
      .required('Xác nhận mật khẩu không thể trống')
      .oneOf([yup.ref('UserPassword')], 'Xác nhận mật khẩu không giống'),
  })
  .required();

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [userLoginType, setUserLoginType] = useState<number>(USER_ROLE_ID.teacher);

  const onSubmit = (data: any) => {
    setLoading(true);

    const params = {
      ...data,
      signUpUserType: userLoginType,
    };

    signUp(params)
      .then((res) => {
        const data = res.data;
        if (data?.Success && data?.Data) {
          router.push('/auth/login');
        } else {
          setMessage(data?.Message);
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

  function tabChange(key: string) {
    setUserLoginType(parseInt(key));
  }

  return (
    <Layout title="Đăng ký">
      <Auth title="Tạo tài khoản với tư cách">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultActiveKey="1" onChange={tabChange}>
            <TabPane tab="Giáo viên" key={USER_ROLE_ID.teacher}>
              <Input fullWidth>
                <input type="text" placeholder="Họ tên giáo viên" {...register('UserName')} />
              </Input>
              <p style={styles.errorText}>{errors.UserName?.message}</p>
              <Input fullWidth>
                <input type="text" placeholder="Số điện thoại" {...register('UserPhone')} />
              </Input>
              <p style={styles.errorText}>{errors.UserPhone?.message}</p>
              <Input fullWidth>
                <input type="text" placeholder="Email" {...register('UserEmail')} />
              </Input>
              <p style={styles.errorText}>{errors.UserEmail?.message}</p>
              <Input fullWidth>
                <input type="password" placeholder="Mật khẩu" {...register('UserPassword')} />
              </Input>
              <p style={styles.errorText}>{errors.UserPassword?.message}</p>
              <Input fullWidth>
                <input type="password" placeholder="Xác nhận mật khẩu" {...register('ConfirmUserPassword')} />
              </Input>
              <p style={styles.errorText}>{errors.ConfirmUserPassword?.message}</p>
              <Input fullWidth>
                <input type="text" placeholder="Ngày sinnh" {...register('UserDOB')} />
              </Input>
              <p style={styles.errorText}>{errors.UserDOB?.message}</p>
            </TabPane>
            <TabPane tab="Học sinh" key={USER_ROLE_ID.student}>
              <Input fullWidth>
                <input type="text" placeholder="Họ tên học sinh" {...register('UserName')} />
              </Input>
              <p style={styles.errorText}>{errors.UserName?.message}</p>
              <Input fullWidth>
                <input type="text" placeholder="Số điện thoại (học sinh hoặc phụ huynh)" {...register('UserPhone')} />
              </Input>
              <p style={styles.errorText}>{errors.UserPhone?.message}</p>
              <Input fullWidth>
                <input type="password" placeholder="Mật khẩu" {...register('UserPassword')} />
              </Input>
              <p style={styles.errorText}>{errors.UserPassword?.message}</p>
              <Input fullWidth>
                <input type="password" placeholder="Xác nhận mật khẩu" {...register('ConfirmUserPassword')} />
              </Input>
              <p style={styles.errorText}>{errors.ConfirmUserPassword?.message}</p>
              <Input fullWidth>
                <input type="text" placeholder="Ngày sinnh" {...register('UserDOB')} />
              </Input>
              <p style={styles.errorText}>{errors.UserDOB?.message}</p>
            </TabPane>
          </Tabs>

          <div>{message && <h4 style={[styles.errorText, styles.centerText]}>{message}</h4>}</div>
          <Button type="submit" shape="SemiRound" fullWidth disabled={loading}>
            Đăng ký
          </Button>
        </form>
        <br />
        <p>
          Đã có tài khoản?{' '}
          <Link href="/auth/login">
            <a>Đăng nhập</a>
          </Link>
        </p>
      </Auth>
    </Layout>
  );
}

const styles = {
  errorText: {
    color: 'red',
  },
  centerText: {
    textAlign: 'center',
  },
};
