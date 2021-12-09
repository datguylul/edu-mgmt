import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ProductUpdate, ProductDetail, CategoryList } from 'core/services/product';
import { handleCloudinaryUpload } from 'core/services/cloudinaryUpload';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Form, Input, Space, Cascader, Select, Row, Col, Upload, Button, notification } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { string_to_slug } from '@utils/StringUtil';
import { openNotification } from '@utils/Noti';

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

const imgStyle = {
  width: 100,
  height: 'auto',
  // maxHeight: 150,
};

function index() {
  const router = useRouter();
  const { id } = router.query; // object destructuring
  const [form] = Form.useForm();
  const [productMeta, setProductMeta] = useState<Array<ProductMeta>>();
  const [categoryData, setCategoryData] = useState([]);
  const [imgFile, setImgFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imgMultiple] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    ProductDetail(id!.toString())
      .then((resp) => {
        const data = resp.data?.Data?.product;
        if (data) {
          setProductMeta(resp.data?.Data?.product_meta);
          setImageUrl(resp.data?.Data.product.ProductImage);
          fillForm(resp.data?.Data);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fillForm = (data: any) => {
    form.setFieldsValue({
      ProductCode: data?.product?.ProductCode,
      ProductId: data?.product?.ProductId,
      Discount: data?.product?.Discount,
      Price: data?.product?.Price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
      ImportPrice: data?.product?.ImportPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
      CreateDate: data?.product?.CreateDate,
      Quantity: data?.product?.Quantity,
      Slug: data?.product?.Slug,
      Title: data?.product?.Title,
      Content: data?.product?.Content,
      Summary: data?.product?.Summary,
      ProductImage: data?.product?.ProductImage,
      ProductCategories: data?.categories.map((x: any) => x.CategoryId),
    });
  };

  const handleUpdateProduct = (values: any) => {
    let params: object = {
      ...values,
      ProductId: id,
    };
    setLoading(true);
    ProductUpdate(params)
      .then((resp) => {
        if (resp.data.Success) {
          openNotification('Sửa thông tin sản phẩm', 'Sửa thông tin sản phẩm thành công');
          router.push('/product');
        }
      })
      .catch((error) => {
        console.log('error', error);
        openNotification('Sửa thông tin sản phẩm', 'Sửa thông tin sản phẩm thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleImageTxtChange = ({ target }: any) => {
    setImageUrl(target.value);
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
    setLoading(true);
    handleCloudinaryUpload(imgFile)
      .then((res: any) => {
        form.setFieldsValue({
          ProductImage: res.url,
        });
        setImageUrl(res.url);
      })
      .catch((err: any) => {
        console.error(err);
        openNotification('Upload Ảnh', 'Đã có lỗi');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Layout title={'Thông Tin Sản Phẩm'}>
      <Form {...formItemLayout} form={form} name="register" onFinish={handleUpdateProduct} scrollToFirstError>
        <Form.Item
          name="ProductCode"
          label="Mã sản shẩm"
          rules={[{ required: true, message: 'Mã sản phẩm không thể trống!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="Title"
          label="Tên sản phẩm"
          rules={[{ required: true, message: 'Tên sản phẩm không thể trống!' }]}
        >
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
        <Form.Item
          name="ImportPrice"
          label="Giá Nhập"
          rules={[{ required: true, message: 'Giá nhập không thể trống!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="Price" label="Giá bán" rules={[{ required: true, message: 'Giá bán không thể trống!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="Quantity" label="Số lượng" rules={[{ required: true, message: 'Số lượng không thể trống!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="Slug" label="Slug" preserve>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="Discount" label="Giảm giá (%)">
          <Input />
        </Form.Item>
        <Form.Item
          name="ProductImage"
          label="Ảnh hiển thị"
          rules={[{ required: true, message: 'Ảnh hiển thị không thể trống!' }]}
          extra={'Chèn link ảnh hoặc tải lên'}
        >
          <Input onChange={handleImageTxtChange} />
        </Form.Item>
        <Form.Item>
          <div>
            <img src={imageUrl && imageUrl} style={imgStyle} alt={imageUrl} />
          </div>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={!imgFile || loading}
            loading={uploading || loading}
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
        <Form.Item name="Content" label="Nội dung">
          <Input />
        </Form.Item>
        <Form.Item name="Summary" label="Tóm tắt">
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
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              Cập Nhật
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Layout>
  );
}

export default withAuth(index);
