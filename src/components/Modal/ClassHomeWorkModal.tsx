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

const ClassModal: React.FC<IModalInfo> = ({
  classId = null,
  onCloseModal = () => {},
  onSubmitAndReload = () => {},
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
          <FormOutlined onClick={() => handleRedirect(`/teacher/homework/detail/${record.HomeWorkId}`)} />
          <DeleteOutlined onClick={() => {}} />
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
    HomeWorkListByClass(classId!, currentPage, pageSize)
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
    if (classId && classId !== '') {
      LoadDetail();
    }
  }, [classId]);

  return (
    <>
      <div>
        <Row>
          {/* <Col span={18}>
            <Input placeholder={'Tìm kiếm'} onChange={handleSearchChange} width="50%" />
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={LoadDetail}>
              Tìm kiếm
            </Button>
          </Col> */}
        </Row>
        <Row>
          <Col span={12}>
            <Button type="primary" onClick={() => handleRedirect('/teacher/homework/create')}>
              Thêm mới
            </Button>
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

export default ClassModal;
