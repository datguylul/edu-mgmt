import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Modal, Checkbox, Pagination, DatePicker, Input, Button, Select, Space, Row, Col } from 'antd';
import { UserList } from '@core/services/api';
import UserModal from 'components/Modal/UserModal';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
const { Option } = Select;

function index() {
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [selectThang, setSelectThang] = useState<boolean>(true);
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('id_asc');
  const [teacherData, setUserData] = useState([]);
  const [userId, setUserId] = useState<string>('');
  const [showModal, setShowModal] = React.useState<boolean>(false);

  useEffect(() => {
    if (!showModal) {
      getUserList();
    }
  }, [sort, showModal]);

  const getUserList = async () => {
    UserList(search, sort, currentPage, pageSize)
      .then((resp: any) => {
        setUserData(resp.data?.Data?.Data ?? []);
        setTotalRecord(resp.data?.TotalRecord);
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  };

  const columns = [
    {
      title: 'Mã hệ thống',
      dataIndex: 'SystemUserId',
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'Username',
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'UserUsername',
    },
    {
      title: 'Tùy chọn',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <FormOutlined onClick={() => openDetailModal(record.SystemUserId)} />
          <DeleteOutlined onClick={() => openDetailModal(record.SystemUserId)} />
          {/* <a >Chi tiết</a> */}
        </Space>
      ),
    },
  ];

  const openDetailModal = (id: string) => {
    setUserId(id);
    setShowModal(true);
  };

  const onPagingChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectChange = (value: any) => {
    setSort(value);
  };

  const handleSearchChange = ({ target }: any) => {
    setSearch(target.value);
  };

  const handleCheckboxChange = () => {
    setSelectThang((prev) => !prev);
  };

  const handleAddNew = () => {
    setUserId('');
    setShowModal(true);
  };

  return (
    <Layout title={'Danh sách người dùng'}>
      <div>
        <Row>
          <Col span={18}>
            <Input placeholder={'Tìm kiếm'} onChange={handleSearchChange} width="50%" />
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={getUserList}>
              Tìm kiếm
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Button type="primary" onClick={handleAddNew}>
              Thêm mới
            </Button>
          </Col>
          <Col span={12}>
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
          </Col>
        </Row>
      </div>
      <div>
        <Table columns={columns} dataSource={teacherData} pagination={false} />
        <Pagination
          defaultPageSize={pageSize}
          defaultCurrent={currentPage}
          onChange={onPagingChange}
          current={currentPage}
          total={totalRecord}
        />
        <Modal
          width={755}
          bodyStyle={{ height: 'max-content' }}
          title={'Chi tiết giáo viên'}
          visible={showModal}
          onCancel={() => setShowModal(false)}
          destroyOnClose
          footer={null}
          className="edit-profile-modal"
        >
          <UserModal userId={userId} />
        </Modal>
      </div>
    </Layout>
  );
}

export default index;
