import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Row, Col, Pagination, Modal, Input, Button, Select, Space } from 'antd';
import Link from 'next/link';
import { ProductList, DeleteProduct } from 'core/services/product';
import { useRouter } from 'next/router';
import { FormOutlined } from '@ant-design/icons';
import { formatNumber } from '@utils/StringUtil';
import ModalProduct from './ModalProduct';

const { Option } = Select;

function index() {
  const [productData, setProductData] = useState<any>();
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [role, setRole] = useState<any>();
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('ProductCode+asc');
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [productId, setProductId] = useState<string>('');

  useEffect(() => {
    let value = localStorage.getItem('roles') ?? '';
    setRole(JSON.parse(value));

    if (!showModal) {
      getProductList();
    }
  }, [showModal, currentPage, sort]);

  const openDetailModal = (id: string) => {
    setProductId(id);
    setShowModal(true);
  };

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
      render: (text: any) => (
        <text>
          {formatNumber(text)}
          {'đ'}
        </text>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'Quantity',
    },
    {
      title: 'Discount',
      dataIndex: 'Discount',
      render: (text: any) => (
        <text>
          {text} {'%'}
        </text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <FormOutlined onClick={() => openDetailModal(record.ProductId)} />
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

  const handleAddNew = () => {
    setProductId('');
    setShowModal(true);
  };

  return (
    <Layout title={'Sản Phẩm'}>
      <div>
        <Row>
          <Col span={18}>
            <Input placeholder={'Tìm kiếm'} onChange={({ target }: any) => setSearch(target.value)} width="50%" />
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={getProductList}>
              Tìm kiếm
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Button type="primary" onClick={handleAddNew}>
              {/* <Button type="primary" onClick={() => router.push('/product/product-create')}> */}
              Thêm mới
            </Button>
          </Col>
          <Col span={12}>
            <Select defaultValue={'ProductCode+asc'} style={{ width: 120 }} onChange={(value) => setSort(value)}>
              <Option value={'ProductCode+asc'}>Mã SP 0-9</Option>
              <Option value={'ProductCode+desc'}>Mã SP 9-0</Option>
              <Option value={'Title+asc'}>Tên 0-9</Option>
              <Option value={'Title+desc'}>Tên 9-0</Option>
              <Option value={'Price+asc'}>Giá 0-9</Option>
              <Option value={'Price+desc'}>Giá 9-0</Option>
              <Option value={'Quantity+asc'}>Số lượng 0-9</Option>
              <Option value={'Quantity+desc'}>Số lượng 9-0</Option>
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
          <ModalProduct showModal={showModal} productId={productId} onCloseModal={() => setShowModal(false)} />
        </Modal>
      </div>
    </Layout>
  );
}

export default withAuth(index);
