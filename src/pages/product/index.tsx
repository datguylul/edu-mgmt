import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Space } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import { parse } from 'path/posix';
import Link from 'next/link';
import { ProductList } from 'core/services/product';

function index() {
  const [productData, setProductData] = useState<any>();

  useEffect(() => {
    getProductList();
  }, []);

  const getProductList = async () => {
    ProductList(0, 10)
      .then((resp) => {
        setProductData(resp?.data?.Data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const columns = [
    {
      title: 'ProductCode',
      dataIndex: 'ProductCode',
    },
    {
      title: 'Title',
      dataIndex: 'Title',
    },
    {
      title: 'Price',
      dataIndex: 'Price',
    },
    {
      title: 'Quantity',
      dataIndex: 'Quantity',
    },
    {
      title: 'Discount',
      dataIndex: 'Discount',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Link href={`product/${record.ProductId}`}>
            <a>Detail</a>
          </Link>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <Layout title={'Product'}>
      <div>
        <Table columns={columns} dataSource={productData} />
      </div>
    </Layout>
  );
}

export default withAuth(index);
