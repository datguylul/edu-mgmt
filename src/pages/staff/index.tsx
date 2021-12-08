import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Modal, Space } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import ModalEditStaffInfo from './ModalEditStaffInfo';
import { getListStaff, deleteStaff } from 'core/services/staff';
import router from 'next/router';
import { openNotification } from '@utils/Noti';

function index() {
  const [role, setRole] = useState<any>();
  const [listStaff, setListStaff] = useState<any>();
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [staffID, setStaffID] = useState<string>('');

  useEffect(() => {
    let value = localStorage.getItem('roles') ?? '';
    setRole(JSON.parse(value));

    if (!showModal) {
      getStaffList();
    }
  }, [showModal]);

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
        openNotification('Danh sách nhân viên', 'Có lỗi khi lấy danh sách nhân viên');
      });
  };

  const openDetailModal = (id: string) => {
    setShowModal(true);
    setStaffID(id);
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
          <a onClick={() => openDetailModal(record.AccountId)}>Detail </a>
          {/* <a onClick={() => handleDeleteStaff(record.AccountId)}>Delete</a> */}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Layout title={'Staff'}>
        {role && role[0]?.RoleId === 1 ? (
          <div>
            <Table columns={columns} dataSource={listStaff} />
            <Modal
              width={755}
              bodyStyle={{ height: 'max-content' }}
              title={'Detail of staff'}
              visible={showModal}
              onCancel={() => setShowModal(false)}
              onOk={() => setShowModal(false)}
              destroyOnClose
              footer={null}
              className="edit-profile-modal"
            >
              <ModalEditStaffInfo showModal={showModal} staffID={staffID} onCloseModal={() => setShowModal(false)} />
            </Modal>
          </div>
        ) : (
          <>Ban khong co quyen xem trang nay</>
        )}
      </Layout>
    </>
  );
}

export default withAuth(index);
