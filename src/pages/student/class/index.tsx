import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Modal, Card, Typography, Divider, Input, Button, Select, Space, Row, Col } from 'antd';
import { ClassList } from '@core/services/api';
import { InfoOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import router from 'next/router';
import { CLASS_STATUS } from '@core/constants';
const { Option } = Select;
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import ClassModal from 'components/Modal/teacher-admin/ClassModal';

const ClassStatusList = [CLASS_STATUS.active, CLASS_STATUS.finish];

function index() {
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [selectThang, setSelectThang] = useState<boolean>(true);
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [classStatus, setClassStatus] = useState<number>(CLASS_STATUS.active.value);
  const [classData, setClassData] = useState([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [classId, setClassId] = useState<string>('');
  const [showModal, setShowModal] = React.useState<boolean>(false);

  useEffect(() => {
    getClassList();
  }, [classStatus]);

  const getClassList = async () => {
    setLoading(true);
    ClassList(search, classStatus, currentPage, pageSize)
      .then((resp: any) => {
        setClassData(resp.data?.Data?.Data ?? []);
        setTotalRecord(resp.data?.TotalRecord);
      })
      .catch((error: any) => {
        console.log('error', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSelectChange = (value: any) => {
    setClassStatus(value);
  };

  const handleOpenModal = (classId: string) => {
    setClassId(classId);
    setShowModal(true);
  }
  const handleCloseModal = () => {
    setShowModal(false);
  }

  return (
    <Layout title={'Danh sách lớp'} backButton backButtonUrl="/student/dashboard">
      <Typography.Title level={1} style={{
        textAlign: 'center',
      }}>Danh sách lớp</Typography.Title>
      <div>
        <Row>
          <Col span={2}><Typography.Title level={4}>Lọc:</Typography.Title></Col>
          <Col span={22}><Select defaultValue={1} style={{ width: 120 }} onChange={handleSelectChange}>
            {ClassStatusList.map((item: any) => (
              <Option value={item.value}>{item.label}</Option>
            ))}
          </Select></Col>
        </Row>
      </div>
      <br />
      <div>
        <Row>
          <Col span={24}>
            {loading ? (
              <Row gutter={[48, 24]}>
                {[1, 2, 3, 4, 5, 6].map((item, index) => {
                  return (
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }} key={index}>
                      <SkeletonTheme baseColor="#c6c6cf" highlightColor="#fff">
                        <Skeleton height={150} width={300} />
                      </SkeletonTheme>
                    </Col>
                  );
                })}
              </Row>
            ) : (
              <Row gutter={[48, 24]}>
                {classData.map((item: any) => {
                  return (
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }} key={item.ClassId}>
                      <div
                        onClick={() => { }}
                        style={{
                          cursor: 'pointer',
                        }}
                      >
                        <Card
                          onClick={() => handleOpenModal(item.ClassId)}
                          hoverable
                          title={`${item.ClassName} (${item?.ClassYear})`} style={{ width: 300 }}>
                          <Typography.Title level={5}>Giáo viên:</Typography.Title> <p> {item?.Teacher?.TeacherName}</p>
                          <Divider />
                          <Typography.Title level={5}>Số điện thoại: </Typography.Title> <p>{item?.Teacher?.TeacherPhone}</p>
                        </Card>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            )}
          </Col>
          <Col span={6}></Col>
        </Row>
      </div>

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
        <ClassModal classId={classId} studentSide={true} onCloseModal={handleCloseModal}/>
      </Modal>
    </Layout>
  );
}

export default withAuth(index);
