import React from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Router from 'next/router';

const HomeWork = () => {
  const handleRedirect = (pathname: string) => {
    Router.push(pathname);
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
      <div></div>
    </Layout>
  );
};
export default withAuth(HomeWork);
