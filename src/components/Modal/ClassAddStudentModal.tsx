import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, Select, DatePicker, Tabs, Upload, Table } from 'antd';
import { ClassAddStudent, StudentReadExcel } from '@core/services/api';
import moment from 'moment';
import { openNotification } from '@utils/Noti';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { saveFile } from '@utils/FileUtil';
const { TabPane } = Tabs;
const { Option } = Select;

const { Dragger } = Upload;

interface IModalInfo {
  classId: string;
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

const ClassAddStudentModal: React.FC<IModalInfo> = ({
  classId = null,
  onCloseModal = () => {},
  onSubmitAndReload = () => {},
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileUpload, setFileUpload] = useState<object | null>(null);
  const [studentData, setStudentData] = useState([]);

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
    const params = {
      classId: classId,
      studentList: [values],
    };

    addStudents(params);
  };

  const addStudents = (params: object) => {
    setLoading(true);
    ClassAddStudent(params)
      .then((resp) => {
        if (resp.data.Success) {
          openNotification('Thêm học sinh', 'Thêm học sinh thành công');
        } else {
          openNotification('Thêm học sinh', resp.data.Message);
        }
      })
      .catch((error) => {
        console.log('error', error);
        openNotification('Thêm học sinh', 'Thêm học sinh thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const saveManual = () => {
    saveFile(fileExample.fileUrl, fileExample.fileName);
  };

  const handleReadExcel = () => {
    let formData = new FormData();
    formData.append('file', fileUpload);

    setUploading(true);
    StudentReadExcel(formData)
      .then((res: any) => {
        console.log('res', res);
        setStudentData(res.data?.Data || []);
      })
      .catch((err: any) => {
        console.error(err);
        openNotification('Đọc file', 'Đã có lỗi');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleImportExcel = () => {
    const params = {
      classId: classId,
      studentList: studentData,
    };
    addStudents(params);
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'StudentName',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'StudentDob',
    },
    {
      title: 'Giới tính',
      dataIndex: 'StudentGender',
    },
    {
      title: 'Sđt',
      dataIndex: 'StudentPhone',
    },
  ];

  return (
    <Tabs defaultActiveKey="1" onChange={() => {}}>
      <TabPane tab="Thêm thủ công" key="2">
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
            <Input />
          </Form.Item>
          <Form.Item name="StudentDOB" label="Ngày sinh">
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
          <Form.Item {...tailFormItemLayout}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                {'Thêm vào lớp'}
              </Button>
              <Button htmlType="button" onClick={onCloseModal}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </TabPane>
      <TabPane tab="Nhập từ file" key="1">
        <div>
          <p>
            File mẫu:{' '}
            <a download={fileExample.fileName} onClick={saveManual}>
              file_mau.xlsx
            </a>
          </p>
        </div>
        <div>
          <Upload
            multiple={true}
            beforeUpload={(file) => setFileUpload(file)}
            name="logo"
            onRemove={() => setFileUpload(null)}
          >
            <Button disabled={uploading || loading} loading={uploading || loading} icon={<UploadOutlined />}>
              Chọn File
            </Button>
          </Upload>
          {fileUpload && (
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading} onClick={handleReadExcel}>
              {'Đọc file học sinh'}
            </Button>
          )}
          {fileUpload && studentData.length > 0 && (
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading} onClick={handleImportExcel}>
              {'Hoàn tấp nhập file'}
            </Button>
          )}

          <Table columns={columns} dataSource={studentData} pagination={false} />
        </div>
      </TabPane>
    </Tabs>
  );
};

export default ClassAddStudentModal;