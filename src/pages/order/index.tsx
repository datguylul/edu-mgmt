import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Space, Pagination } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import { parse } from 'path/posix';
import Link from 'next/link';
import { OrderList } from 'core/services/product';
import Image from 'next/image';

function index() {
  const [productData, setProductData] = useState<any>();
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  const columns = [
    {
      title: 'OrdersId',
      dataIndex: 'OrdersId',
    },
    {
      title: 'CustomerName',
      dataIndex: 'CustomerName',
    },
    {
      title: 'CustomerAddress',
      dataIndex: 'CustomerAddress',
    },
    {
      title: 'CustomerPhone',
      dataIndex: 'CustomerPhone',
    },
    {
      title: 'Total',
      dataIndex: 'Total',
    },
    {
      title: 'CreateDate',
      dataIndex: 'CreateDate',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Link href={`order/${record.OrdersId}`}>
            <a>Detail</a>
          </Link>
        </Space>
      ),
    },
  ];

  const onPagingChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout title={'Đơn Hàng'}>
      <div>
        <Table columns={columns} dataSource={productData} pagination={false} />
        <Pagination defaultCurrent={currentPage} onChange={onPagingChange} current={currentPage} total={totalRecord} />
      </div>
    </Layout>
  );
}

export default withAuth(index);
