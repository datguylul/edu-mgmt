import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Modal, Checkbox, Pagination, DatePicker, Input, Button, Select, Space, Row, Col } from 'antd';
import { SchoolYearList } from '@core/services/api';
import SchoolYearModal from 'components/Modal/SchoolYearModal';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
const { Option } = Select;

function index() {
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [selectThang, setSelectThang] = useState<boolean>(true);
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('id_asc');
  const [schoolYearData, setSchoolYearData] = useState([]);
  const [schoolYearId, setSchoolYearId] = useState<string>('');
  const [showModal, setShowModal] = React.useState<boolean>(false);

  useEffect(() => {
    if (!showModal) {
      getSchoolYearList();
    }
  }, [sort, showModal]);

  const getSchoolYearList = async () => {
    SchoolYearList(search, sort, currentPage, pageSize)
      .then((resp: any) => {
        setSchoolYearData(resp.data?.Data?.Data ?? []);
        setTotalRecord(resp.data?.TotalRecord);
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  };

  const columns = [
    {
      title: 'Tên năm học',
      dataIndex: 'SchoolYearName',
    },
    {
      title: 'Thời gian',
      dataIndex: 'SchoolYearDate',
    },
    {
      title: 'Năm hoạt động',
      dataIndex: 'ActiveYear',
    },
    {
      title: 'Tùy chọn',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <FormOutlined onClick={() => openDetailModal(record.SchoolYearId)} />
          <DeleteOutlined onClick={() => openDetailModal(record.SchoolYearId)} />
          {/* <a >Chi tiết</a> */}
        </Space>
      ),
    },
  ];

  const openDetailModal = (id: string) => {
    setSchoolYearId(id);
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
    setSchoolYearId('');
    setShowModal(true);
  };

  return (
    <Layout title={'Danh sách lớp'}>
      <div>
        <Row>
          <Col span={18}>
            <Input placeholder={'Tìm kiếm'} onChange={handleSearchChange} width="50%" />
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={getSchoolYearList}>
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
        <Table columns={columns} dataSource={schoolYearData} pagination={false} />
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
          title={'Chi tiết lớp'}
          visible={showModal}
          onCancel={() => setShowModal(false)}
          destroyOnClose
          footer={null}
          className="edit-profile-modal"
        >
          <SchoolYearModal schoolYearId={schoolYearId} />
        </Modal>
      </div>
    </Layout>
  );
}

export default withAuth(index);
