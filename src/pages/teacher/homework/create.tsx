import React, { useState, useRef, useEffect } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Form, Input, Button, Space, DatePicker, Upload, Checkbox, Switch } from 'antd';
import moment from 'moment';
import { openNotification } from '@utils/Noti';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { handleCloudinaryUpload } from 'core/services/cloudinaryUpload';
import { ClassList, CreateHomeWork } from '@core/services/api';
import router from 'next/router';

const Jodit = React.lazy(() => {
  return import('jodit-react');
});

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

const create = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [fileListUpload, setFileListUpload] = useState<any>([]);
  const editor = useRef(null);
  const [describeContent, setDescribeContent] = useState('');
  const isSSR = typeof window === 'undefined';
  const [classData, setClassData] = useState([]);

  useEffect(() => {
    ClassList('', 1, 0, 10)
      .then((resp: any) => {
        const classes = resp.data?.Data?.Data.map((item: any) => ({
          ...item,
          label: item.ClassName + ` (${item.ClassYear})`,
          value: item.ClassId,
        }));
        // let classes = objArray.map(({ foo }) => foo)

        setClassData(classes);
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  }, []);

  const handleSubmit = (values: any) => {
    setLoading(true);
    const params: any = {
      HomeWorkType: values.HomeWorkType.trim(),
      HomeWorkName: values.HomeWorkName.trim(),
      homeWorkContent: describeContent,
      ClassList: values.ClassList,
      OnlyAssignStudent: values.OnlyAssignStudent,
      RequiredLogin: values.RequiredLogin,
    };

    if (values.DueDate) {
      params.DueDate = moment(values.DueDate).unix();
    }

    if (fileList.length > 0) {
      const files: any = [];
      fileList.forEach((item: any) => {
        files.push({
          FileUploadUrl: item.FileUploadUrl,
          FileUploadName: item.FileUploadName,
        });
      });
      params.FileList = files;
    }

    CreateHomeWork(params)
      .then((res) => {
        if (res.data.Success) {
          openNotification('Tạo bài tập', 'Tạo bài tập thành công', 'success');
          router.push('/teacher/homework');
        } else {
          openNotification('Tạo bài tập', res.data?.Message, 'error');
        }
      })
      .catch((error) => {
        console.error(error);
        openNotification('Tạo bài tập', 'Đã có lỗi', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpload = (file: any) => {
    const sizeLimit = 10;
    const filesLimit = 5;
    const fileCheck = (file.size / 1024 / 1024) > sizeLimit;

    const fileList = [...fileListUpload, file];

    if (fileCheck) {
      openNotification('Upload File', `File không được quá ${sizeLimit}mb`, 'error');
      return;
    }
    if (fileList.length > filesLimit) {
      openNotification('Upload File', `Tối đa ${filesLimit} tệp tin tải lên`, 'error');
      return;
    }

    setUploading(true);
    handleCloudinaryUpload(file)
      .then((res: any) => {
        file.FileUploadUrl = res.secure_url;
        file.FileUploadName = file.name;
        const files = [...fileList, file];
        setFileList(files as any);
        setFileListUpload(fileList);
      })
      .catch((err: any) => {
        console.error(err);
        openNotification('Upload File', 'Đã có lỗi', 'error');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleRemoveFile = (file: any) => {
    const files = [...fileList];
    const removedFiles = files.filter(function (e: any) {
      return e.uid !== file.uid;
    });
    setFileList(removedFiles);
  };

  const handleChange = (info: any) => {
  };

  return (
    <Layout title="Thêm mới bài tập" backButton backButtonUrl="/teacher/homework">
      <Form {...formItemLayout} form={form} name="register" onFinish={handleSubmit} scrollToFirstError>
        <Form.Item
          name="HomeWorkName"
          label="Tên bài tập"
          rules={[
            {
              required: true,
              message: 'Tên bài tập không thể trống',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          //  extra="Là bài "
          name="HomeWorkType"
          label="Loại bài tập"
          rules={[
            {
              required: true,
              message: 'Loại bài tập không thể trống',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="DueDate" label="Hạn nộp">
          <DatePicker showTime disabledDate={(d) => !d || d.isBefore(Date.now())} />
        </Form.Item>
        <Form.Item label="File bài tập">
          <Upload
            fileList={fileListUpload}
            onChange={handleChange}
            beforeUpload={(file) => handleUpload(file)}
            name="logo"
            onRemove={handleRemoveFile}
            accept={'.doc,.docx,application/vnd.ms-excel,.pdf,.png,.jpeg,.jpg'}
          >
            <Button disabled={uploading || loading} loading={uploading || loading} icon={<UploadOutlined />}>
              Chọn File
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item label="Đề bài / Mô tả">
          {!isSSR && (
            <React.Suspense fallback={<div>Đang tải soạn thảo</div>}>
              <Jodit
                ref={editor}
                value={describeContent}
                config={{ readonly: false }}
                onBlur={(newContent) => setDescribeContent(newContent)}
                onChange={(newContent) => { }}
              />
            </React.Suspense>
          )}
        </Form.Item>
        <Form.Item label="Chỉ học sinh có trong danh sách" name="OnlyAssignStudent">
          <Switch />
        </Form.Item>
        {/* <Form.Item label="Bắt đăng nhập" name="RequiredLogin">
          <Switch />
        </Form.Item> */}
        <Form.Item
          label="Lớp giao bài"
          name="ClassList"
          rules={[
            {
              required: true,
              message: 'Chọn lớp',
            },
          ]}
        >
          <Checkbox.Group options={classData} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              {'Thêm mới'}
            </Button>
            <Button htmlType="button">Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </Layout>
  );
};
export default withAuth(create);
