import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Modal, Form, Pagination, DatePicker, Input, Button, Select, Space, Row, Col } from 'antd';
import { UserDetailNonId, EditUser } from '@core/services/api';
import ClassModal from 'components/Modal/teacher-admin/ClassModal';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
const { Option } = Select;
import { openNotification } from '@utils/Noti';

function index() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentDetail();
  }, []);

  const getStudentDetail = () => {
    setLoading(true);
    UserDetailNonId()
      .then((res) => {
        fillForm(res?.data?.Data);
      })
      .catch((error) => {
        console.log('error', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fillForm = (data: any) => {
    form.setFieldsValue({
      UserDob: data?.account?.UserDob,
      UserGender: data?.account?.UserGender,
      Fullname: data?.account?.Fullname,
      UserPhone: data?.account?.UserPhone,
      UserUsername: data?.account?.UserUsername,
    });
  };


  const handleSubmit = (data: any) => {
    setLoading(true);

    const params = {
      ...data,
      UserName: data.Fullname,
    }

    EditUser(params)
      .then(resp => {
        if (resp.data.Success) {
          fillForm(resp?.data?.Data);
          openNotification('Cập nhật thông tin', 'Cập nhật thông tin thành công', 'success');
        } else {
          openNotification('Cập nhật thông tin', resp.data.Message, 'error');
        }
      }).catch(error => {
        console.log("error", error);
        openNotification('Cập nhật thông tin', "Cập nhật thông tin thất bại", 'error');

      }).finally(() => {
        setLoading(false);
      });
  }

  return (
    <Layout title={'Thông tin tài khoản'} backButton backButtonUrl="/student/dashboard">
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        onFinishFailed={() => { }}
        autoComplete="off"
      >
        <Form.Item label="Tên đăng nhập" name="UserUsername">
          <Input disabled={true} />
        </Form.Item>
        <Form.Item label="Họ tên" name="Fullname">
          <Input />
        </Form.Item>
        <Form.Item label="Sđt" name="UserPhone">
          <Input />
        </Form.Item>
        <Form.Item label="Giới tính" name="UserGender">
          <Input />
        </Form.Item>
        <Form.Item label="Ngày sinh" name="UserDob">
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
