import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Modal, Form, Pagination, DatePicker, Input, Button, Select, Space, Row, Col } from 'antd';
import { UserDetailNonId } from '@core/services/api';
import ClassModal from 'components/Modal/teacher-admin/ClassModal';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
const { Option } = Select;

function index() {
  const [form] = Form.useForm();

  useEffect(() => {
    getStudentDetail();
  }, []);

  const getStudentDetail = () => {
    UserDetailNonId()
      .then((res) => {
        fillForm(res?.data?.Data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const fillForm = (data: any) => {
    form.setFieldsValue({
      StudentDob: data?.student?.StudentDob,
      StudentGender: data?.student?.StudentGender,
      StudentName: data?.student?.StudentName,
      StudentPhone: data?.student?.StudentPhone,
      UserUsername: data?.account?.UserUsername,
    });
  };

  return (
    <Layout title={'Thông tin tài khoản'} backButton backButtonUrl="/student/dashboard">
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={() => {}}
        onFinishFailed={() => {}}
        autoComplete="off"
      >
        <Form.Item label="Tên đăng nhập" name="UserUsername">
          <Input />
        </Form.Item>
        <Form.Item label="Họ tên" name="StudentName">
          <Input />
        </Form.Item>
        <Form.Item label="Sđt" name="StudentPhone">
          <Input />
        </Form.Item>
        <Form.Item label="Giới tính" name="StudentGender">
          <Input />
        </Form.Item>
        <Form.Item label="Ngày sinh" name="StudentDob">
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
}

export default withAuth(index);
