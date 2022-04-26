import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, Select, DatePicker } from 'antd';
import { UserDetail } from '@core/services/api';
import moment from 'moment';
import { openNotification } from '@utils/Noti';

const { Option } = Select;

interface IModalInfo {
  userId?: string;
  onCloseModal?: () => void;
  onSubmitAndReload?: () => void;
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

const UserModal: React.FC<IModalInfo> = ({ userId = null, onCloseModal = () => {}, onSubmitAndReload = () => {} }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const LoadDetail = () => {
    setLoading(true);
    UserDetail(userId!)
      .then((resp) => {
        const data = resp.data?.Data;
        if (data) {
          fillForm(data);
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
      UserUsername: data?.account.UserUsername,
      Username: data?.account.Username,
      RoleName: data?.roles[0].RoleName,
      RoleCode: data?.roles[0].RoleId,
    });
  };

  const handleSubmit = (values: any) => {};

  useEffect(() => {
    if (userId && userId !== '') {
      LoadDetail();
    }
  }, [userId]);

  return (
    <Form {...formItemLayout} form={form} name="register" onFinish={handleSubmit} scrollToFirstError>
      <Form.Item name="UserUsername" label="Tên đăng nhập" preserve={true}>
        <Input disabled={true} />
      </Form.Item>
      <Form.Item
        name="Username"
        label="Tên người dùng"
        rules={[
          {
            required: true,
            message: 'Tên người dùng không thể trống',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="RoleCode" label="Mã phân quyền" preserve={true}>
        <Input disabled={true} />
      </Form.Item>
      <Form.Item name="RoleName" label="Quyền" preserve={true}>
        <Input disabled={true} />
      </Form.Item>
      {/* <Form.Item
          name="ShowClassId"
          label=""
          rules={[{ type: 'object' as const, required: true, message: 'Please select time!' }]}
        >
          <DatePicker picker="year" />
        </Form.Item> */}
      <Form.Item {...tailFormItemLayout}>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            {userId && userId !== '' ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          <Button htmlType="button" onClick={onCloseModal}>
            Hủy
          </Button>
          {userId && userId !== '' && (
            <Button type="ghost" htmlType="button" onClick={onSubmitAndReload}>
              Xóa
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UserModal;
