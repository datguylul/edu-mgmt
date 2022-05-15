import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Button, Space, Select, Typography, InputNumber, Row, Col, Divider } from 'antd';
import { AnswerDetail, ResultSubmit, ResultEdit } from '@core/services/api';
import moment from 'moment';
import { openNotification } from '@utils/Noti';
import { CLASS_STATUS } from '@core/constants';
import Parser from 'html-react-parser';
import 'moment/locale/vi';
moment.locale('vi');
const Jodit = React.lazy(() => {
  return import('jodit-react');
});
import { saveFile } from '@utils/FileUtil';

const { Option } = Select;

interface IModalInfo {
  answerId?: string;
  onCloseModal?: () => void;
  onSubmitAndReload?: () => void;
}

const AnswerModal: React.FC<IModalInfo> = ({
  answerId = null,
  onCloseModal = () => { },
  onSubmitAndReload = () => { },
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [answerData, setAnswerData] = useState<any | null>(null);
  const editor = useRef(null);
  const [describeContent, setDescribeContent] = useState('');
  const isSSR = typeof window === 'undefined';
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [scoreNumber, setScoreNumber] = useState<string | number>(0);
  const [resultId, setResultId] = useState<string>('');

  const LoadDetail = () => {
    setLoading(true);
    AnswerDetail(answerId!)
      .then((resp) => {
        const data = resp.data?.Data;
        if (data) {
          setAnswerData(data);
        }
        if (data?.result) {
          setResultId(data?.result?.ResultId);
          setDescribeContent(data?.result?.ResultContent);
          setScoreNumber(data?.result?.FinalScore);
          form.setFieldsValue({
            FinalScore: data?.result?.FinalScore,
          });
          setSubmitted(true);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    // setLoading(true);
    const params: any = {
      FinalScore: scoreNumber,
      ResultContent: describeContent,
      AnswerId: answerId,
    };

    if (submitted) {
      ResultEdit(resultId, params)
        .then((res) => {
          if (res.data.Success) {
            openNotification('Sửa điểm', 'Sửa điểm thành công', 'success');
          } else {
            openNotification('Sửa điểm', res.data?.Message, 'error');
          }
        })
        .catch((error) => {
          console.error(error);
          openNotification('Sửa điểm', 'Đã có lỗi', 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      ResultSubmit(params)
        .then((res) => {
          if (res.data.Success) {
            openNotification('Chấm điểm', 'Chấm điểm thành công', 'success');
            setSubmitted(true);
            setResultId(res.data?.result?.ResultId);
          } else {
            openNotification('Chấm điểm', res.data?.Message, 'error');
          }
        })
        .catch((error) => {
          console.error(error);
          openNotification('Chấm điểm', 'Đã có lỗi', 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const saveManual = (item: any) => {
    saveFile(item.FileUploadUrl, item.FileUploadName);
  };

  useEffect(() => {
    if (answerId && answerId !== '') {
      LoadDetail();
    }
  }, [answerId]);

  return (
    <div>
      <Typography.Title level={3}>{'Thông tin bài làm học sinh'}</Typography.Title>
      <Typography>
        <pre>Họ tên: {answerData?.answer?.answer?.Student?.StudentName}</pre>
      </Typography>
      <Typography>
        <pre>Sđt: {answerData?.answer?.Student?.StudentPhone}</pre>
      </Typography>
      <Typography>
        <pre>Ngày sinh: {answerData?.answer?.Student?.StudentDob}</pre>
      </Typography>
      <Typography>
        <pre>Giới tính: {answerData?.answer?.Student?.StudentGender}</pre>
      </Typography>
      <Typography>
        <pre>Giờ nộp: {moment(answerData?.answer?.Student?.SubmitTime).format('llll')}</pre>
      </Typography>
      {answerData?.files && answerData?.files?.length > 0 && (
        <React.Fragment>
          <Divider />
          <Row>
            <Col span={6}>
              <Typography.Title level={4}>File nộp: </Typography.Title>
            </Col>
            <Col span={18}>
              {answerData?.files?.map((item: any) => {
                return (
                  <>
                    <Row>
                      <Col span={12}>
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

      {answerData?.answer?.AnswerContent && (
        <div style={{
          marginTop: 40,
        }}>
          <Row>
            <Col span={24}>
              <Typography.Title level={4}>Lời giải / Mô tả: </Typography.Title>
            </Col>
            <Col span={24}>
              <div
                style={{
                  backgroundColor: 'light-gray',
                  width: '100%',
                  height: '100%',
                }}
              >
                {Parser(answerData?.answer?.AnswerContent)}
              </div>
            </Col>
          </Row>
          <Divider />
        </div>
      )}
      <br />
      <Typography.Title level={3}>{'Giáo viên chấm điểm'}</Typography.Title>
      <Form form={form} name="register" onFinish={handleSubmit} scrollToFirstError>
        <Form.Item label="Điểm" name="FinalScore" rules={[{ required: true, message: 'Nhập điểm' }]}>
          <InputNumber min={0} max={10} value={scoreNumber} onChange={setScoreNumber} />
        </Form.Item>
        <Form.Item label="Lời phê">
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

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              {submitted ? 'Sửa điểm' : 'Chám điểm'}
            </Button>
            <Button htmlType="button" onClick={onCloseModal}>
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AnswerModal;
