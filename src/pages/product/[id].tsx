import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ProductUpdate, ProductDetail } from 'core/services/product';
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
      MetaTitle: data.MetaTitle,
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

  const handleTitleChange = ({ target }: any) => {
    console.log(target.value);
    form.setFieldsValue({
      Slug: string_to_slug(target.value),
    });
  };

  return (
    <Layout title={'Sản Phẩm'}>
      <Form {...formItemLayout} form={form} name="register" onFinish={handleUpdateProduct} scrollToFirstError>
        <Form.Item name="ProductCode" label="Mã Sản Phẩm" preserve>
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
        <Form.Item name="MetaTitle" label="Ảnh Chính">
          <Input />
        </Form.Item>
        <Form.Item name="Content" label="Nội Dung">
          <Input />
        </Form.Item>
        <Form.Item name="Summary" label="Tóm Tắt">
          <Input />
        </Form.Item>
        <Form.Item name="CreateDate" label="Ngày Tạo" preserve>
          <Input disabled={true} />
        </Form.Item>

        <div>
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
        </div>

        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button type="primary" htmlType="submit"></Button>
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
