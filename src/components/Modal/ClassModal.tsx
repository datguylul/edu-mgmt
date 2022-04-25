import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, Select, DatePicker } from 'antd';
import { ClassDetail, CreateClass, EditClass } from '@core/services/api';
import moment from 'moment';
import { openNotification } from '@utils/Noti';
import { CLASS_STATUS } from '@core/constants';

const { Option } = Select;

interface IModalInfo {
  classId?: string;
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

const ClassStatusList = [CLASS_STATUS.active, CLASS_STATUS.finish, CLASS_STATUS.suspended];

const ClassModal: React.FC<IModalInfo> = ({
  classId = null,
  onCloseModal = () => {},
  onSubmitAndReload = () => {},
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const LoadDetail = () => {
    setLoading(true);
    ClassDetail(classId!)
      .then((resp) => {
        const data = resp.data?.Data?.class;
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
    const year = data?.ClassYear.split('-');

    const status = ClassStatusList.find((x) => x.value === data?.ClassStatus);

    form.setFieldsValue({
      ClassName: data?.ClassName,
      ClassYear: moment(year[0] + '-1-1'),
      ClassStatus: status?.value,
    });
  };

  const handleSubmit = (values: any) => {
    values.ClassYear = values['ClassYear']?.format('YYYY');

    if (classId && classId !== '') {
      setLoading(true);
      EditClass(classId!, values)
        .then((resp) => {
          if (resp.data.Success) {
            openNotification('Cập nhật lớp', 'Cập nhật lớp thành công');
          } else {
            openNotification('Cập nhật lớp', resp.data.Message);
          }
        })
        .catch((error) => {
          console.log('error', error);
          openNotification('Cập nhật lớp', 'Cập nhật lớp thất bại');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      CreateClass(values)
        .then((resp) => {
          if (resp.data.Success) {
            openNotification('Thêm mới lớp', 'Thêm mới lớp thành công');
          } else {
            openNotification('Thêm mới lớp', resp.data.Message);
          }
        })
        .catch((error) => {
          console.log('error', error);
          openNotification('Thêm mới lớp', 'Thêm mới lớp thất bại');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (classId && classId !== '') {
      LoadDetail();
    }
  }, [classId]);

  return (
    <Form {...formItemLayout} form={form} name="register" onFinish={handleSubmit} scrollToFirstError>
      <Form.Item
        name="ClassName"
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
        name="ClassYear"
        label="Năm học"
        rules={[{ type: 'object' as const, required: true, message: 'Chọn năm học!' }]}
      >
        <DatePicker picker="year" />
      </Form.Item>
      <Form.Item name="ClassStatus" label="Trạng thái">
        <Select>
          {ClassStatusList.map((item: any) => (
            <Option value={item?.value}>{item.label}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            {classId && classId !== '' ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          <Button htmlType="button" onClick={onCloseModal}>
            Hủy
          </Button>
          {classId && classId !== '' && (
            <Button type="ghost" htmlType="button" onClick={onSubmitAndReload}>
              Xóa
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ClassModal;
