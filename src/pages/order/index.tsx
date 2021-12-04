import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Space, Pagination, notification, Modal, Tag } from 'antd';
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
  MinusCircleOutlined,
} from '@ant-design/icons';

function index() {
  const [productData, setProductData] = useState<any>();
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [ordersId, setOrdersId] = useState<string>('');

  const openNotification = (Title: string, Content: string) => {
    notification.open({
      message: Title,
      description: Content,
      onClick: () => {},
      placement: 'bottomRight',
    });
  };

  useEffect(() => {
    getOrderList();
  }, [currentPage]);

  const getOrderList = async () => {
    OrderList(currentPage, pageSize)
      .then((resp) => {
        setProductData(resp.data?.Data);
        setTotalRecord(resp.data?.TotalRecord);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const deleteOrder = (id: string) => {
    OrderDelete(id)
      .then((resp) => {
        console.log(resp.data);
        openNotification('Xóa đơn hàng thành công', 'Thành công');
      })
      .catch((error) => {
        console.log('error', error);
        openNotification('Xóa đơn hàng thất bại', 'Thất bại');
      });
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
        icon = <CheckCircleOutlined spin />;
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

  function formatPrice(price: number | null | undefined) {
    return price
      ? price.toLocaleString('en-US', {
          style: 'currency',
          currency: 'VND',
        })
      : price;
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'OrdersId',
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
      title: 'CustomerAddress',
      dataIndex: 'CustomerAddress',
    },
    {
      title: 'SĐT',
      dataIndex: 'CustomerPhone',
    },
    {
      title: 'Tổng',
      dataIndex: 'Total',
      render: (total: number) => <text>{formatPrice(total)}</text>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'CreateDate',
      render: (date: string) => <text>{new Date(date)?.toLocaleDateString()}</text>,
    },
    {
      title: 'Tùy chọn',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <a onClick={() => openDetailModal(record.OrdersId)}>Detail</a>
          <a onClick={() => deleteOrder(record.OrdersId)}>Delete</a>
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

  return (
    <Layout title={'Đơn Hàng'}>
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
          <OrderDetailModal ordersId={ordersId} onCloseModal={() => setShowModal(false)} />
        </Modal>
      </div>
    </Layout>
  );
}

export default withAuth(index);
