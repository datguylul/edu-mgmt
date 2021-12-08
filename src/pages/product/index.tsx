import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Row, Col, Pagination, DatePicker, Input, Button, Select, Space } from 'antd';
import Link from 'next/link';
import { ProductList, DeleteProduct } from 'core/services/product';
import { useRouter } from 'next/router';
import { FormOutlined } from '@ant-design/icons';

const { Option } = Select;

function index() {
  const router = useRouter();
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
            <FormOutlined />
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

  const handleSelectChange = (value: any) => {
    setSort(value);
  };

  const handleSearchChange = ({ target }: any) => {
    setSearch(target.value);
  };

  return (
    <Layout title={'Sản Phẩm'}>
      <div>
        <Row>
          <Col span={18}>
            <Input placeholder={'Tìm kiếm'} onChange={() => null} width="50%" />
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={getProductList}>
              Tìm kiếm
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Button type="primary" onClick={() => router.push('/product/product-create')}>
              Thêm mới
            </Button>
          </Col>
          <Col span={12}>
            <Select defaultValue={'ID 0-9'} style={{ width: 120 }} onChange={() => null}>
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
        <Table columns={columns} dataSource={productData} pagination={false} />
        <Pagination defaultCurrent={currentPage} onChange={onPagingChange} current={currentPage} total={totalRecord} />
      </div>
    </Layout>
  );
}

export default withAuth(index);
