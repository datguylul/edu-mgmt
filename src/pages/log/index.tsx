import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Space, Pagination } from 'antd';
import { LogList } from 'core/services/log';

function index() {
  const [productData, setProductData] = useState<any>();
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    getProductList();
  }, [currentPage]);

  const getProductList = async () => {
    LogList(currentPage - 1, pageSize)
      .then((resp) => {
        const data = resp.data?.Data;
        if (data) {
          setProductData(data!.Data);
          setTotalRecord(data!.TotalRecord);
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const columns = [
    {
      title: 'Action',
      dataIndex: 'Action',
    },
    {
      title: 'Ip',
      dataIndex: 'Ip',
    },
    {
      title: 'Username',
      dataIndex: 'Username',
    },
    {
      title: 'CreateDate',
      dataIndex: 'CreateDate',
    },
  ];

  const onPagingChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout title={'Log'}>
      <div>
        <Table columns={columns} dataSource={productData} pagination={false} />
        <Pagination defaultCurrent={currentPage} onChange={onPagingChange} current={currentPage} total={totalRecord} />
      </div>
    </Layout>
  );
}

export default withAuth(index);
