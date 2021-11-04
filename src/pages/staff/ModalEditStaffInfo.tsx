import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Checkbox, Row, Col, Form, Input, Button, Space } from 'antd';
import { getStaffDetail } from 'core/services/staff';

interface IModal {
  showModal?: boolean;
  onCloseModal?: () => void;
  onSubmitModal?: () => void;
  isChange?: (value: any) => void;
  userId?: string;
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
const ModalEditStaffInfo: React.FC<IModal> = ({}) => {
  const router = useRouter();
  const { slug } = router.query; // object destructuring
  const [form] = Form.useForm();
  const [staffData, setStaffData] = useState<any>({});
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };
  const LoadDetail = () => {
    getStaffDetail(slug!.toString())
      .then((resp) => {
        const data = resp.data?.Data?.product;
        if (data) {
          console.log('resp', resp.data?.Data.product);
          // setStaffData(resp.data?.Data.product);
          // fillForm(resp.data?.Data.product);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    LoadDetail();
  }, []);

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          residence: ['zhejiang', 'hangzhou', 'xihu'],
          prefix: '86',
        }}
        scrollToFirstError
      >
        <Form.Item name="ProductCode" label="Product Code">
          <Input value={staffData?.ProductCode} />
          {/* <Input /> */}
        </Form.Item>
        <Form.Item name="ProductId" label="ProductId">
          <Input />
        </Form.Item>
        <Form.Item name="Title" label="Title">
          <Input />
        </Form.Item>
        <Form.Item name="Price" label="Price">
          <Input />
        </Form.Item>
        <Form.Item name="Quantity" label="Quantity">
          <Input />
        </Form.Item>
        <Form.Item name="Slug" label="Slug">
          <Input />
        </Form.Item>
        <Form.Item name="Discount" label="Discount">
          <Input />
        </Form.Item>
        <Form.Item name="CreateDate" label="CreateDate">
          <Input />
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
      <Row>
        <Col xs={4}></Col>
        <Col xs={4}>View</Col>
        <Col xs={4}>Add</Col>
        <Col xs={4}>Edit</Col>
        <Col xs={4}>Delete</Col>
        <Col xs={4}>All</Col>
      </Row>
      <Row>
        <Col xs={4}></Col>
        <Col xs={4}>
          <Checkbox value="A" />
        </Col>
        <Col xs={4}>
          <Checkbox value="A" />
        </Col>
        <Col xs={4}>
          <Checkbox value="A" />
        </Col>
        <Col xs={4}>
          <Checkbox value="A" />
        </Col>
        <Col xs={4}>
          <Checkbox value="A" />
        </Col>
      </Row>
    </>
  );
};

export default ModalEditStaffInfo;
