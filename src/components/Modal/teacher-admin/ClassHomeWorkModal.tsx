import React, { useEffect, useState } from 'react';
import { Table, Modal, Card, Pagination, DatePicker, Input, Button, Select, Space, Row, Col } from 'antd';
import { HomeWorkListByClass, HomeWorkEditStatus } from '@core/services/api';
import moment from 'moment';
import { openNotification } from '@utils/Noti';
import { FormOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import Router from 'next/router';
import absoluteUrl from 'next-absolute-url';

const { Option } = Select;
import { HOME_WORK_STATUS } from '@core/constants';

const HomeWorkStatusList = [HOME_WORK_STATUS.active, HOME_WORK_STATUS.finish];

interface IModalInfo {
  classId?: string;
  onCloseModal?: () => void;
  onSubmitAndReload?: () => void;
}

const ClassHomeWorkModal: React.FC<IModalInfo> = ({
  classId = null,
  onCloseModal = () => {},
  onSubmitAndReload = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [homeWorkData, setHomeWorkData] = useState([]);
  const [HomeWorkStatus, setHomeWorkStatus] = useState(HOME_WORK_STATUS.active.value);

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'HomeWorkName',
    },
    {
      title: 'Loại bài tập',
      dataIndex: 'HomeWorkType',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'CreatedDate',
    },
    {
      title: 'Hạn nộp',
      dataIndex: 'DueDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'HomeWorkStatus',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Select
            defaultValue={HomeWorkStatusList.find((x) => x.value === record.HomeWorkStatus)?.value}
            style={{ width: 120 }}
            onChange={(value) => handleSelectHomeWorkStatusChange(value, record.HomeWorkId)}
          >
            {HomeWorkStatusList.map((item: any) => (
              <Option value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Space>
      ),
    },
    {
      title: 'Tùy chọn',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <FormOutlined onClick={() => handleRedirect(`/teacher/homework/detail/${record.HomeWorkId}`)} />
          <DeleteOutlined onClick={() => {}} />
          <CopyOutlined onClick={() => handleCopyLink(record.HomeWorkId)} />
        </Space>
      ),
    },
  ];

  const handleSelectHomeWorkStatusChange = (value: any, homeWorkId: string) => {
    const params = {
      HomeWorkId: homeWorkId,
      HomeWorkStatus: value,
    };

    HomeWorkEditStatus(params)
      .then((res) => {
        LoadDetail();
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const handleCopyLink = (id: string) => {
    const { origin } = absoluteUrl();
    const url = `${origin}/homework/${id}`;
    openNotification('Copy link', 'Copy Link bài tập thành công', 'success');
    if ('clipboard' in navigator) {
      return navigator.clipboard.writeText(url);
    } else {
      return document.execCommand('copy', true, url);
    }
  };

  const handleRedirect = (pathname: string) => {
    Router.push(pathname);
  };

  const LoadDetail = () => {
    setLoading(true);
    HomeWorkListByClass(classId!, HomeWorkStatus, currentPage, pageSize)
      .then((resp) => {
        setHomeWorkData([]);
        setHomeWorkData(resp.data?.Data?.Data || []);
        setTotalRecord(resp.data?.TotalRecord);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (classId && classId !== '') {
      LoadDetail();
    }
  }, [classId, HomeWorkStatus]);

  return (
    <>
      <div>
        <Row>
          <Col span={12}>
            <Button type="primary" onClick={() => handleRedirect('/teacher/homework/create')}>
              Thêm mới
            </Button>
          </Col>

          <Col span={12}>
            <Select defaultValue={1} style={{ width: 120 }} onChange={setHomeWorkStatus}>
              {HomeWorkStatusList.map((item: any) => (
                <Select.Option value={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>
      <div>
        <Table columns={columns} dataSource={homeWorkData} pagination={false} />
        <Pagination
          defaultPageSize={pageSize}
          defaultCurrent={currentPage}
          onChange={(page) => setCurrentPage(page)}
          current={currentPage}
          total={totalRecord}
        />
      </div>
    </>
  );
};

export default ClassHomeWorkModal;
