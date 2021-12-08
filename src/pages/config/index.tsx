import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ProductAdd } from 'core/services/product';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Form, Input, Space, Cascader, Select, Row, Col, Checkbox, Button, notification } from 'antd';
import { getAPIHostName, setAPIHostName } from '@utils/APIHostUtil';
import { openNotification } from '@utils/Noti';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function index() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [hostUrl, setHostUrl] = useState<string>(getAPIHostName());

  useEffect(() => {
    const urlLocal = localStorage.getItem('@cnw/host');
    if (urlLocal && typeof urlLocal === 'string') {
      setAPIHostName(urlLocal);
      setHostUrl(urlLocal);
    }
    fillForm();
  }, [hostUrl]);

  const handleUpdateProduct = (values: any) => {
    console.log(getAPIHostName());

    if (values.APIHost && values.APIHost.length > 0) {
      setAPIHostName(values.APIHost);
      setHostUrl(values.APIHost);
      localStorage.setItem('@cnw/host', values.APIHost);
    } else {
      setAPIHostName(process.env.API_BASE_URL!);
      setHostUrl(process.env.API_BASE_URL!);
      localStorage.removeItem('@cnw/host');
    }
  };

  const fillForm = () => {
    form.setFieldsValue({
      APIHostCurrent: hostUrl,
    });
  };

  return (
    <Layout title={'Sys '}>
      <Form {...formItemLayout} form={form} name="register" onFinish={handleUpdateProduct} scrollToFirstError>
        <Form.Item name="APIHostCurrent" label="Current API Host" preserve>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="APIHost" label="API Host" extra="Leave blank to get default APIHost">
          <Input />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Change
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Layout>
  );
}

export default withAuth(index);
