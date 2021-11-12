import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Modal, Space } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import ModalEditStaffInfo from './ModalEditStaffInfo';
import { getListStaff, deleteStaff } from 'core/services/staff';
import router from 'next/router';

function index() {
  const [role, setRole] = useState<any>();
  const [listStaff, setListStaff] = useState<any>();
  const [showEditProfileModal, setShowEditProfileModal] = React.useState<boolean>(false);
  const [staffID, setStaffID] = useState<string>('');
  useEffect(() => {
    let value = localStorage.getItem('roles') ?? '';
    setRole(JSON.parse(value));
    getStaffList();
  }, []);

  const getStaffList = async () => {
    getListStaff()
      .then((resp) => {
        const data = resp?.data.Data;
        if (data) {
          setListStaff(data!.Data);
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const openDetailModal = (record: any) => {
    setShowEditProfileModal(true);
    console.log('record', record);
    setStaffID(record.AccountId);
  };

  const handleDeleteStaff = (id: string) => {
    deleteStaff(id).then((resp) => {
      getStaffList();
    });
  };

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
          <a onClick={() => openDetailModal(record)}>Detail </a>
          <a onClick={() => handleDeleteStaff(record.AccountId)}>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Layout title={'Staff'}>
        <div>
          <Table columns={columns} dataSource={listStaff} />
          <Modal
            width={755}
            bodyStyle={{ height: 'max-content' }}
            title={'Detail of staff'}
            visible={showEditProfileModal}
            onCancel={() => setShowEditProfileModal(false)}
            onOk={() => setShowEditProfileModal(false)}
            destroyOnClose
            footer={null}
            className="edit-profile-modal"
          >
            <ModalEditStaffInfo staffID={staffID} onCloseModal={() => setShowEditProfileModal(false)} />
          </Modal>
        </div>
      </Layout>
    </>
  );
}

export default withAuth(index);
