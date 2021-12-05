import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Space, Pagination } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import { parse } from 'path/posix';
import Link from 'next/link';
import { ProductList, DeleteProduct } from 'core/services/product';
import Image from 'next/image';

function index() {
  const [productData, setProductData] = useState<any>();
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [role, setRole] = useState<any>();
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('');

  useEffect(() => {
    let value = localStorage.getItem('roles') ?? '';
    setRole(JSON.parse(value));
    getProductList();
  }, [currentPage]);

  const getProductList = async () => {
    ProductList(search, sort, currentPage, pageSize)
      .then((resp) => {
        setProductData(resp.data?.Data);
        setTotalRecord(resp.data?.TotalRecord);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const deleteProduct = (id: string) => {
    DeleteProduct(id).then((resp) => {
      getProductList();
    });
  };

  const imgStyle = {
    width: 60,
    height: 'auto',
    maxHeight: 90,
  };

  const columns = [
    {
      title: 'Image',
      key: 'image',
      render: (text: any, record: any) => (
        <Space size="middle">
          {/* <Image src={record?.ProductImage ? record.ProductImage : '/img/blank-img.jpg'} width={90} height={60} alt={record.Title} /> */}
          <img
            src={record?.ProductImage ? record.ProductImage : '/img/blank-img.jpg'}
            style={imgStyle}
            alt={record.Title}
          />
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
          {role && role[0]?.RoleId === 1 ? (
            <a
              onClick={() => {
                deleteProduct(record.ProductId);
              }}
            >
              Delete
            </a>
          ) : (
            <></>
          )}
        </Space>
      ),
    },
  ];

  const onPagingChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout title={'Sản Phẩm'}>
      <div>
        <Table columns={columns} dataSource={productData} pagination={false} />
        <Pagination defaultCurrent={currentPage} onChange={onPagingChange} current={currentPage} total={totalRecord} />
      </div>
    </Layout>
  );
}

export default withAuth(index);
