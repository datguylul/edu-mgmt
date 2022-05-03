import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Button, Space, Select, Typography, InputNumber } from 'antd';
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

const { Option } = Select;

interface IModalInfo {
  answerId?: string;
  onCloseModal?: () => void;
  onSubmitAndReload?: () => void;
}

const AnswerModal: React.FC<IModalInfo> = ({
  answerId = null,
  onCloseModal = () => {},
  onSubmitAndReload = () => {},
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
        if (data?.answer) {
          setAnswerData(data?.answer);
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

  useEffect(() => {
    if (answerId && answerId !== '') {
      LoadDetail();
    }
  }, [answerId]);

  return (
    <div>
      <Typography.Title level={3}>{'Thông tin bài làm học sinh'}</Typography.Title>
      <Typography>
        <pre>Họ tên: {answerData?.Student?.StudentName}</pre>
      </Typography>
      <Typography>
        <pre>Sđt: {answerData?.Student?.StudentPhone}</pre>
      </Typography>
      <Typography>
        <pre>Ngày sinh: {answerData?.Student?.StudentDob}</pre>
      </Typography>
      <Typography>
        <pre>Giới tính: {answerData?.Student?.StudentGender}</pre>
      </Typography>
      <Typography>
        <pre>Giờ nộp: {moment(answerData?.Student?.SubmitTime).format('llll')}</pre>
      </Typography>
      {answerData?.answer?.AnswerContent && <div>{Parser(answerData?.answer?.AnswerContent || '')}</div>}
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
                onChange={(newContent) => {}}
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
