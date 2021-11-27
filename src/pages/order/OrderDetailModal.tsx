import React, { useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';

import { Checkbox, Row, Col, Form, Input, Button, Space } from 'antd';
import { OrderDetail } from 'core/services/product';

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
        const data = resp.data.Data.account;
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
      AccountId: data?.AccountId,
      DisplayName: data?.DisplayName,
      LastName: data?.LastName,
      MidName: data.MidName,
      Email: data.Email,
      Address: data.Address,
      Mobile: data.Mobile,
      Intro: data.Intro,
    });
  };

  const handleEditProfile = (params: any) => {};

  useEffect(() => {
    LoadDetail();
  }, [ordersId]);

  return (
    <>
      <Form {...formItemLayout} form={form} name="register" onFinish={handleEditProfile} scrollToFirstError>
        <Form.Item name="AccountId" label="AccountId">
          <Input disabled={true} />
          {/* <Input /> */}
        </Form.Item>
        <Form.Item name="DisplayName" label="DisplayName">
          <Input />
        </Form.Item>
        <Form.Item name="Email" label="Email">
          <Input />
        </Form.Item>
        <Form.Item name="Mobile" label="Mobile">
          <Input />
        </Form.Item>
        <Form.Item name="Address" label="Address">
          <Input />
        </Form.Item>
        <Form.Item name="Intro" label="Intro">
          <Input />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
            <Button htmlType="button" onClick={onCloseModal}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default ModalEditStaffInfo;
