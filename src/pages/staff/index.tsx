import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Modal, Checkbox, Pagination, DatePicker, Input, Button, Select, Space } from 'antd';
import ModalEditStaffInfo from './ModalEditStaffInfo';
import { getListStaff, deleteStaff } from 'core/services/staff';
import { openNotification } from '@utils/Noti';

const { Option } = Select;

function index() {
  const [role, setRole] = useState<any>();
  const [listStaff, setListStaff] = useState<any>();
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [staffID, setStaffID] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('id_asc');

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

  const handleSearchChange = ({ target }: any) => {
    setSearch(target.value);
  };

  const handleSelectChange = (value: any) => {
    setSort(value);
  };

  const handleAddNew = () => {
    setStaffID('');
    setShowModal(true);
  };

  return (
    <>
      <Layout title={'Staff'}>
        {role && role[0]?.RoleId === 1 ? (
          <React.Fragment>
            <div>
              <div>
                <Input placeholder={'Search'} onChange={handleSearchChange} width="50%" />
                <Button type="primary" onClick={getStaffList}>
                  Tìm kiếm
                </Button>
              </div>
              <Select defaultValue={'ID 0-9'} style={{ width: 120 }} onChange={handleSelectChange}>
                <Option value={'work_name_asc'}>Công Việc A-Z</Option>
                <Option value={'work_name_desc'}>Công Việc Z-A</Option>
                <Option value={'empl_name_asc'}>Tên A-Z</Option>
                <Option value={'empl_name_desc'}>Tên Z-A</Option>
                <Option value={'id_asc'}>ID 0-9</Option>
                <Option value={'id_desc'}>ID 9-0</Option>
                {/* {sortSelect.map((item, index) => {
                <Option value={item.name} key={index}>{item.title}</Option>
              })} */}
              </Select>
              <Button type="primary" onClick={handleAddNew}>
                Thêm mới
              </Button>
            </div>
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
          </React.Fragment>
        ) : (
          <>Ban khong co quyen xem trang nay</>
        )}
      </Layout>
    </>
  );
}

export default withAuth(index);
