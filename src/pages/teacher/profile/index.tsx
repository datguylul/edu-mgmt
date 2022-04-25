import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Modal, Form, Pagination, DatePicker, Input, Button, Select, Space, Row, Col } from 'antd';
import { UserDetailNonId } from '@core/services/api';
import ClassModal from 'components/Modal/ClassModal';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
const { Option } = Select;

function index() {
  const [form] = Form.useForm();

  useEffect(() => {
    getTeacherDetail();
  }, []);

  const getTeacherDetail = () => {
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
      TeacherDob: data?.teacher?.TeacherDob,
      TeacherEmail: data?.teacher?.TeacherEmail,
      TeacherGender: data?.teacher?.TeacherGender,
      TeacherId: data?.teacher?.TeacherId,
      TeacherName: data?.teacher?.TeacherName,
      TeacherPhone: data?.teacher?.TeacherPhone,
      UserUsername: data?.account?.UserUsername,
    });
  };

  return (
    <Layout title={'Thông tin tài khoản'} backButton backButtonUrl="/teacher/dashboard">
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
        <Form.Item label="UserUsername" name="UserUsername">
          <Input />
        </Form.Item>
        <Form.Item label="TeacherName" name="TeacherName">
          <Input />
        </Form.Item>
        <Form.Item label="TeacherPhone" name="TeacherPhone">
          <Input />
        </Form.Item>
        <Form.Item label="TeacherGender" name="TeacherGender">
          <Input />
        </Form.Item>
        <Form.Item label="TeacherDob" name="TeacherDob">
          <Input />
        </Form.Item>
        <Form.Item label="TeacherEmail" name="TeacherEmail">
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
