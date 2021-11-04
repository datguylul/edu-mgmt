import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ProductDetail } from 'core/services/product';
import { InfoCircleOutlined } from '@ant-design/icons';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Form, Input, InputNumber, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';

const { Option } = Select;

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
  const { slug } = router.query; // object destructuring
  const [form] = Form.useForm();
  const [productData, setProductData] = useState({});
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  const suffixSelector = (
    <Form.Item name="suffix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="USD">$</Option>
        <Option value="CNY">¥</Option>
      </Select>
    </Form.Item>
  );

  const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);

  const onWebsiteChange = (value: string) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(['.com', '.org', '.net'].map((domain) => `${value}${domain}`));
    }
  };

  const websiteOptions = autoCompleteResult.map((website: any) => ({
    label: website,
    value: website,
  }));

  useEffect(() => {
    LoadDetail();
  }, []);

  const LoadDetail = () => {
    ProductDetail(slug!.toString())
      .then((resp) => {
        setProductData(resp.data?.product);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Layout title={'Product'}>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          residence: ['zhejiang', 'hangzhou', 'xihu'],
          prefix: '86',
        }}
        scrollToFirstError
      >
        <Form.Item name="email" label="E-mail">
          <Input />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
}

export default withAuth(index);
