import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Modal, Checkbox, Pagination, DatePicker, Input, Button, Select, Space, Row, Col } from 'antd';
import { UserDetailNonId } from '@core/services/api';
import ClassModal from 'components/Modal/ClassModal';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
const { Option } = Select;

function index() {
  useEffect(() => {
    getTeacherDetail();
  }, []);

  const getTeacherDetail = () => {
    UserDetailNonId()
      .then((res) => {})
      .catch((error) => {
        console.log('error', error);
      });
  };

  return <Layout title={'Thông tin tài khoản'} backButton backButtonUrl="/teacher/dashboard"></Layout>;
}

export default withAuth(index);
