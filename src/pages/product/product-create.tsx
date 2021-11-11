import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ProductAdd } from 'core/services/product';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Form, Input, Space, Cascader, Select, Row, Col, Checkbox, Button, notification } from 'antd';
import { string_to_slug } from '@utils/StringUtil';

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
  const [form] = Form.useForm();
  const [productMeta, setProductMeta] = useState<Array<ProductMeta>>();

  useEffect(() => {}, []);

  const openNotification = (Title: string, Content: string) => {
    notification.open({
      message: Title,
      description: Content,
      onClick: () => {},
      placement: 'bottomRight',
    });
  };

  const handleUpdateProduct = (values: any) => {
    let params: object = {
      ...values,
    };
    ProductAdd(params)
      .then((resp) => {
        console.log(resp.data);
        openNotification('Add Product', 'Success');
      })
      .catch((error) => {
        console.log('error', error);
        openNotification('Add Product', 'Fail');
      });
  };

  //   const handleProductImage = (params: object[]) => {
  //     console.log('params', Object.keys(params));
  //     const item = Object.keys(params).filter((item) => item.includes('ProductImage-'));
  //   };

  const handleTitleChange = ({ target }: any) => {
    console.log(target.value);
    form.setFieldsValue({
      Slug: string_to_slug(target.value),
    });
  };

  return (
    <Layout title={'Thêm Sản Phẩm'}>
      <Form {...formItemLayout} form={form} name="register" onFinish={handleUpdateProduct} scrollToFirstError>
        <Form.Item name="ProductCode" label="Mã Sản Phẩm">
          <Input />
        </Form.Item>
        <Form.Item name="Title" label="Tên">
          <Input onChange={handleTitleChange} />
        </Form.Item>
        <Form.Item name="Price" label="Giá">
          <Input />
        </Form.Item>
        <Form.Item name="Quantity" label="Số Lượng">
          <Input />
        </Form.Item>
        <Form.Item name="Slug" label="Slug" preserve>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="Discount" label="Giảm Giá (%)">
          <Input />
        </Form.Item>
        <Form.Item name="ProductImage" label="Ảnh Chính">
          <Input />
        </Form.Item>
        <Form.Item name="Content" label="Nội Dung">
          <Input />
        </Form.Item>
        <Form.Item name="Summary" label="Tóm Tắt">
          <Input />
        </Form.Item>

        {/* <div>
          <h4>Ảnh</h4>
          {productMeta && productMeta.length > 0 ? (
            productMeta.map((item: ProductMeta, index: number) => (
              <Form.Item name="ProductImage" label="Product Image" key={index}>
                <Input defaultValue={item.Url} />
              </Form.Item>
            ))
          ) : (
            <Form.Item name="ProductImage" label="Product Image">
              <Input />
            </Form.Item>
          )}
        </div> */}

        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Thêm mới
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Layout>
  );
}

export default withAuth(index);
