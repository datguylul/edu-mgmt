import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Modal, Space } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import ModalEditStaffInfo from './ModalEditStaffInfo';
import { getListStaff } from 'core/services/staff';

function index() {
  const [role, setRole] = useState<any>();
  const [listStaff, setListStaff] = useState<any>([]);
  const [showEditProfileModal, setShowEditProfileModal] = React.useState<boolean>(false);
  useEffect(() => {
    let value = localStorage.getItem('roles') ?? '';
    setRole(JSON.parse(value));
    getStaffList();
  }, []);

  const getStaffList = async () => {
    getListStaff()
      .then((resp) => {
        console.log(`resp.data`, resp.data);
        setListStaff(resp.data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  console.log(`listStaff`, listStaff);
  const columns = [
    {
      title: 'Name',
      dataIndex: 'DisplayName',
    },
    {
      title: 'Address',
      dataIndex: 'Address',
    },
    {
      title: 'Last login',
      dataIndex: 'LastLogin',
    },
    {
      title: 'Action',
      render: (record: any) => (
        <Space size="middle">
          <a onClick={() => setShowEditProfileModal(true)}>Detail </a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      {role && role[0] === 'ROLE_ADMIN' ? (
        <Layout title={'Staff'}>
          <div>
            <Table columns={columns} dataSource={listStaff} />
            <Modal
              width={755}
              bodyStyle={{ height: 'max-content' }}
              title={'Detail of staff'}
              visible={showEditProfileModal}
              // onCancel={handleCancelEditProfileModal}
              // onOk={handleOkEditProfileModal}
              destroyOnClose
              footer={null}
              className="edit-profile-modal"
            >
              <ModalEditStaffInfo />
            </Modal>
          </div>
        </Layout>
      ) : (
        <p style={{ textAlign: 'center' }}>You dont have permissions to view this page</p>
      )}
    </>
  );
}

export default withAuth(index);
