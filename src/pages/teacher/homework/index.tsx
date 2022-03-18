import React, { useState, useEffect } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Row, Col, Button, Card, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ClassList } from '@core/services/api';
import ClassHomeWorkModal from 'components/Modal/ClassHomeWorkModal';
import Router from 'next/router';

const HomeWork = () => {
  const [classData, setClassData] = useState([]);
  const [classId, setClassId] = useState<string>('');
  const [showModal, setShowModal] = React.useState<boolean>(false);

  const handleRedirect = (pathname: string) => {
    Router.push(pathname);
  };

  useEffect(() => {
    getClassList();
  }, []);

  const getClassList = async () => {
    ClassList('', '', 1, 10)
      .then((resp: any) => {
        const getActiveClass = resp.data?.Data?.Data?.filter((item: any) => item.ClassStatus === 1);
        setClassData(getActiveClass ?? []);
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  };

  const openDetailModal = (id: string) => {
    setClassId(id);
    setShowModal(true);
  };

  return (
    <Layout title="Bài tập" backButton backButtonUrl="/teacher/dashboard">
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
      <div>
        <Row>
          <Col span={24}>
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
                      <Card title={item.ClassName} style={{ width: 300 }}>
                        {'Đang có'} {item.HomeWorkCount || 0} {'bài tập'}
                      </Card>
                    </div>
                  </Col>
                );
              })}
            </Row>
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
