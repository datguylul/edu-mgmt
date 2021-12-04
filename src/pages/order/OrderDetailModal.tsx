import React, { useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';

import { Checkbox, Row, Col, Form, Input, Button, Space, Menu, Select } from 'antd';
import { OrderDetail, OrderChangeStatus } from 'core/services/product';
import { ORDER_STATUS } from '@core/constants';

const { Option } = Select;

interface IStaffInfo {
  ordersId?: string;
  onCloseModal?: () => void;
}

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
const ModalEditStaffInfo: React.FC<IStaffInfo> = ({ ordersId, onCloseModal }) => {
  const [form] = Form.useForm();
  const LoadDetail = () => {
    OrderDetail(ordersId!.toString())
      .then((resp) => {
        const data = resp.data.Data;
        if (data) {
          fillForm(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fillForm = (data: any) => {
    form.setFieldsValue({
      orderId: data?.orderId,
      customerName: data?.customerName,
      customerPhone: data?.customerPhone,
      customerEmail: data.customerEmail,
      customerAddress: data.customerAddress,
      Status: data.Status,
      Total: data.Total,
      Content: data.Content,
    });
  };

  const handleEditOrder = (params: any) => {
    OrderChangeStatus(params)
      .then((resp) => {
        console.log(resp.data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  useEffect(() => {
    LoadDetail();
  }, [ordersId]);

  return (
    <>
      <Form {...formItemLayout} form={form} name="register" onFinish={handleEditOrder} scrollToFirstError>
        <Form.Item name="orderId" label="orderId" preserve={true}>
          <Input disabled={true} />
          {/* <Input /> */}
        </Form.Item>
        <Form.Item name="customerName" label="customerName">
          <Input />
        </Form.Item>
        <Form.Item name="customerPhone" label="customerPhone">
          <Input />
        </Form.Item>
        <Form.Item name="customerEmail" label="customerEmail">
          <Input />
        </Form.Item>
        <Form.Item name="customerAddress" label="customerAddress">
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
        <Form.Item name="Total" label="Total" preserve={true}>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="Content" label="Content">
          <Input />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Cập Nhật
            </Button>
            <Button htmlType="button" onClick={onCloseModal}>
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default ModalEditStaffInfo;
