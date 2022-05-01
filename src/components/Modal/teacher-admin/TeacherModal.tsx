import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, Select, DatePicker } from 'antd';
import { TeacherDetail, EditTeacher } from '@core/services/api';
import moment from 'moment';
import { openNotification } from '@utils/Noti';

const { Option } = Select;

interface IModalInfo {
  teacherId?: string;
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

const TeacherModal: React.FC<IModalInfo> = ({
  teacherId = null,
  onCloseModal = () => {},
  onSubmitAndReload = () => {},
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const LoadDetail = () => {
    setLoading(true);
    TeacherDetail(teacherId!)
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
      TeacherName: data?.teacher?.TeacherName,
      ShowTeacherId: data?.teacher?.ShowTeacherId,
      TeacherAddress: data?.teacher?.TeacherAddress,
      TeacherDOB: data?.teacher?.TeacherDOB,
      TeacherDescription: data?.teacher?.TeacherDescription,
      TeacherEmail: data?.teacher?.TeacherEmail,
      TeacherGender: data?.teacher?.TeacherGender,
      TeacherImage: data?.teacher?.TeacherImage,
      TeacherPhone: data?.teacher?.TeacherPhone,
    });
  };

  const handleSubmit = (values: any) => {
    if (teacherId && teacherId !== '') {
      setLoading(true);
      EditTeacher(teacherId, values)
        .then((resp) => {
          if (resp.data.Success) {
            openNotification('Cập nhật giáo viên', 'Cập nhật giáo viên thành công', 'success');
          } else {
            openNotification('Cập nhật giáo viên', resp.data.Message, 'error');
          }
        })
        .catch((error) => {
          console.log('error', error);
          openNotification('Cập nhật giáo viên', 'Cập nhật giáo viên thất bại', 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // setLoading(true);
      // Create(values)
      //   .then((resp) => {
      //     if (resp.data.Success) {
      //       openNotification('Thêm mới giáo viên', 'Thêm mới giáo viên thành công');
      //     } else {
      //       openNotification('Thêm mới giáo viên', resp.data.Message);
      //     }
      //   })
      //   .catch((error) => {
      //     console.log('error', error);
      //     openNotification('Thêm mới giáo viên', 'Thêm mới giáo viên thất bại');
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
    if (teacherId && teacherId !== '') {
      LoadDetail();
    }
  }, [teacherId]);

  return (
    <Form {...formItemLayout} form={form} name="register" onFinish={handleSubmit} scrollToFirstError>
      {teacherId && (
        <Form.Item name="ShowClassId" label="Mã giáo viên">
          <Input disabled={true} />
        </Form.Item>
      )}
      <Form.Item
        name="TeacherName"
        label="Tên"
        rules={[
          {
            required: true,
            message: 'Tên giáo viên không thể trống',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="TeacherGender" label="Giới tính">
        <Input />
      </Form.Item>
      <Form.Item name="TeacherDOB" label="Ngày sinh">
        <Input />
      </Form.Item>
      <Form.Item name="TeacherEmail" label="Email">
        <Input />
      </Form.Item>
      <Form.Item name="TeacherPhone" label="SĐT">
        <Input />
      </Form.Item>
      {/* <Form.Item
        name="TeacherDOB"
        label="Ngày sinh"
      >
        <DatePicker />
      </Form.Item> */}
      <Form.Item name="TeacherAddress" label="Địa chỉ">
        <Input />
      </Form.Item>
      <Form.Item name="TeacherDescription" label="Mô tả">
        <Input />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            {teacherId && teacherId !== '' ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          <Button htmlType="button" onClick={onCloseModal}>
            Hủy
          </Button>
          {teacherId && teacherId !== '' && (
            <Button type="ghost" htmlType="button" onClick={onSubmitAndReload}>
              Xóa
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default TeacherModal;
