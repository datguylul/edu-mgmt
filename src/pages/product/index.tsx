import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Space, Pagination } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import { parse } from 'path/posix';
import Link from 'next/link';
import { ProductList } from 'core/services/product';
import Image from 'next/image';

function index() {
  const [productData, setProductData] = useState<any>();
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    getProductList();
  }, [currentPage]);

  const getProductList = async () => {
    ProductList(currentPage - 1, pageSize)
      .then((resp) => {
        setProductData(resp.data?.Data);
        setTotalRecord(resp.data?.TotalRecord);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const NoImage =
    'https://st4.depositphotos.com/17828278/24401/v/600/depositphotos_244011872-stock-illustration-image-vector-symbol-missing-available.jpg';

  const columns = [
    {
      title: 'Image',
      key: 'image',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Image src={record?.MetaTitle ? record.MetaTitle : NoImage} width={90} height={60} alt={record.Title} />
          {/* <Link href={`product/${record.ProductId}`}>
            <a>Detail</a>
          </Link> */}
        </Space>
      ),
    },
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

  const onPagingChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout title={'Product'}>
      <div>
        <Table columns={columns} dataSource={productData} pagination={false} />
        <Pagination defaultCurrent={currentPage} onChange={onPagingChange} current={currentPage} total={totalRecord} />
      </div>
    </Layout>
  );
}

export default withAuth(index);
