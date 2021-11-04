import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ProductDetail } from 'core/services/product';
import { InfoCircleOutlined } from '@ant-design/icons';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Form, Input, Space, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';

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
  const [productData, setProductData] = useState<any>({});

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  useEffect(() => {
    LoadDetail();
  }, []);

  const LoadDetail = () => {
    ProductDetail(slug!.toString())
      .then((resp) => {
        const data = resp.data?.Data?.product;
        if (data) {
          console.log('resp', resp.data?.Data.product);
          setProductData(resp.data?.Data.product);
          fillForm(resp.data?.Data.product);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fillForm = (data: any) => {
    form.setFieldsValue({
      ProductCode: data?.ProductCode,
      ProductId: data?.ProductId,
      Discount: data.Discount,
      Price: data.Price,
      CreateDate: data.CreateDate,
      Quantity: data.Quantity,
      Slug: data.Slug,
      Title: data.Title,
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
        <Form.Item name="ProductCode" label="Product Code">
          <Input value={productData?.ProductCode} />
          {/* <Input /> */}
        </Form.Item>
        <Form.Item name="ProductId" label="ProductId">
          <Input />
        </Form.Item>
        <Form.Item name="Title" label="Title">
          <Input />
        </Form.Item>
        <Form.Item name="Price" label="Price">
          <Input />
        </Form.Item>
        <Form.Item name="Quantity" label="Quantity">
          <Input />
        </Form.Item>
        <Form.Item name="Slug" label="Slug">
          <Input />
        </Form.Item>
        <Form.Item name="Discount" label="Discount">
          <Input />
        </Form.Item>
        <Form.Item name="CreateDate" label="CreateDate">
          <Input />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
            <Button htmlType="button" onClick={() => null}>
              Delete
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Layout>
  );
}

export default withAuth(index);
