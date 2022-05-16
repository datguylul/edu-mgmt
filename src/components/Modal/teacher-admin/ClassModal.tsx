import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, Select, DatePicker, Typography, Divider } from 'antd';
import { ClassDetail, CreateClass, EditClass } from '@core/services/api';
import moment from 'moment';
import { openNotification } from '@utils/Noti';
import { CLASS_STATUS } from '@core/constants';

const { Option } = Select;

interface IModalInfo {
  studentSide?: boolean,
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

const ClassStatusList = [CLASS_STATUS.active, CLASS_STATUS.finish];

const ClassModal: React.FC<IModalInfo> = ({
  studentSide = false,
  classId = null,
  onCloseModal = () => { },
  onSubmitAndReload = () => { },
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState<any>(null);

  const LoadDetail = () => {
    setLoading(true);
    ClassDetail(classId!)
      .then((resp) => {
        const data = resp.data?.Data?.class;
        if (data) {
          setClassData(data);
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
            openNotification('Cập nhật lớp', 'Cập nhật lớp thành công', 'success');
          } else {
            openNotification('Cập nhật lớp', resp.data.Message, 'error');
          }
        })
        .catch((error) => {
          console.log('error', error);
          openNotification('Cập nhật lớp', 'Cập nhật lớp thất bại', 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      CreateClass(values)
        .then((resp) => {
          if (resp.data.Success) {
            openNotification('Thêm mới lớp', 'Thêm mới lớp thành công', 'success');
          } else {
            openNotification('Thêm mới lớp', resp.data.Message, 'error');
          }
        })
        .catch((error) => {
          console.log('error', error);
          openNotification('Thêm mới lớp', 'Thêm mới lớp thất bại', 'error');
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
    <div>
      <Form {...formItemLayout} form={form} name="register" onFinish={handleSubmit} scrollToFirstError>
        {studentSide ?
          <div>
            <Typography.Title level={4}>Thông tin lớp:</Typography.Title>
            <Typography>
              <pre>Tên lớp: {classData?.ClassName}</pre>
            </Typography>
            <Typography>
              <pre>Năm học: {classData?.ClassYear}</pre>
            </Typography>
            <Typography>
              <pre>Trạng thái: {ClassStatusList.find(x => x.value == classData?.ClassStatus)?.label}</pre>
            </Typography>

            <Divider />
            <Typography.Title level={4}>Giáo viên:</Typography.Title>
            <Typography>
              <pre>Họ tên: {classData?.Teacher?.TeacherName}</pre>
            </Typography>
            <Typography>
              <pre>Sđt: {classData?.Teacher?.TeacherPhone}</pre>
            </Typography>
            <Typography>
              <pre>Ngày sinh: {classData?.Teacher?.TeacherDob}</pre>
            </Typography>
            <Typography>
              <pre>Giới tính: {classData?.Teacher?.TeacherGender}</pre>
            </Typography>
            <Typography>
              <pre>Email: {classData?.Teacher?.TeacherEmail}</pre>
            </Typography>

            <Form.Item {...tailFormItemLayout}>
              <Space>
                <React.Fragment>
                  <Button htmlType="button" onClick={onCloseModal}>
                    Hủy
                  </Button>
                </React.Fragment>
              </Space>
            </Form.Item>
          </div>
          :
          <React.Fragment>
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
              <Select >
                {ClassStatusList.map((item: any) => (
                  <Option value={item?.value}>{item.label}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Space>
                <React.Fragment>
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
                </React.Fragment>
              </Space>
            </Form.Item>

          </React.Fragment>
        }
      </Form>
    </div>
  );
};

export default ClassModal;
