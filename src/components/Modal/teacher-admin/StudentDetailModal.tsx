import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, Select, DatePicker, Tabs, Table } from 'antd';
import { ClassEditStudent, StudentDetail } from '@core/services/api';
import moment from 'moment';
import { openNotification } from '@utils/Noti';
const { Option } = Select;

interface IModalInfo {
  classId: string;
  studentId: string;
  onCloseModal?: () => void;
  onSubmitAndReload?: () => void;
}

const dateFormat = 'DD/MM/YYYY';

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

const fileExample = {
  fileUrl: 'https://res.cloudinary.com/dhi8xksch/raw/upload/v1650360615/tpt96vjetzt7ap6h2qug.xlsx',
  fileName: 'file_mau.xlsx',
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

const StudentDetailModal: React.FC<IModalInfo> = ({
  classId = null,
  studentId = null,
  onCloseModal = () => {},
  onSubmitAndReload = () => {},
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fillForm = (data: any) => {
    form.setFieldsValue({
      StudentName: data?.StudentName,
      StudentDob: moment(data?.StudentDob, dateFormat),
      StudentGender: data?.StudentGender,
      StudentPhone: data?.StudentPhone,
    });
  };

  useEffect(() => {
    getStudentDetail();
  }, []);

  const getStudentDetail = () => {
    setLoading(true);
    StudentDetail(studentId!)
      .then((res) => {
        fillForm(res.data?.Data?.student);
      })
      .catch((error) => {
        console.log('error', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (values: any) => {
    const params = {
      ...values,
      StudentId: studentId,
      StudentDob: values['StudentDob'].format(dateFormat),
    };

    ClassEditStudent(classId as string, params)
      .then((resp) => {
        console.log('resp', resp.data);
        if (resp.data.Success) {
          openNotification('Thêm học sinh', 'Thêm học sinh thành công', 'success');
        } else {
          openNotification('Thêm học sinh', resp.data.Message, 'error');
        }
      })
      .catch((error) => {
        console.log('error', error);
        openNotification('Thêm học sinh', 'Thêm học sinh thất bại', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form {...formItemLayout} form={form} name="register" onFinish={handleSubmit} scrollToFirstError>
      <Form.Item
        name="StudentName"
        label="Tên"
        rules={[
          {
            required: true,
            message: 'Tên học sinh không thể trống',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="StudentGender" label="Giới tính">
        <Select placeholder="Giới tinh">
          <Option value="Nam">Nam</Option>
          <Option value="Nữ">Nữ</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="StudentPhone"
        label="SĐT"
        rules={[
          {
            required: true,
            message: 'Số điện thoại học sinh không thể trống',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="StudentDob" label="Ngày sinh" rules={[{ required: true, message: 'Chọn ngày sinh!' }]}>
        <DatePicker format={dateFormat} />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            {'Sửa'}
          </Button>
          <Button htmlType="button" onClick={onCloseModal}>
            Hủy
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default StudentDetailModal;
