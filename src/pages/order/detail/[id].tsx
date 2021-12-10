import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import React, { useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';

import { Table, Row, Col, Form, Input, Button, Space, Menu, Select } from 'antd';
import { OrderDetail, OrderChangeStatus } from 'core/services/product';
import { ORDER_STATUS } from '@core/constants';
import { openNotification } from '@utils/Noti';
import { formatNumber } from '@utils/StringUtil';

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

const imgStyle = {
  width: 60,
  height: 'auto',
  maxHeight: 90,
};

function index() {
  const router = useRouter();
  const { id } = router.query; // object destructuring
  const [form] = Form.useForm();
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const LoadDetail = () => {
    setLoading(true);
    OrderDetail(id!.toString())
      .then((resp) => {
        const data = resp.data.Data;
        if (data) {
          setOrderItems(data.items);
          fillForm(data);
        } else {
          openNotification('Thông tin đơn hàng', 'Có lỗi khi lấy thông tin đơn hàng');
        }
      })
      .catch((error) => {
        console.log(error);
        openNotification('Thông tin đơn hàng', 'Có lỗi khi lấy thông tin đơn hàng');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fillForm = (data: any) => {
    form.setFieldsValue({
      orderId: data?.orderId,
      customerName: data?.customerName,
      customerPhone: data?.customerPhone,
      customerEmail: data.customerEmail,
      customerAddress: data.customerAddress,
      status: data.Status,
      Total: formatNumber(data.Total),
      Content: data.Content,
    });
  };

  const columns = [
    {
      title: 'Image',
      key: 'image',
      render: (text: any, record: any) => (
        <Space size="middle">
          {/* <Image src={record?.ProductImage ? record.ProductImage : '/img/blank-img.jpg'} width={90} height={60} alt={record.Title} /> */}
          <img
            src={record?.ProductImage ? record.ProductImage : '/img/blank-img.jpg'}
            style={imgStyle}
            alt={record.Title}
          />
          {/* <Link href={`product/${record.ProductId}`}>
            <a>Detail</a>
          </Link> */}
        </Space>
      ),
    },
    {
      title: 'Tên SP',
      dataIndex: 'ProductName',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'Price',
      render: (text: any) => (
        <text>
          {formatNumber(text)}
          {'đ'}
        </text>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'Quantity',
    },
    {
      title: 'Tổng',
      dataIndex: 'Sub-Total',
      render: (text: any, record: any) => (
        <text>
          {formatNumber(record.Price * record.Quantity)}
          {'đ'}
        </text>
      ),
    },
  ];

  const handleEditOrder = (params: any) => {
    setLoading(true);
    OrderChangeStatus(params)
      .then((resp) => {
        if (resp.data.Success) {
          openNotification('Sửa thông tin đơn hàng', resp.data.Message || 'Sửa thông tin đơn hàng thành công');
        } else {
          openNotification('Sửa thông tin đơn hàng', resp.data.Message || 'Sửa thông tin đơn hàng thất bại');
        }
      })
      .catch((error) => {
        openNotification('Sửa thông tin đơn hàng', 'Sửa thông tin đơn hàng thất bại');
        console.log('error', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    LoadDetail();
  }, []);

  return (
    <Layout title={'Thông Tin Đơn Hàng'}>
      <Form {...formItemLayout} form={form} name="register" onFinish={handleEditOrder} scrollToFirstError>
        <Form.Item name="orderId" label="Mã Order" preserve={true}>
          <Input disabled={true} />
          {/* <Input /> */}
        </Form.Item>
        <Form.Item name="customerName" label="Tên" rules={[{ required: true, message: 'Tên không thể trống!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="customerPhone" label="SĐT" rules={[{ required: true, message: 'SĐT không thể trống!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="customerEmail" label="Email" rules={[{ type: 'email', message: 'E-mail không hợp lệ' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="customerAddress"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Địa chỉ phẩm không thể trống!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái">
          <Select allowClear style={{ width: '100%' }} placeholder="Trang thái đơn hàng" defaultValue={[]}>
            {ORDER_STATUS.map((item: any) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Total" label="Tổng" preserve={true}>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="Content" label="Nội dung">
          <Input />
        </Form.Item>
        <Table columns={columns} dataSource={orderItems} pagination={false} />
        <br />
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
