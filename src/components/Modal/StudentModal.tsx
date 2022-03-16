import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, Select, DatePicker } from 'antd';
import { StudentDetail, EditStudent } from '@core/services/api';
import moment from 'moment';
import { openNotification } from '@utils/Noti';

const { Option } = Select;

interface IModalInfo {
  studentId?: string;
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

const ClassModal: React.FC<IModalInfo> = ({
  studentId = null,
  onCloseModal = () => {},
  onSubmitAndReload = () => {},
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const LoadDetail = () => {
    setLoading(true);
    StudentDetail(studentId!)
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
      StudentName: data?.student?.StudentName,
      ShowStudentId: data?.student?.ShowStudentId,
      StudentAddress: data?.student?.StudentAddress,
      StudentDOB: data?.student?.StudentDOB,
      StudentDescription: data?.student?.StudentDescription,
      StudentEmail: data?.student?.StudentEmail,
      StudentGender: data?.student?.StudentGender,
      StudentImage: data?.student?.StudentImage,
      StudentPhone: data?.student?.StudentPhone,
    });
  };

  const handleSubmit = (values: any) => {
    if (studentId && studentId !== '') {
      setLoading(true);
      EditStudent(studentId, values)
        .then((resp) => {
          if (resp.data.Success) {
            openNotification('Cập nhật học sinh', 'Cập nhật học sinh thành công');
          } else {
            openNotification('Cập nhật học sinh', resp.data.Message);
          }
        })
        .catch((error) => {
          console.log('error', error);
          openNotification('Cập nhật học sinh', 'Cập nhật học sinh thất bại');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // setLoading(true);
      // Create(values)
      //   .then((resp) => {
      //     if (resp.data.Success) {
      //       openNotification('Thêm mới học sinh', 'Thêm mới học sinh thành công');
      //     } else {
      //       openNotification('Thêm mới học sinh', resp.data.Message);
      //     }
      //   })
      //   .catch((error) => {
      //     console.log('error', error);
      //     openNotification('Thêm mới học sinh', 'Thêm mới học sinh thất bại');
      //   })
      //   .finally(() => {
      //     setLoading(false);
      //   });
    }
  };

  const handleTitleChange = ({ target }: any) => {
    form.setFieldsValue({
      ShowClassId: target.value,
    });
  };

  useEffect(() => {
    if (studentId && studentId !== '') {
      LoadDetail();
    }
  }, [studentId]);

  return (
    <Form {...formItemLayout} form={form} name="register" onFinish={handleSubmit} scrollToFirstError>
      {studentId && (
        <Form.Item name="ShowStudentId" label="Mã học sinh">
          <Input disabled={true} />
        </Form.Item>
      )}
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
        <Input />
      </Form.Item>
      <Form.Item name="StudentDOB" label="Ngày sinh">
        <Input />
      </Form.Item>
      <Form.Item name="StudentEmail" label="Email">
        <Input />
      </Form.Item>
      <Form.Item name="StudentPhone" label="SĐT">
        <Input />
      </Form.Item>
      {/* <Form.Item
        name="StudentDOB"
        label="Ngày sinh"
      >
        <DatePicker />
      </Form.Item> */}
      <Form.Item name="StudentAddress" label="Địa chỉ">
        <Input />
      </Form.Item>
      <Form.Item name="StudentDescription" label="Mô tả">
        <Input />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            {studentId && studentId !== '' ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          <Button htmlType="button" onClick={onCloseModal}>
            Hủy
          </Button>
          {studentId && studentId !== '' && (
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
