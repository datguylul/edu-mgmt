import React, { useState, useRef, useEffect } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Form, Input, Button, Space, DatePicker, Row, Col, Checkbox, Divider, Select } from 'antd';
import moment from 'moment';
import { openNotification } from '@utils/Noti';
import { handleCloudinaryUpload } from 'core/services/cloudinaryUpload';
import { HomeWorkDetail, UserDetailNonId, HomeWorkCheck } from '@core/services/api';
import { useRouter } from 'next/router';
import { saveFile } from '@utils/FileUtil';
import Parser from 'html-react-parser';
import { USER_ROLE } from '@core/constants/role';

const index = () => {
  const router = useRouter();
  const { id: homeWorkId } = router.query;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [homeWorkData, setHomeWorkData] = useState<any>(null);
  const [studentInfo, setStudentInfo] = useState<any>(null);
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
      studentDob: data?.UserDob,
      studentName: data?.Fullname,
      studentPhone: data?.UserPhone,
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
    saveFile(item.FileUploadUrl, item.FileUploadName);
  };

  const handleViewFile = (item: any) => {
    // router.push();
  };

  const HomeWorkDetailContent = () => {
    return (
      <React.Fragment>
        {homeWorkData?.homeWork?.HomeWorkName && <h1>Bài tập: {homeWorkData?.homeWork?.HomeWorkName}</h1>}
        {homeWorkData?.homeWork?.HomeWorkType && <h5>Loại bài tập: {homeWorkData?.homeWork?.HomeWorkType}</h5>}
        {homeWorkData?.class && homeWorkData?.class.length > 0 && (
          <Row>
            <Col span={6}>
              <p>Giao cho lớp: </p>
            </Col>
            <Col span={6}>
              {homeWorkData?.class?.map((item: any) => {
                return <Col span={6}>{item?.ClassName}</Col>;
              })}
            </Col>
            <Col span={6}></Col>
            <Col span={6}></Col>
          </Row>
        )}
        <Divider />
        {homeWorkData?.files && homeWorkData?.files?.length > 0 && (
          <Row>
            <Col span={6}>
              <h5>File bài tập: </h5>
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
        )}
        <Divider />
        {homeWorkData?.homeWork?.HomeWorkDescribe && (
          <Row>
            <Col span={24}>
              <h5>Mô tả: </h5>
            </Col>
            <Col span={24}>
              <div
                style={{
                  backgroundColor: 'light-gray',
                  width: '100%',
                  height: '100%',
                }}
              >
                {Parser(homeWorkData?.homeWork?.HomeWorkDescribe)}
              </div>
            </Col>
          </Row>
        )}
        <Divider />
      </React.Fragment>
    );
  };

  let options: any = [];
  homeWorkData?.class?.map((item: any) => options.push({ label: item?.ClassName, value: item?.ClassId }));

  const StudentInfoContent = () => {
    const onFinish = (values: any) => {
      const params = {
        ...values,
        homeWorkId: homeWorkId,
      };
      setLoading(true);

      HomeWorkCheck(params)
        .then((res) => {
          if (res.data.Success) {
            setStudentInfo(res.data?.Data?.student);
            setStudentCheck(true);
          } else {
            openNotification('Thông báo', res.data.Message);
          }
        })
        .catch((error) => {
          console.log('error', error);
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
            name="studentName"
            rules={[{ required: true, message: 'Họ tên học sinh không thể trống!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày sinh (ngày/tháng/năm - dd/mm/yyyy)"
            name="studentDob"
            rules={[{ required: true, message: 'Ngày sinh không thể trống' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại (học sinh/phụ huynh)"
            name="studentPhone"
            rules={[{ required: true, message: 'Số điện thoại không thể trống' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Học sinh lớp" name="classId" rules={[{ required: true, message: 'Chọn lớp' }]}>
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
    <Layout title="Chi tiết bài tập" backButton backButtonUrl="/teacher/homework">
      {studentCheck ? HomeWorkDetailContent() : StudentInfoContent()}
      {/* {HomeWorkDetailContent()} */}
    </Layout>
  );
};
export default index;
