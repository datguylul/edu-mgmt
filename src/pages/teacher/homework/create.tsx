import React, { useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Form, Input, Button, Space, DatePicker, Upload } from 'antd';
import moment from 'moment';
import { openNotification } from '@utils/Noti';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { handleCloudinaryUpload } from 'core/services/cloudinaryUpload';

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

  const handleSubmit = (values: any) => {
    setLoading(true);
    const params: any = {
      HomeWorkType: values.HomeWorkType.trim(),
      HomeWorkName: values.HomeWorkName.trim(),
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

    console.log('values', params);
    setLoading(false);
  };

  const handleUpload = (file: any) => {
    setUploading(true);
    handleCloudinaryUpload(file)
      .then((res: any) => {
        file.FileUploadUrl = res.url;
        file.FileUploadName = res.original_filename;
        const files = [...fileList, file];
        setFileList(files as any);
      })
      .catch((err: any) => {
        console.error(err);
        openNotification('Upload Ảnh', 'Đã có lỗi');
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

  return (
    <Layout title="Thêm mới bài tập" backButton>
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
          <DatePicker showTime />
        </Form.Item>
        <Form.Item label="Hạn nộp">
          <Upload multiple={true} beforeUpload={(file) => handleUpload(file)} name="logo" onRemove={handleRemoveFile}>
            <Button disabled={uploading || loading} loading={uploading || loading} icon={<UploadOutlined />}>
              Chọn File
            </Button>
          </Upload>
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
