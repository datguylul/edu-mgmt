import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, Space, Select, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {} from '@core/services/api';
const { Option } = Select;

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

const Admin_ClassModal: React.FC<IStaffInfo> = () => {
  const [form] = Form.useForm();
  const [caLam, setCaLam] = useState(1);

  const onFinish = (values: any) => {
    const params = {};
    console.log('Received: ', params);
  };

  return (
    <>
      <Form {...formItemLayout} form={form} name="register" onFinish={onFinish} scrollToFirstError>
        <Form.Item name="caLam" label="Ca Làm">
          <Select defaultValue={'1'} style={{ width: 120 }} onChange={() => {}}>
            <Option value={'1'}>Ca 1</Option>
            <Option value={'2'}>Ca 2</Option>
            <Option value={'3'}>Ca 3</Option>
          </Select>
        </Form.Item>
        <Form.Item name="sanLuongThucTe" label="Sản Lượng Thực Tế">
          <Input />
        </Form.Item>
        <Form.Item name="soLoSanPham" label="Số Lô Sản Phẩm">
          <Input />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Thêm mới
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default Admin_ClassModal;
