import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Space, Pagination, Button, Input, Modal, Tag, Row, Col, Select } from 'antd';
import Link from 'next/link';
import { OrderList, OrderDelete } from 'core/services/product';
import OrderDetailModal from './OrderDetailModal';
import { ORDER_STATUS } from '@core/constants';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { openNotification } from '@utils/Noti';
import { formatNumber, formatDate } from '@utils/StringUtil';

const { Option } = Select;

function index() {
  const [productData, setProductData] = useState<any>();
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [ordersId, setOrdersId] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('CreateDate+asc');

  useEffect(() => {
    if (!showModal) {
      getOrderList();
    }
  }, [currentPage, showModal, sort]);

  const getOrderList = async () => {
    OrderList(search, sort, currentPage, pageSize)
      .then((resp) => {
        setProductData(resp.data?.Data);
        setTotalRecord(resp.data?.TotalRecord);
      })
      .catch((error) => {
        openNotification('Danh sách đơn hàng', 'Có lỗi khi lấy danh sách đơn hàng');
        console.log('error', error);
      });
  };

  const deleteOrder = (id: string) => {
    // OrderDelete(id)
    //   .then((resp) => {
    //     console.log(resp.data);
    //     openNotification('Xóa đơn hàng thành công', 'Thành công');
    //   })
    //   .catch((error) => {
    //     console.log('error', error);
    //     openNotification('Xóa đơn hàng thất bại', 'Thất bại');
    //   });
  };

  const getOrderStatusColor = (status: number) => {
    let color: string = '';
    switch (status) {
      case 1:
        color = 'geekblue';
        break;
      case 2:
        color = 'cyan';
        break;
      case 3:
        color = 'green';
        break;
      case 4:
        color = 'grey';
        break;
      case 5:
        color = 'orange';
        break;
      case 6:
        color = 'red';
        break;
      default:
        color = 'geekblue';
        break;
    }
    return color;
  };

  const getOrderStatusIcon = (status: number) => {
    let icon: any = null;
    switch (status) {
      case 1:
        icon = <SyncOutlined spin />;
        break;
      case 2:
        icon = <ClockCircleOutlined />;
        break;
      case 3:
        icon = <CheckCircleOutlined />;
        break;
      case 4:
        icon = <ExclamationCircleOutlined />;
        break;
      case 5:
        icon = <ExclamationCircleOutlined />;
        break;
      case 6:
        icon = <CloseCircleOutlined />;
        break;
      default:
        icon = <SyncOutlined />;
        break;
    }
    return icon;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'OrdersId',
      // render: (text: any, record: any) => (
      //   <Space size="middle">
      //     <text onClick={() => openDetailModal(record.OrdersId)}>{text}</text>
      //   </Space>
      // ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'Status',
      render: (status: number) => (
        <>
          {ORDER_STATUS.map((item) => {
            const color = getOrderStatusColor(status);
            const icon = getOrderStatusIcon(status);

            if (item.id === status) {
              return (
                <Tag color={color} key={item.id} icon={icon}>
                  {item.name}
                </Tag>
              );
            }
          })}
        </>
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'CustomerName',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'CustomerAddress',
    },
    {
      title: 'SĐT',
      dataIndex: 'CustomerPhone',
    },
    {
      title: 'Tổng',
      dataIndex: 'Total',
      render: (total: number) => (
        <text>
          {formatNumber(total)}
          {'đ'}
        </text>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'CreateDate',
      render: (date: string) => <text>{formatDate(date)}</text>,
    },
    {
      title: 'Tùy chọn',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <FormOutlined onClick={() => openDetailModal(record.OrdersId)} />
        </Space>
      ),
    },
  ];

  const openDetailModal = (id: string) => {
    setShowModal(true);
    setOrdersId(id);
  };

  const onPagingChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddNew = () => {
    setOrdersId('');
    setShowModal(true);
  };

  return (
    <Layout title={'Đơn Hàng'}>
      <div>
        <Row>
          <Col span={18}>
            <Input placeholder={'Tìm kiếm'} onChange={({ target }: any) => setSearch(target.value)} width="50%" />
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={getOrderList}>
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
            <Select defaultValue={'CreateDate+desc'} style={{ width: 120 }} onChange={(value) => setSort(value)}>
              <Option value={'CreateDate+asc'}>Ngày tạo 0-9</Option>
              <Option value={'CreateDate+desc'}>Ngày tạo 9-0</Option>
              <Option value={'OrdersId+asc'}>ID 0-9</Option>
              <Option value={'OrdersId+desc'}>ID 9-0</Option>
              <Option value={'Status+asc'}>Trạng thái 0-9</Option>
              <Option value={'Status+desc'}>Trạng thái 9-0</Option>
            </Select>
          </Col>
        </Row>
      </div>
      <div>
        <Table columns={columns} dataSource={productData} pagination={false} />
        <Pagination defaultCurrent={currentPage} onChange={onPagingChange} current={currentPage} total={totalRecord} />
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
          <OrderDetailModal showModal={showModal} ordersId={ordersId} onCloseModal={() => setShowModal(false)} />
        </Modal>
      </div>
    </Layout>
  );
}

export default withAuth(index);
