import React, { useState, useEffect } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Row, Col, Button, Card, Modal, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ClassListWithHomeWork } from '@core/services/api';
import ClassHomeWorkModal from 'components/Modal/teacher-admin/ClassHomeWorkModal';
import Router from 'next/router';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { openNotification } from '@utils/Noti';

const HomeWork = () => {
  const [classData, setClassData] = useState([]);
  const [classId, setClassId] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const handleRedirect = (pathname: string) => {
    Router.push(pathname);
  };

  useEffect(() => {
    getClassList();
  }, []);

  const getClassList = async () => {
    setLoading(true);
    ClassListWithHomeWork('', 1, 1, 10)
      .then((resp: any) => {
        const getActiveClass = resp.data?.Data?.Data?.filter((item: any) => item.ClassStatus === 1);
        setClassData(getActiveClass ?? []);
      })
      .catch((error: any) => {
        console.log('error', error);
        openNotification('Danh sách bài tập', 'Đã có lỗi, thử lại sau', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const openDetailModal = (id: string) => {
    setClassId(id);
    setShowModal(true);
  };

  return (
    <Layout title="Bài tập" backButton backButtonUrl="/teacher/dashboard">
      <Typography.Title level={1} style={{
        textAlign: 'center',
      }}>Danh sách bài tập</Typography.Title>
      <div>
        <Row>
          <Col span={18}></Col>
          <Col span={6}>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => handleRedirect('/teacher/homework/create')}
            >
              Thêm mới
            </Button>
          </Col>
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
                        onClick={() => openDetailModal(item.ClassId)}
                        style={{
                          cursor: 'pointer',
                        }}
                      >
                        <Card hoverable title={item.ClassName} style={{ width: 300 }}>
                          {'Đang có'} {item.HomeWorkCount || 0} {'bài tập'}
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
        width={1000}
        bodyStyle={{ height: 'max-content' }}
        title={'Danh sách bài tập'}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        destroyOnClose
        footer={null}
        className="edit-profile-modal"
      >
        <ClassHomeWorkModal classId={classId} />
      </Modal>
    </Layout>
  );
};
export default withAuth(HomeWork);
