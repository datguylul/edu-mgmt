import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, Select, DatePicker } from 'antd';
import { SchoolYearDetail, CreateSchoolYear, EditSchoolYear } from '@core/services/api';
import moment from 'moment';
import { openNotification } from '@utils/Noti';

const { Option } = Select;

interface IModalInfo {
  schoolYearId?: string;
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

const SchoolYearModal: React.FC<IModalInfo> = ({
  schoolYearId = null,
  onCloseModal = () => {},
  onSubmitAndReload = () => {},
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const LoadDetail = () => {
    setLoading(true);
    SchoolYearDetail(schoolYearId!)
      .then((resp) => {
        const data = resp.data?.Data?.year;
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
      ActiveYear: data?.ActiveYear,
      SchoolYearDate: data?.SchoolYearDate,
      SchoolYearName: data?.SchoolYearName,
    });
  };

  const handleSubmit = (values: any) => {
    if (schoolYearId && schoolYearId !== '') {
      setLoading(true);
      EditSchoolYear(schoolYearId, values)
        .then((resp) => {
          if (resp.data.Success) {
            openNotification('Cập nhật năm học', 'Cập nhật năm học thành công');
          } else {
            openNotification('Cập nhật năm học', resp.data.Message);
          }
        })
        .catch((error) => {
          console.log('error', error);
          openNotification('Cập nhật năm học', 'Cập nhật năm học thất bại');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      CreateSchoolYear(values)
        .then((resp) => {
          if (resp.data.Success) {
            openNotification('Thêm mới năm học', 'Thêm mới năm học thành công');
          } else {
            openNotification('Thêm mới năm học', resp.data.Message);
          }
        })
        .catch((error) => {
          console.log('error', error);
          openNotification('Thêm mới năm học', 'Thêm mới năm học thất bại');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleTitleChange = ({ target }: any) => {
    form.setFieldsValue({
      ShowClassId: target.value,
    });
  };

  useEffect(() => {
    if (schoolYearId && schoolYearId !== '') {
      LoadDetail();
    }
  }, [schoolYearId]);

  return (
    <Form {...formItemLayout} form={form} name="register" onFinish={handleSubmit} scrollToFirstError>
      <Form.Item name="SchoolYearName" label="Tên năm học">
        <Input disabled={true} />
      </Form.Item>
      <Form.Item name="SchoolYearDate" label="Thời gian học">
        <Input disabled={true} />
      </Form.Item>
      <Form.Item
        name="ActiveYear"
        label="Năm hoạt động"
        rules={[
          {
            required: true,
            message: 'Năm học không thể trống',
          },
        ]}
      >
        <Input onChange={handleTitleChange} />
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
            {schoolYearId && schoolYearId !== '' ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          <Button htmlType="button" onClick={onCloseModal}>
            Hủy
          </Button>
          {schoolYearId && schoolYearId !== '' && (
            <Button type="ghost" htmlType="button" onClick={onSubmitAndReload}>
              Xóa
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SchoolYearModal;
