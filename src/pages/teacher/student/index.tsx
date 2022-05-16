import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Modal, Card, Pagination, Typography, Input, Button, Select, Space, Row, Col } from 'antd';
import { StudentList } from '@core/services/api';
import ClassModal from 'components/Modal/teacher-admin/ClassModal';
import { InfoOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import router from 'next/router';
import { CLASS_STATUS } from '@core/constants';
import ClassAddStudentModal from 'components/Modal/teacher-admin/ClassAddStudentModal';
import StudentDetailModal from 'components/Modal/teacher-admin/StudentDetailModal';
const { Option } = Select;

function index() {
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('id_asc');
  const [classStatus, setClassStatus] = useState<number>(CLASS_STATUS.active.value);
  const [studentData, setStudentData] = useState([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [isAddModal, setIsAddModal] = React.useState<boolean>(false);

  useEffect(() => {
    if (!showModal) {
      getClassList();
    }
  }, [classStatus, showModal, currentPage, sort]);

  const getClassList = () => {
    StudentList(search, sort, currentPage, pageSize)
      .then((resp: any) => {
        setStudentData([]);
        setStudentData(resp.data?.Data?.Data || []);
        setTotalRecord(resp.data?.Data?.TotalRecord || 0);
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  };

  const columns = [
    {
      title: 'Tên học sinh',
      dataIndex: 'StudentName',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'StudentPhone',
    },
    {
      title: 'Giới tính',
      dataIndex: 'StudentGender',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'StudentDob',
    },
    {
      title: 'Tùy chọn',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <InfoOutlined onClick={() => openStudentDetailModal(record.StudentId)} />
          <DeleteOutlined onClick={() => openStudentDetailModal(record.StudentId)} />
        </Space>
      ),
    },
  ];

  const openStudentDetailModal = (studentId = '') => {
    setStudentId(studentId);
    setIsAddModal(false);
    setShowModal(true);
  };

  const handleOpenAddStudentModal = () => {
    setIsAddModal(true);
    setShowModal(true);
    setStudentId(null);
  };

  const onPagingChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = ({ target }: any) => {
    setSearch(target.value);
  };

  const onCloseModal = () => {
    setShowModal(false);
  }

  return (
    <Layout title={'Danh sách học sinh'} backButton backButtonUrl="/teacher/dashboard">
      <Typography.Title level={1} style={{
        textAlign: 'center',
      }}>Danh sách học sinh</Typography.Title>
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
        <br />
        <Row>
          <Col span={12}>
            <Button type="primary" onClick={handleOpenAddStudentModal}>
              Thêm mới
            </Button>
          </Col>
        </Row>
      </div>
      <br />
      <div>
        <Table columns={columns} dataSource={studentData} pagination={false} />
        <Pagination
          defaultPageSize={pageSize}
          defaultCurrent={currentPage}
          onChange={onPagingChange}
          current={currentPage}
          total={totalRecord}
        />
      </div>
      <Modal
        width={755}
        bodyStyle={{ height: 'max-content' }}
        title={'Thêm học sinh'}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        destroyOnClose
        footer={null}
        className="edit-profile-modal"
      >
        {isAddModal ? (
          <ClassAddStudentModal classId={null} onCloseModal={onCloseModal} />
        ) : (
          <StudentDetailModal classId={null} studentId={studentId} onCloseModal={onCloseModal} />
        )}

      </Modal>
    </Layout>
  );
}

export default withAuth(index);
