import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Modal, Card, Pagination, DatePicker, Input, Button, Select, Space, Row, Col } from 'antd';
import { ClassList, ClassEditStatus } from '@core/services/api';
import ClassModal from 'components/Modal/teacher-admin/ClassModal';
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
  const [sort, setSort] = useState<string>('id_asc');
  const [classStatus, setClassStatus] = useState<number>(CLASS_STATUS.active.value);
  const [classData, setClassData] = useState([]);
  const [classId, setClassId] = useState<string>('');
  const [showModal, setShowModal] = React.useState<boolean>(false);

  useEffect(() => {
    if (!showModal) {
      getClassList();
    }
  }, [classStatus, showModal]);

  const getClassList = async () => {
    ClassList(search, classStatus, currentPage, pageSize)
      .then((resp: any) => {
        setClassData([]);
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
      title: 'Năm học',
      dataIndex: 'ClassYear',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'ClassStatus',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Select
            defaultValue={ClassStatusList.find((x) => x.value === record.ClassStatus)?.value}
            style={{ width: 120 }}
            onChange={(value) => handleSelectClassStatusChange(value, record.ClassId)}
          >
            {ClassStatusList.map((item: any) => (
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
          <InfoOutlined onClick={() => openDetailModal(record.ClassId)} />
          <DeleteOutlined onClick={() => openDetailModal(record.ClassId)} />
          <FormOutlined onClick={() => router.push(`/teacher/class/${record.ClassId}`)} />
        </Space>
      ),
    },
  ];

  const openDetailModal = (id: string) => {
    setClassId(id);
    setShowModal(true);
  };

  const onPagingChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectChange = (value: any) => {
    setClassStatus(value);
  };

  const handleSearchChange = ({ target }: any) => {
    setSearch(target.value);
  };

  const handleSelectClassStatusChange = (value: any, classId: string) => {
    const params = {
      ClassId: classId,
      ClassStatus: value,
    };
    ClassEditStatus(params)
      .then((res) => {
        getClassList();
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const handleAddNew = () => {
    setClassId('');
    setShowModal(true);
  };

  return (
    <Layout title={'Danh sách lớp'} backButton backButtonUrl="/teacher/dashboard">
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
            <Button type="primary" onClick={handleAddNew}>
              Thêm mới
            </Button>
          </Col>
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
        <Modal
          width={755}
          bodyStyle={{ height: 'max-content' }}
          title={'Chi tiết lớp'}
          visible={showModal}
          onCancel={() => setShowModal(false)}
          destroyOnClose
          footer={null}
          className="edit-profile-modal"
        >
          <ClassModal classId={classId} />
        </Modal>
      </div>
    </Layout>
  );
}

export default withAuth(index);
