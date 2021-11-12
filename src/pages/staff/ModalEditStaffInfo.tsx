import React, { useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';

import { Checkbox, Row, Col, Form, Input, Button, Space } from 'antd';
import { getStaffDetail, editStaffDetail } from 'core/services/staff';

interface IStaffInfo {
  staffID?: string;
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
const ModalEditStaffInfo: React.FC<IStaffInfo> = ({ staffID, onCloseModal }) => {
  const [form] = Form.useForm();
  const LoadDetail = () => {
    getStaffDetail(staffID!.toString())
      .then((resp) => {
        const data = resp.data.Data.account;
        if (data) {
          console.log('resp', data);
          fillForm(data);
          console.log(`data.FirstName`, data.AccountId);
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

  const handleEditProfile = (params: any) => {
    editStaffDetail(params)
      .then((resp) => {
        console.log(resp.data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  useEffect(() => {
    LoadDetail();
  }, []);

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
        <Form.Item name="Right" label="Right">
          <Row>
            <Col xs={4}>
              <Checkbox value="A">View</Checkbox>
            </Col>
            <Col xs={4}>
              <Checkbox value="A">Add</Checkbox>
            </Col>
            <Col xs={4}>
              <Checkbox value="A">Edit</Checkbox>
            </Col>
            <Col xs={4}>
              <Checkbox value="A">Delete</Checkbox>
            </Col>
            <Col xs={4}>
              <Checkbox value="A">All</Checkbox>
            </Col>
          </Row>
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
