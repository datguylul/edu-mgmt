import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ProductUpdate, ProductDetail, CategoryList } from 'core/services/product';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Form, Input, Space, Cascader, Select, Row, Col, Upload, Button, notification } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { string_to_slug } from '@utils/StringUtil';
import axios from 'axios';

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
  const { id } = router.query; // object destructuring
  const [form] = Form.useForm();
  const [productMeta, setProductMeta] = useState<Array<ProductMeta>>();
  const [categoryData, setCategoryData] = useState([]);
  const [imgFile, setImgFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imgMultiple] = useState(false);

  useEffect(() => {
    LoadDetail();
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
      Price: data.Price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
      CreateDate: data.CreateDate,
      Quantity: data.Quantity,
      Slug: data.Slug,
      Title: data.Title,
      Content: data.Content,
      Summary: data.Summary,
      ProductImage: data.ProductImage,
    });
  };

  const handleUpdateProduct = (values: any) => {
    // if (values.ProductImage) {
    //   values.ProductMetas = [
    //     {
    //       Url: values.ProductImage,
    //       ProductId: id,
    //       KeyMeta: '',
    //       Content: '',
    //       State: 2,
    //     },
    //   ];
    // }

    // console.log( handleProductImage(values));
    let params: object = {
      ...values,
      ProductId: id,
    };
    ProductUpdate(params)
      .then((resp) => {
        console.log(resp.data);
        openNotification('Update Product', 'Success');
      })
      .catch((error) => {
        console.log('error', error);
        openNotification('Update Product', 'Fail');
      });
    router.push('/product');
  };

  const handleProductImage = (params: object[]) => {
    const item = Object.keys(params).filter((item) => item.includes('ProductImage-'));
  };

  const handleTitleChange = ({ target }: any) => {
    form.setFieldsValue({
      Slug: string_to_slug(target.value),
    });
  };

  const handleSelectChange = () => {};

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
    <Layout title={'Sản Phẩm'}>
      <Form {...formItemLayout} form={form} name="register" onFinish={handleUpdateProduct} scrollToFirstError>
        <Form.Item name="ProductCode" label="Mã Sản Phẩm" preserve>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="Title" label="Tên">
          <Input onChange={handleTitleChange} />
        </Form.Item>
        <Form.Item name="Category" label="Phân loại">
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
        <Form.Item name="CreateDate" label="Ngày Tạo" preserve>
          <Input disabled={true} />
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
              Cập Nhật
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Layout>
  );
}

export default withAuth(index);
