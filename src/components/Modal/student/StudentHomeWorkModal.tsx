import React, { useEffect, useState } from 'react';
import { Table, Modal, Card, Pagination, DatePicker, Input, Button, Select, Space, Row, Col } from 'antd';
import { HomeWorkListByClass } from '@core/services/api';
import moment from 'moment';
import { openNotification } from '@utils/Noti';
import { FormOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import Router from 'next/router';
import absoluteUrl from 'next-absolute-url';

const { Option } = Select;

interface IModalInfo {
  classId?: string;
  onCloseModal?: () => void;
  onSubmitAndReload?: () => void;
}

const StudentHomeWorkModal: React.FC<IModalInfo> = ({
  classId = null,
  onCloseModal = () => { },
  onSubmitAndReload = () => { },
}) => {
  const [loading, setLoading] = useState(false);
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [homeWorkData, setHomeWorkData] = useState([]);

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'HomeWorkName',
      render: (text: any, record: any) => (
        <Space size="middle">
          <a target="_blank" rel="noopener noreferrer" href={`/homework/${record.HomeWorkId}`} >
            {text}
          </a>
        </Space>
      ),
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
      title: 'Tùy chọn',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <FormOutlined onClick={() => handleRedirect(`/homework/${record.HomeWorkId}`)} />
          <CopyOutlined onClick={() => handleCopyLink(record.HomeWorkId)} />
        </Space>
      ),
    },
  ];

  const handleCopyLink = (id: string) => {
    const { origin } = absoluteUrl();
    const url = `${origin}/homework/${id}`;
    openNotification('Copy Link bài tập thành công');
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
    HomeWorkListByClass(classId!, 1, currentPage, pageSize)
      .then((resp) => {
        setHomeWorkData(resp.data?.Data?.Data);
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
    if () {
      UserDetailNonId()
      .then((res) => {
        fillForm(res?.data?.Data);
      })
      .catch((error) => {
        console.log('error', error);
      });
    }
    if (classId && classId !== '') {
      LoadDetail();
    }
  }, [classId]);

  return (
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
  );
};

export default StudentHomeWorkModal;
