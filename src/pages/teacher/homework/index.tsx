import React, { useState, useEffect } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Row, Col, Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ClassList } from '@core/services/api';
import Router from 'next/router';

const HomeWork = () => {
  const [classData, setClassData] = useState([]);

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

  return (
    <Layout title="Bài tập" backButton>
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
                      onClick={() => handleRedirect('')}
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      <Card title={item.ClassName} style={{ width: 300 }}>
                        {/* {item.icon} */}
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
    </Layout>
  );
};
export default withAuth(HomeWork);
