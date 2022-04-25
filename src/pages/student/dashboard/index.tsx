import React from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Row, Col, Card } from 'antd';
import Router from 'next/router';
import { BookOutlined, HighlightOutlined, AuditOutlined, UserOutlined } from '@ant-design/icons';

const StudentMenu = [
  {
    id: 1,
    title: 'Bài tập',
    urlDirect: '/student/homework',
    icon: <BookOutlined style={{ fontSize: '150%' }} twoToneColor="#eb2f96" />,
  },
  {
    id: 2,
    title: 'Danh sách lớp',
    urlDirect: '/student/class',
    icon: <AuditOutlined style={{ fontSize: '150%' }} twoToneColor="#eb2f96" />,
  },
  {
    id: 4,
    title: 'Thông tin tài khoản',
    urlDirect: '/student/profile',
    icon: <UserOutlined style={{ fontSize: '150%' }} twoToneColor="#eb2f96" />,
  },
];

const Home = () => {
  const handleRedirect = (pathname: string) => {
    Router.push(pathname);
  };

  return (
    <Layout title="Trang chủ học sinh">
      <Row>
        <Col span={18}>
          <Row gutter={[48, 24]}>
            {StudentMenu.map((item) => {
              return (
                <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }} key={item.id}>
                  <div
                    onClick={() => handleRedirect(item.urlDirect)}
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <Card title={item.title} style={{ width: 300 }}>
                      {item.icon}
                    </Card>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Col>
        <Col span={6}></Col>
      </Row>
    </Layout>
  );
};
export default withAuth(Home);
