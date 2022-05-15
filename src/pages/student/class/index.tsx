import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Modal, Card, Pagination, DatePicker, Input, Button, Select, Space, Row, Col } from 'antd';
import { ClassList } from '@core/services/api';
import { InfoOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import router from 'next/router';
import { CLASS_STATUS } from '@core/constants';
const { Option } = Select;

const ClassStatusList = [CLASS_STATUS.active, CLASS_STATUS.finish];

function index() {
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [selectThang, setSelectThang] = useState<boolean>(true);
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [classStatus, setClassStatus] = useState<number>(CLASS_STATUS.active.value);
  const [classData, setClassData] = useState([]);

  useEffect(() => {
    getClassList();
  }, [classStatus]);

  const getClassList = async () => {
    ClassList(search, classStatus, currentPage, pageSize)
      .then((resp: any) => {
        setClassData(resp.data?.Data?.Data ?? []);
        setTotalRecord(resp.data?.TotalRecord);
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  };

  const columns = [
    {
      title: 'Tên lớp',
      dataIndex: 'ClassName',
    },
    {
      title: 'Năm học',
      dataIndex: 'ClassYear',
    },
    {
      title: 'Tên giáo viên',
      dataIndex: 'Teacher',
      render: (text: any, record: any) => <Space size="middle">{record?.Teacher?.TeacherName}</Space>,
    },
    {
      title: 'SDT giáo viên',
      dataIndex: 'Teacher',
      render: (text: any, record: any) => <Space size="middle">{record?.Teacher?.TeacherPhone}</Space>,
    },
  ];

  const onPagingChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectChange = (value: any) => {
    setClassStatus(value);
  };

  const handleSearchChange = ({ target }: any) => {
    setSearch(target.value);
  };

  const handleCheckboxChange = () => {
    setSelectThang((prev) => !prev);
  };

  return (
    <Layout title={'Danh sách lớp'} backButton backButtonUrl="/student/dashboard">
      <div>
        <Row>
          <Col span={18}>
            <Input placeholder={'Tìm kiếm'} onChange={handleSearchChange} width="50%" />
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={getClassList}>
              Tìm kiếm
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Select defaultValue={1} style={{ width: 120 }} onChange={handleSelectChange}>
              {ClassStatusList.map((item: any) => (
                <Option value={item.value}>{item.label}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>
      <div>
        <Table columns={columns} dataSource={classData} pagination={false} />
        <Pagination
          defaultPageSize={pageSize}
          defaultCurrent={currentPage}
          onChange={onPagingChange}
          current={currentPage}
          total={totalRecord}
        />
      </div>
    </Layout>
  );
}

export default withAuth(index);
