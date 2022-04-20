import React, { useState, useRef, useEffect } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Form, Input, Button, Space, DatePicker, Row, Col, Checkbox, Divider } from 'antd';
import moment from 'moment';
import { openNotification } from '@utils/Noti';
import { handleCloudinaryUpload } from 'core/services/cloudinaryUpload';
import { HomeWorkDetail } from '@core/services/api';
import { useRouter } from 'next/router';
import { saveFile } from '@utils/FileUtil';
import Parser from 'html-react-parser';

const index = () => {
  const router = useRouter();
  const { id: homeWorkId } = router.query;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [homeWorkData, setHomeWorkData] = useState<any>(null);

  useEffect(() => {
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

  return (
    <Layout title="Chi tiết bài tập" backButton backButtonUrl="/teacher/homework">
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
                <Col span={18}>
                  <a key={item.FileUploadId} download={item.FileUploadName} onClick={() => saveManual(item)}>
                    {item.FileUploadName}
                  </a>
                </Col>
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
    </Layout>
  );
};
export default withAuth(index);
