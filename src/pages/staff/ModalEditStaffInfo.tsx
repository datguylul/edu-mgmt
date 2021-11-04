import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Checkbox, Row, Col, Form, Input, Button, Space } from 'antd';
import { getStaffDetail } from 'core/services/staff';

interface IStaffInfo {
  staffID?: string;
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
const ModalEditStaffInfo: React.FC<IStaffInfo> = ({ staffID }) => {
  const [form] = Form.useForm();
  const [staffData, setStaffData] = useState<any>({});
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };
  const LoadDetail = () => {
    getStaffDetail(staffID!.toString())
      .then((resp) => {
        const data = resp.data.Data.account_info;
        if (data) {
          console.log('resp', data);
          setStaffData(data);
          fillForm(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fillForm = (data: any) => {
    form.setFieldsValue({
      FirstName: data?.FirstName,
      LastName: data?.LastName,
      MidName: data.MidName,
      Email: data.Email,
      Country: data.Country,
      Mobile: data.Mobile,
      Intro: data.Intro,
    });
  };

  useEffect(() => {
    LoadDetail();
  }, []);

  return (
    <>
      <Form {...formItemLayout} form={form} name="register" onFinish={onFinish} scrollToFirstError>
        <Form.Item name="FirstName" label="FirstName">
          <Input />
          {/* <Input /> */}
        </Form.Item>
        <Form.Item name="MidName" label="MidName">
          <Input />
        </Form.Item>
        <Form.Item name="LastName" label="LastName">
          <Input />
        </Form.Item>
        <Form.Item name="Email" label="Email">
          <Input />
        </Form.Item>
        <Form.Item name="Mobile" label="Mobile">
          <Input />
        </Form.Item>
        <Form.Item name="Country" label="Country">
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
            <Button htmlType="button" onClick={() => null}>
              Delete
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default ModalEditStaffInfo;
