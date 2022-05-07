import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, Select, DatePicker, Tabs, Upload, Table } from 'antd';
import { ClassAddStudent, StudentReadExcel, StudentDetailPhone } from '@core/services/api';
import moment from 'moment';
import { openNotification } from '@utils/Noti';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { saveFile } from '@utils/FileUtil';
const { TabPane } = Tabs;
const { Option } = Select;

const { Dragger } = Upload;

const dateFormat = 'DD/MM/YYYY';

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
  id: 'ityus3zhytcz0pthgomg.xlsx',
  fileUrl: 'https://res.cloudinary.com/dhi8xksch/raw/upload/v1651215105/ityus3zhytcz0pthgomg.xlsx',
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
  const [phone, setPhone] = useState<string>('');

  const handleFindStudent = () => {
    setLoading(true);
    StudentDetailPhone(phone)
      .then((res) => {
        if (res.data?.Data?.student) {
          fillForm(res.data?.Data?.student);
        }
      })
      .catch((error) => {
        console.log('error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fillForm = (data: any) => {
    form.setFieldsValue({
      StudentName: data?.StudentName,
      StudentDOB: moment(data?.StudentDob, dateFormat),
      StudentGender: data?.StudentGender,
      StudentPhone: data?.StudentPhone,
    });
  };

  const handleSubmit = (values: any) => {
    values.StudentDOB = values['StudentDOB'].format('DD/MM/YYYY');
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

  const saveManual = () => {
    saveFile(fileExample.fileUrl, fileExample.fileName);
  };

  const handleReadExcel = () => {
    let formData = new FormData();
    formData.append('file', fileUpload);

    setUploading(true);
    StudentReadExcel(formData)
      .then((res: any) => {
        setStudentData(res.data?.Data || []);
      })
      .catch((err: any) => {
        console.error(err);
        openNotification('Đọc file', 'Đã có lỗi', 'error');
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
      <TabPane tab="Thêm thủ công" key="1">
        <Form {...formItemLayout} form={form} name="register" onFinish={handleSubmit} scrollToFirstError>
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
            <Input.Group compact>
              <Input
                style={{ width: 'calc(100% - 200px)' }}
                value={phone}
                onChange={({ target: { value } }) => setPhone(value)}
              />
              <Button type="primary" loading={loading} disabled={loading} onClick={handleFindStudent}>
                {' '}
                {'Tìm học sinh'}
              </Button>
            </Input.Group>
          </Form.Item>
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
          <Form.Item name="StudentDOB" label="Ngày sinh" rules={[{ required: true, message: 'Chọn ngày sinh!' }]}>
            <DatePicker format={dateFormat} />
          </Form.Item>
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
      <TabPane tab="Nhập từ file" key="2">
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
