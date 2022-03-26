import React, { useState, useRef, useEffect } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Form, Input, Button, Space, DatePicker, Switch, Checkbox } from 'antd';
import moment from 'moment';
import { openNotification } from '@utils/Noti';
import { handleCloudinaryUpload } from 'core/services/cloudinaryUpload';
import { ClassList, CreateHomeWork, HomeWorkDetail } from '@core/services/api';
import { useRouter } from 'next/router';
import fileSaver from 'file-saver';

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

const index = () => {
  const router = useRouter();
  const { id: homeWorkId } = router.query;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const editor = useRef(null);
  const [describeContent, setDescribeContent] = useState('');
  const isSSR = typeof window === 'undefined';
  const [classData, setClassData] = useState([]);

  useEffect(() => {
    getHomeWorkDetail();
    getClassList();
  }, []);

  const getHomeWorkDetail = async () => {
    if (homeWorkId && homeWorkId !== undefined) {
      setLoading(true);
      HomeWorkDetail(homeWorkId! as string)
        .then((res: any) => {
          const data = res.data?.Data;
          if (data) {
            fillForm(data);
          }
        })
        .catch((error: any) => {
          console.log('error', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const fillForm = (data: any) => {
    console.log('data', data);

    form.setFieldsValue({
      HomeWorkName: data?.homeWork?.HomeWorkName,
      HomeWorkType: data?.homeWork?.HomeWorkType,
      DueDate: moment(data?.homeWork?.DueDate),
      CreatedDate: moment(data?.homeWork?.CreatedDate),
      RequiredLogin: data?.homeWork?.RequiredLogin,
      OnlyAssignStudent: data?.homeWork?.OnlyAssignStudent,
    });
    setFileList(data.files);
    setDescribeContent(data?.homeWork?.HomeWorkDescribe);
  };

  const getClassList = async () => {
    ClassList('', 'asc', 0, 10)
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
  };

  const handleSubmit = (values: any) => {
    setLoading(true);
    const params: any = {
      HomeWorkType: values.HomeWorkType.trim(),
      HomeWorkName: values.HomeWorkName.trim(),
      HomeWorkDescribe: describeContent,
      ClassList: values.ClassList,
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

    // console.log('values', params);

    CreateHomeWork(params)
      .then((res) => {
        if (res.data.Success) {
          openNotification('Tạo bài tập', 'Tạo bài tập thành công');
        } else {
          openNotification('Tạo bài tập', res.data?.Message);
        }
      })
      .catch((error) => {
        console.error(error);
        openNotification('Tạo bài tập', 'Đã có lỗi');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpload = (file: any) => {
    setUploading(true);
    handleCloudinaryUpload(file)
      .then((res: any) => {
        file.FileUploadUrl = res.secure_url;
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

  const saveManual = (item: any) => {
    fileSaver.saveAs(item.FileUploadUrl, item.FileUploadName);
  };

  return (
    <Layout title="Chi tiết bài tập" backButton backButtonUrl="/teacher/homework">
      {homeWorkId && homeWorkId !== undefined && (
        <Form {...formItemLayout} form={form} name="register" onFinish={handleSubmit} scrollToFirstError>
          <Form.Item name="CreatedDate" label="Ngày tạo" preserve={true}>
            <DatePicker showTime disabled={true} />
          </Form.Item>
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
          <Form.Item label="File bài tập">
            {fileList.map((item: any) => {
              return (
                <a key={item.FileUploadId} download={item.FileUploadName} onClick={() => saveManual(item)}>
                  {item.FileUploadName}
                </a>
              );
            })}
          </Form.Item>
          {/* <Form.Item label="File bài tập">
            <Upload multiple={true} beforeUpload={(file) => handleUpload(file)} name="logo" onRemove={handleRemoveFile}>
              <Button disabled={uploading || loading} loading={uploading || loading} icon={<UploadOutlined />}>
                Chọn File
              </Button>
            </Upload>
          </Form.Item> */}
          <Form.Item label="Đề bài / Mô tả">
            {!isSSR && (
              <React.Suspense fallback={<div>Đang tải soạn thảo</div>}>
                <Jodit
                  ref={editor}
                  value={describeContent}
                  config={{ readonly: false }}
                  onBlur={(newContent) => setDescribeContent(newContent)}
                  onChange={(newContent) => {}}
                />
              </React.Suspense>
            )}
          </Form.Item>
          <Form.Item label="Chỉ học sinh có trong danh sách" name="OnlyAssignStudent">
            <Switch />
          </Form.Item>
          <Form.Item label="Bắt đăng nhập" name="RequiredLogin">
            <Switch />
          </Form.Item>
          <Form.Item label="Lớp giao bài" name="ClassList">
            <Checkbox.Group options={classData} defaultValue={['Apple']} onChange={() => {}} />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                {'Cập nhật'}
              </Button>
              <Button htmlType="button" onClick={() => router.push('/teacher/homework/')}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Layout>
  );
};
export default withAuth(index);
