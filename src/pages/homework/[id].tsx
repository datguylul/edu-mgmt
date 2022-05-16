import React, { useState, useRef, useEffect } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Form, Input, Button, Space, Typography, Row, Col, Checkbox, Divider, Select, Upload } from 'antd';
import moment from 'moment';
import { openNotification } from '@utils/Noti';
import { handleCloudinaryUpload } from 'core/services/cloudinaryUpload';
import { HomeWorkDetail, UserDetailNonId, HomeWorkCheck, AnswerSubmit } from '@core/services/api';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { saveFile } from '@utils/FileUtil';
import Parser from 'html-react-parser';
import { USER_ROLE } from '@core/constants/role';
import 'moment/locale/vi';
moment.locale('vi');
const Jodit = React.lazy(() => {
  return import('jodit-react');
});

const index = () => {
  const router = useRouter();
  const { id: homeWorkId } = router.query;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [homeWorkData, setHomeWorkData] = useState<any>(null);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [answerData, setAnswerData] = useState<any>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [classId, setClassId] = useState<string | null>(null);
  const [studentCheck, setStudentCheck] = useState<boolean>(false);

  useEffect(() => {
    const role = localStorage.getItem('roles');
    if (role === USER_ROLE.student) {
      getUserDetail();
    }
    getHomeWorkDetail();
  }, []);

  const getHomeWorkDetail = async () => {
    if (homeWorkId && homeWorkId !== undefined) {
      setLoading(true);
      HomeWorkDetail(homeWorkId! as string)
        .then((res: any) => {
          const data = res.data?.Data;
          if (data) {
            setHomeWorkData(data);
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

  const getUserDetail = () => {
    UserDetailNonId()
      .then((res) => {
        fillForm(res?.data?.Data?.account);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const fillForm = (data: any) => {
    form.setFieldsValue({
      StudentDob: data?.UserDob,
      StudentName: data?.Fullname,
      StudentPhone: data?.UserPhone,
    });
  };

  let options: any = [];
  homeWorkData?.class?.map((item: any) => options.push({ label: item?.ClassName, value: item?.ClassId }));

  const StudentInfoContent = () => {
    const onFinish = (values: any) => {
      const params = {
        ...values,
        HomeWorkId: homeWorkId,
      };

      setLoading(true);

      HomeWorkCheck(params)
        .then((res) => {
          const data = res.data?.Data;
          if (res.data.Success) {
            setStudentInfo(data?.student || values);
            setClassId(data?.class?.ClassId || null);
            setAnswerData(data?.answer ? {
              answer: data?.answer,
              files: data?.files || [],
            } : null);
            setResultData(data?.result || null);
            setStudentCheck(true);
          } else {
            openNotification('Thông báo', res.data.Message, 'error');
          }
        })
        .catch((error) => {
          console.log('error', error, 'error');
          openNotification('Đã có lỗi', 'Thử lại sau', 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };

    return (
      <>
        <h1>Nhập thông tin học sinh:</h1>
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên học sinh"
            name="StudentName"
            rules={[{ required: true, message: 'Họ tên học sinh không thể trống!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày sinh (ngày/tháng/năm - dd/mm/yyyy)"
            name="StudentDob"
            rules={[{ required: true, message: 'Ngày sinh không thể trống' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại (học sinh/phụ huynh)"
            name="StudentPhone"
            rules={[{ required: true, message: 'Số điện thoại không thể trống' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Học sinh lớp" name="ClassId" rules={[{ required: true, message: 'Chọn lớp' }]}>
            <Select options={options} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  };

  return (
    <Layout title="Chi tiết bài tập" backButton backButtonUrl="/">
      {studentCheck ? (
        <HomeWorkDetailContent
          homeWorkData={homeWorkData}
          studentInfo={studentInfo}
          classId={classId}
          answer={answerData}
          result={resultData}
        />
      ) : (
        StudentInfoContent()
      )}
      {/* <HomeWorkDetailContent homeWorkData={homeWorkData} studentInfo={studentInfo} /> */}
    </Layout>
  );
};
export default index;

const HomeWorkDetailContent = ({ homeWorkData = null, studentInfo = null, classId = null, answer = null, result = null }: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [submitDone, setSubmitDone] = useState<boolean>(false);
  const [describeContent, setDescribeContent] = useState('');
  const isSSR = typeof window === 'undefined';
  const editor = useRef(null);
  const [defaultFileList, setDefaultFileList] = useState<any>([]);

  useEffect(() => {
    if (answer != null) {
      fillForm(answer);
    }

  }, [answer, result])

  const fillForm = (data: any) => {
    setFileList(data.files);
    const defaultFilesList = data?.files?.map((item: any) => ({
      uid: item.FileUploadId,
      name: item.FileUploadName,
      status: 'done',
      url: item.FileUploadUrl,
    }));

    setDefaultFileList(defaultFilesList || []);
    setDescribeContent(data?.answer?.AnswerContent);
  };

  const handleUpload = (file: any) => {
    setUploading(true);
    handleCloudinaryUpload(file)
      .then((res: any) => {
        file.FileUploadUrl = res.secure_url;
        file.FileUploadName = file.name;
        const files = [...fileList, file];
        setFileList(files as any);
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

  const handleViewFile = () => {
    // router.push();
  };

  const handleSubmit = () => {
    if (!classId || classId === '') {
      openNotification('Nộp bài tập', 'Đã có lỗi vui lòng thử lại sau', 'error');
    }
    // setLoading(true);
    const params: any = {
      AnswerContent: describeContent,
      ClassId: classId,
      HomeWorkId: homeWorkData?.homeWork?.HomeWorkId,
    };
    if (studentInfo && studentInfo?.StudentId) {
      params.StudentId = studentInfo.StudentId;
    } else {
      params.StudentName = studentInfo?.StudentName;
      params.StudentDob = studentInfo?.StudentDob;
      params.StudentPhone = studentInfo?.StudentPhone;
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

    AnswerSubmit(params)
      .then((res) => {
        if (res.data?.Success) {
          setSubmitDone(true);
          openNotification('Nộp bài tập', 'Nộp bài thành công', 'success');
        } else {
          openNotification('Nộp bài tập', res.data?.Message, 'error');
        }
      })
      .catch((error) => {
        console.log('error', error);
        openNotification('Nộp bài tập', 'Đã có lỗi vui lòng thử lại sau', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <React.Fragment>
      {homeWorkData?.homeWork?.HomeWorkName && (
        <Typography.Title
          style={{
            textAlign: 'center',
          }}
        >
          Bài tập: {homeWorkData?.homeWork?.HomeWorkName}
        </Typography.Title>
      )}
      {homeWorkData?.homeWork?.HomeWorkType && (
        <Typography.Title level={2}>Loại bài tập: {homeWorkData?.homeWork?.HomeWorkType}</Typography.Title>
      )}
      {homeWorkData?.homeWork?.DueDate && (
        <Typography.Title level={2}>Hạn nộp: {moment(homeWorkData?.homeWork?.DueDate).format('lll')}</Typography.Title>
      )}
      {moment(homeWorkData?.homeWork?.DueDate) > moment(Date.now()) &&
        <Typography.Title level={2}>Quá hạn nộp</Typography.Title>
      }
      <Divider />

      {result &&
        <div style={{
          borderWidth: 1,
          borderStyle: 'ridge',
          borderColor: '#404040',
          marginTop: 10,
          marginBottom: 10,
        }}>
          <Row >
            <Col span={8} >
              <div style={{
                padding: 10,
              }}>
                <Typography.Title level={4}>Điểm:</Typography.Title>
                <Typography.Title level={2} type="danger"
                  style={{
                    textAlign: 'center',
                  }}>
                  {result?.FinalScore}
                </Typography.Title>
              </div>
            </Col>
            <div style={{
              borderWidth: 1,
              borderStyle: 'ridge',
              borderColor: '#404040',
            }} />
            <Col>
              <div style={{
                padding: 10,
              }}>
                <Typography.Title level={4}>Lời phê:</Typography.Title>
                <Typography.Title level={2}
                  style={{
                    textAlign: 'center',
                  }}>{Parser(result?.ResultContent)}</Typography.Title>
              </div>
            </Col >
          </Row>
        </div>
      }

      {homeWorkData?.files && homeWorkData?.files?.length > 0 && (
        <React.Fragment>
          <Row>
            <Col span={6}>
              <Typography.Title level={2}>File bài tập: </Typography.Title>
            </Col>
            <Col span={18}>
              {homeWorkData?.files?.map((item: any) => {
                return (
                  <>
                    <Row>
                      <Col span={12}>
                        {/* <a key={item.FileUploadId} download={item.FileUploadName} onClick={() => saveManual(item)}>
                    {item.FileUploadName}
                  </a> */}
                        <a key={item.FileUploadId}>{item.FileUploadName}</a>
                      </Col>
                      <Col span={12}>
                        <a target="_blank" href={`/file/${item.FileUploadId}`} rel="noopener noreferrer">
                          <Button type="primary">Xem</Button>
                        </a>
                        <Button onClick={() => saveManual(item)}>Tải xuống</Button>
                      </Col>
                    </Row>
                    <br></br>
                  </>
                );
              })}
            </Col>
          </Row>
          <Divider />
        </React.Fragment>
      )}

      {homeWorkData?.homeWork?.HomeWorkContent && (
        <div style={{
          marginTop: 40,
        }}>
          <Row>
            <Col span={24}>
              <Typography.Title level={2} style={{
                textAlign: 'center',
              }}>Đề bài: </Typography.Title>
            </Col>
            <Col span={24}>
              <div
                style={{
                  backgroundColor: 'light-gray',
                  width: '100%',
                  height: '100%',
                }}
              >
                {Parser(homeWorkData?.homeWork?.HomeWorkContent)}
              </div>
            </Col>
          </Row>
          <Divider />
        </div>
      )}

      {result ? (
        <div></div>
      )
        :
        (
          <React.Fragment>
            <Typography.Title level={2}>Bài nộp: </Typography.Title>
            <Form form={form} name="register" onFinish={handleSubmit} scrollToFirstError>
              {defaultFileList &&
                <Form.Item label="File đáp án">
                  <Upload
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
              }
              <Form.Item label="Lời giải">
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

              {!submitDone && (
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                      {'Nộp bài'}
                    </Button>
                    <Button htmlType="button">Hủy</Button>
                  </Space>
                </Form.Item>
              )}
            </Form>
          </React.Fragment>
        )}
    </React.Fragment>
  );
};
