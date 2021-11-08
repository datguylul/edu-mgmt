import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ProductUpdate, ProductDetail } from 'core/services/product';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Form, Input, Space, Cascader, Select, Row, Col, Checkbox, Button, notification } from 'antd';

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

interface ProductMeta {
  Id: string;
  ProductId: string;
  KeyMeta: string;
  Url: string;
  Content: string;
}

interface Product {
  categories: Array<object>;
  product: object;
  product_meta: Array<ProductMeta>;
  product_review: Array<object>;
  tags: Array<object>;
}

function index() {
  const router = useRouter();
  const { id } = router.query; // object destructuring
  const [form] = Form.useForm();
  const [productMeta, setProductMeta] = useState<Array<ProductMeta>>();

  useEffect(() => {
    LoadDetail();
  }, []);

  const LoadDetail = () => {
    ProductDetail(id!.toString())
      .then((resp) => {
        const data = resp.data?.Data?.product;
        if (data) {
          setProductMeta(resp.data?.Data?.product_meta);
          fillForm(resp.data?.Data.product);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const openNotification = (Title: string, Content: string) => {
    notification.open({
      message: Title,
      description: Content,
      onClick: () => {},
      placement: 'bottomRight',
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
      Content: data.Content,
      Summary: data.Summary,
    });
  };

  const handleUpdateProduct = (values: any) => {
    if (values.ProductImage) {
      values.ProductMetas = [
        {
          Url: values.ProductImage,
          ProductId: id,
          KeyMeta: '',
          Content: '',
          State: 2,
        },
      ];
    }

    // console.log( handleProductImage(values));
    ProductUpdate(values)
      .then((resp) => {
        console.log(resp.data);
        openNotification('Update Product', 'Success');
      })
      .catch((error) => {
        console.log('error', error);
        openNotification('Update Product', 'Fail');
      });
  };

  const handleProductImage = (params: object[]) => {
    console.log('params', Object.keys(params));
    const item = Object.keys(params).filter((item) => item.includes('ProductImage-'));
  };

  return (
    <Layout title={'Product'}>
      <Form {...formItemLayout} form={form} name="register" onFinish={handleUpdateProduct} scrollToFirstError>
        <Form.Item name="ProductId" label="ProductId" preserve>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="ProductCode" label="Product Code" preserve>
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
        <Form.Item name="Content" label="Content">
          <Input />
        </Form.Item>
        <Form.Item name="Summary" label="Summary">
          <Input />
        </Form.Item>
        <Form.Item name="CreateDate" label="CreateDate" preserve>
          <Input disabled={true} />
        </Form.Item>

        <div>
          <h4>Ảnh</h4>
          {productMeta && productMeta.length > 0 ? (
            productMeta.map((item, index) => (
              <Form.Item name="ProductImage" label="Product Image">
                <Input defaultValue={item.Url} />
              </Form.Item>
            ))
          ) : (
            <Form.Item name="ProductImage" label="Product Image">
              <Input />
            </Form.Item>
          )}
        </div>

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
