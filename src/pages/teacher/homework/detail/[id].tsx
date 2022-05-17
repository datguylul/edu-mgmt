import React, { useState, useRef, useEffect } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import {
  Form,
  Input,
  Button,
  Space,
  DatePicker,
  Switch,
  Checkbox,
  Table,
  Col,
  Typography,
  Upload,
  Select,
  Modal,
  Tabs,
} from 'antd';
import moment from 'moment';
import { openNotification } from '@utils/Noti';
import { handleCloudinaryUpload } from 'core/services/cloudinaryUpload';
import { ClassList, HomeWorkEdit, HomeWorkDetail, AnswerList } from '@core/services/api';
import { useRouter } from 'next/router';
import { saveFile } from '@utils/FileUtil';
import { InfoOutlined, FormOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { HOME_WORK_STATUS } from '@core/constants';
import AnswerModal from 'components/Modal/teacher-admin/AnswerModal';

const { Option } = Select;

const HomeWorkStatusList = [HOME_WORK_STATUS.active, HOME_WORK_STATUS.finish];

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
  const [homeWorkData, setHomeWorkData] = useState<any>(null);
  const [classCheckedList, setClassCheckedList] = useState<object>([]);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [answerId, setAnswerId] = useState<string>('');
  const [defaultFileList, setDefaultFileList] = useState<any>(null);
  const [studentSubmitList, setStudentSubmitList] = useState<any>([]);
  const [classSelect, setClassSelect] = useState<string | number | null>(null);
  const [fileListUpload, setFileListUpload] = useState<any>([]);

  useEffect(() => {
    getClassList();
  }, []);
  useEffect(() => {
    getStudentSubmitList();
  }, [classSelect]);

  const handleSetSelectChange = (value: string | number) => {
    if (value === '0') {
      setClassSelect(null);
    } else {
      setClassSelect(value);
    }
  };

  const getStudentSubmitList = () => {
    AnswerList(homeWorkId as string, classSelect)
      .then((res) => {
        const data = res.data?.Data?.Data;
        if (data) {
          const dataMap = data.map((item: any) => ({ ...item, Result: item?.Result?.[0] }));
          setStudentSubmitList(dataMap);
        }
      })
      .catch((error) => {
        console.log('error', error);
      })
      .finally(() => { });
  };

  useEffect(() => {
    if (!showModal) {
      getHomeWorkDetail();
    }
  }, [showModal]);

  const getHomeWorkDetail = async () => {
    if (homeWorkId && homeWorkId !== undefined) {
      setLoading(true);
      HomeWorkDetail(homeWorkId! as string)
        .then((res: any) => {
          const data = res.data?.Data;
          if (data) {
            setHomeWorkData(data);
            fillForm(data);
          }
        })
        .catch((error: any) => {
          console.log('error', error);
          openNotification('Thông tin bài tập', 'Đã có lỗi khi lấy thông tin bài tập', 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const fillForm = (data: any) => {
    const status = HomeWorkStatusList.find((x) => x.value === data?.homeWork?.HomeWorkStatus);

    form.setFieldsValue({
      HomeWorkName: data?.homeWork?.HomeWorkName,
      HomeWorkType: data?.homeWork?.HomeWorkType,
      CreatedDate: moment(data?.homeWork?.CreatedDate),
      DueDate: moment(data?.homeWork?.DueDate),
      RequiredLogin: data?.homeWork?.RequiredLogin,
      OnlyAssignStudent: data?.homeWork?.OnlyAssignStudent,
      HomeWorkStatus: status?.value,
    });

    let checkedClass: string[] = [];
    data?.class.forEach((item: any) => {
      checkedClass.push(item.ClassId);
    });
    setClassCheckedList(checkedClass);

    setFileList(data.files);
    const defaultFilesList = data.files.map((item: any) => ({
      uid: item.FileUploadId,
      name: item.FileUploadName,
      status: 'done',
      url: item.FileUploadUrl,
    }));
    setDefaultFileList(defaultFilesList);
    setFileListUpload(defaultFilesList);
    setDescribeContent(data?.homeWork?.HomeWorkContent);
  };

  const getClassList = async () => {
    ClassList('', 1, 0, 10)
      .then((resp: any) => {
        const classes = resp.data?.Data?.Data.map((item: any) => ({
          // label: item.ClassName + ` (${item.ClassYear})`,
          label: item.ClassName,
          value: item.ClassId,
        }));

        setClassData(classes);
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  };

  const handleSubmit = (values: any) => {
    // setLoading(true);
    const params: any = {
      HomeWorkType: values.HomeWorkType.trim(),
      HomeWorkName: values.HomeWorkName.trim(),
      homeWorkContent: describeContent,
      ClassList: values.ClassList,
      OnlyAssignStudent: values.OnlyAssignStudent,
      RequiredLogin: values.RequiredLogin,
      HomeWorkStatus: values.HomeWorkStatus,
    };

    if (values.DueDate) {
      if (!isNaN(moment(values.DueDate).unix())) {
        params.DueDate = moment(values.DueDate).unix();
      }
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

    HomeWorkEdit(homeWorkId as string, params)
      .then((res) => {
        if (res.data.Success) {
          openNotification('Sửa bài tập', 'Sửa bài tập thành công', 'success');
          router.push('/teacher/homework');
        } else {
          openNotification('Sửa bài tập', res.data?.Message, 'error');
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

  const saveManual = (item: any) => {
    saveFile(item.FileUploadUrl, item.FileUploadName);
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'StudentName',
      render: (text: any, record: any) => <Space size="middle">{record?.Student.StudentName}</Space>,
    },
    {
      title: 'Sdt',
      dataIndex: 'StudentPhone',
      render: (text: any, record: any) => <Space size="middle">{record?.Student.StudentPhone}</Space>,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'StudentDob',
      render: (text: any, record: any) => <Space size="middle">{record?.Student.StudentDob}</Space>,
    },
    {
      title: 'Giới tính',
      dataIndex: 'StudentGender',
      render: (text: any, record: any) => <Space size="middle">{record?.Student.StudentGender}</Space>,
    },
    {
      title: 'Lớp',
      dataIndex: 'ClassName',
      render: (text: any, record: any) => <Space size="middle">{record?.Class?.ClassName}</Space>,
    },
    {
      title: 'Điểm đã chấm',
      dataIndex: 'FinalScore',
      render: (text: any, record: any) => <Space size="middle">{record?.Result?.FinalScore}</Space>,
    },
    {
      title: 'Tùy chọn',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <InfoOutlined onClick={() => handleOpenAnswerModal(record?.AnswerId)} />
        </Space>
      ),
    },
  ];

  const handleOpenAnswerModal = (id: any) => {
    setAnswerId(id);
    setShowModal(true);
  };
  const handleChange = (info: any) => {
  };

  return (
    <Layout title="Chi tiết bài tập" backButton backButtonUrl="/teacher/homework">
      {homeWorkId && homeWorkId !== undefined && (
        <Tabs defaultActiveKey="2">
          <Tabs.TabPane tab="Chi tiết bài tập" key="1">
            <div>
              <Form {...formItemLayout} form={form} name="register" onFinish={handleSubmit} scrollToFirstError>
                <Form.Item name="CreatedDate" label="Ngày tạo" preserve={true}>
                  <DatePicker showTime disabled={true} />
                </Form.Item>
                <Form.Item label="Trạng thái" name="HomeWorkStatus">
                  <Select defaultValue={1} style={{ width: 120 }}>
                    {HomeWorkStatusList.map((item: any) => (
                      <Select.Option value={item.value}>{item.label}</Select.Option>
                    ))}
                  </Select>
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
                  <DatePicker showTime disabledDate={(d) => !d || d.isBefore(homeWorkData?.homeWork?.CreatedDate)} />
                </Form.Item>
                {/* <Form.Item label="File bài tập">

              </Form.Item> */}
                {defaultFileList && (
                  <Form.Item label="File bài tập">
                    {/* <Col span={18}>
                    {fileList?.map((item: any) => {
                      return (
                        <Col span={18}>
                          <a key={item.FileUploadId} download={item.FileUploadName} onClick={() => saveManual(item)}>
                            {item.FileUploadName}
                          </a>
                        </Col>
                      );
                    })}
                  </Col> */}
                    <Upload
                      fileList={fileListUpload}
                      onChange={handleChange}
                      beforeUpload={(file) => handleUpload(file)}
                      name="logo"
                      onRemove={handleRemoveFile}
                      defaultFileList={defaultFileList}
                      accept={'.doc,.docx,application/vnd.ms-excel,.pdf,.png,.jpeg,.jpg'}
                    >
                      <Button disabled={uploading || loading} loading={uploading || loading} icon={<UploadOutlined />}>
                        Chọn File
                      </Button>
                    </Upload>
                  </Form.Item>
                )}
                <Form.Item label="Đề bài / Mô tả">
                  {!isSSR && (
                    <React.Suspense fallback={<div>Đang tải soạn thảo</div>}>
                      <Jodit
                        ref={editor}
                        value={describeContent}
                        config={{ readonly: false }}
                        onBlur={(newContent) => setDescribeContent(newContent)}
                      />
                    </React.Suspense>
                  )}
                </Form.Item>
                <Form.Item
                  label="Chỉ học sinh có trong danh sách"
                  name="OnlyAssignStudent"
                  valuePropName={homeWorkData?.homeWork?.OnlyAssignStudent && 'checked'}
                >
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
                      {'Cập nhật'}
                    </Button>
                    <Button htmlType="button" onClick={() => router.push('/teacher/homework/')}>
                      Hủy
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Học sinh nộp bài" key="2">
            <div>
              <Typography.Title level={4}>Bài học sinh nộp</Typography.Title>
              {homeWorkData?.class && (
                <Select defaultValue="0" style={{ width: 120 }} onChange={handleSetSelectChange}>
                  <Select.Option value={'0'}>{'Tất cả'}</Select.Option>
                  {homeWorkData?.class?.map((item: any) => (
                    <Select.Option value={item.ClassId}>{item.ClassName}</Select.Option>
                  ))}
                </Select>
              )}
              <Table rowKey={(r) => r.AnswerId} columns={columns} dataSource={studentSubmitList} pagination={false} />
            </div>
            <Modal
              width={755}
              bodyStyle={{ height: 'max-content' }}
              title={'Chi tiết bài nộp'}
              visible={showModal}
              onCancel={() => setShowModal(false)}
              destroyOnClose
              footer={null}
              className="edit-profile-modal"
            >
              <AnswerModal answerId={answerId} />
            </Modal>
          </Tabs.TabPane>
        </Tabs>
      )}
    </Layout>
  );
};
export default withAuth(index);
