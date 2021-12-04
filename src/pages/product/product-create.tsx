import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ProductAdd, CategoryList } from 'core/services/product';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Form, Input, Space, Cascader, Select, Row, Col, Checkbox, Button, notification, Upload } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { string_to_slug } from '@utils/StringUtil';

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
  const [categoryData, setCategoryData] = useState([]);
  const [imgFile, setImgFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imgMultiple] = useState(false);

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    CategoryList(0, 10)
      .then((resp: any) => {
        const data = resp.data;
        setCategoryData(data?.Data);
      })
      .catch((error: any) => {
        console.log('error', error);
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

  const handleUpdateProduct = (values: any) => {
    console.log('values', values);
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

  const handleSelectChange = (value: any) => {};

  const handleUpload = () => {
    const formData = new FormData();
    // Hình ảnh cần upload
    formData.append('file', imgFile);
    // Tên preset vừa tạo ở bước 1
    formData.append('upload_preset', 'bn3jjpdp');
    formData.append('api_key', '454226386488799');
    // Tải ảnh lên cloudinary
    // API: https://api.cloudinary.com/v1_1/{Cloudinary-Name}/image/upload
    axios
      .post('https://api.cloudinary.com/v1_1/dhi8xksch/image/upload?api_key=454226386488799', formData)
      .then((response) => {
        form.setFieldsValue({
          ProductImage: response.data.url,
        });
      })
      .catch((err) => {
        console.error(err);
        openNotification('Upload Ảnh', 'Đã có lỗi');
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
        <Form.Item name="ProductCategories" label="Phân loại">
          {categoryData && categoryData.length > 0 && (
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Chọn phân loại sản phẩm"
              defaultValue={[]}
              onChange={handleSelectChange}
            >
              {categoryData &&
                categoryData.map((item: any) => (
                  <Select.Option key={item.CategoryId} value={item.CategoryId}>
                    {item.Title}
                  </Select.Option>
                ))}
            </Select>
          )}
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
        <Form.Item>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={!imgFile}
            loading={uploading}
            style={{ marginTop: 16 }}
          >
            {uploading ? 'Đang tải' : 'Tải ảnh lên'}
          </Button>
          <Upload
            multiple={false}
            beforeUpload={(file: any) => setImgFile(file)}
            name="logo"
            listType="picture"
            accept="image/png, image/gif, image/jpeg"
          >
            <Button icon={<UploadOutlined />}>Chọn File</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="Content" label="Nội Dung">
          <Input />
        </Form.Item>
        <Form.Item name="Summary" label="Tóm Tắt">
          <Input />
        </Form.Item>

        {imgMultiple && (
          <div>
            <h4>Ảnh phụ</h4>
            <Form.List name="ProductMeta">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <>
                      <Form.Item {...field} label={`Ảnh ${index + 1}`} name={[field.name, 'product_meta']}>
                        <Input style={{ width: '60%' }} />
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Form.Item>
                    </>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      style={{ width: '100px' }}
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
        )}

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
