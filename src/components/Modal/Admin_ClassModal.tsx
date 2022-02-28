import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, Select, DatePicker } from 'antd';
import { CreateClass } from '@core/services/api';
import moment from 'moment';
import { openNotification } from '@utils/Noti';

const { Option } = Select;

interface IStaffInfo {
  classId?: string;
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

const Admin_ClassModal: React.FC<IStaffInfo> = ({ classId }) => {
  const [form] = Form.useForm();
  const [caLam, setCaLam] = useState(1);

  const onFinish = (values: any) => {
    const year = values['year']?.format('YYYY');
    if (!year) {
    }
    const yearEnd = moment(year).add(1, 'years').format('YYYY');

    const params = {
      clazzName: values.clazzName,
      year: year + '-' + yearEnd,
      groupId: null,
    };
    CreateClass(params)
      .then((resp) => {
        console.log('resp', resp.data);
        openNotification('Tạo mới lớp', 'Tạo mới lớp thành công');
      })
      .catch((error) => {
        console.log('error', error);
        openNotification('Tạo mới lớp', 'Có lỗi khi tạo mới lớp');
      });
  };

  return (
    <>
      <Form {...formItemLayout} form={form} name="register" onFinish={onFinish} scrollToFirstError>
        <Form.Item
          name="clazzName"
          label="Tên lớp"
          rules={[
            {
              required: true,
              message: 'Tên lớp không thể trống',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="year"
          label="Năm học"
          rules={[{ type: 'object' as const, required: true, message: 'Please select time!' }]}
        >
          <DatePicker picker="year" />
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
