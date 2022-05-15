import React, { useEffect, useState } from 'react';
import { Modal, Table, Form, Input, Button, Space, Select, DatePicker } from 'antd';
import { ClassDetail, EditClass, ClassRemoveStudent } from '@core/services/api';
import moment from 'moment';
import { openNotification } from '@utils/Noti';
import { useRouter } from 'next/router';
import Layout from 'Layouts';
import ClassAddStudentModal from 'components/Modal/teacher-admin/ClassAddStudentModal';
import StudentDetailModal from 'components/Modal/teacher-admin/StudentDetailModal';
import { CLASS_STATUS } from '@core/constants';
import { InfoOutlined, FormOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

const ClassStatusList = [CLASS_STATUS.active, CLASS_STATUS.finish];
const { Option } = Select;

interface Props {}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const index: React.FC<Props> = ({}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { classId } = router.query;
  const [studentData, setStudentData] = useState([]);
  const [isAddModal, setIsAddModal] = useState(true);
  const [studentId, setStudentId] = useState<string>('');
  const [showModal, setShowModal] = React.useState<boolean>(false);

  const LoadDetail = () => {
    setLoading(true);
    ClassDetail(classId as string)
      .then((resp) => {
        const data = resp.data?.Data?.class;
        if (data) {
          fillForm(data);
          setStudentData(resp.data?.Data?.students);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fillForm = (data: any) => {
    const year = data?.ClassYear.split('-');
    const status = ClassStatusList.find((x) => x.value === data?.ClassStatus);

    form.setFieldsValue({
      ClassName: data?.ClassName,
      ClassYear: moment(year[0] + '-1-1'),
      ClassStatus: status?.value,
    });
  };

  const handleSubmit = (values: any) => {
    values.ClassYear = values['ClassYear']?.format('YYYY');

    setLoading(true);
    EditClass(classId as string, values)
      .then((resp) => {
        if (resp.data.Success) {
          openNotification('Cập nhật lớp', 'Cập nhật lớp thành công', 'success');
        } else {
          openNotification('Cập nhật lớp', resp.data.Message, 'error');
        }
      })
      .catch((error) => {
        console.log('error', error);
        openNotification('Cập nhật lớp', 'Cập nhật lớp thất bại', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'StudentName',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'StudentDob',
    },
    {
      title: 'Giới tính',
      dataIndex: 'StudentGender',
    },
    {
      title: 'Sđt',
      dataIndex: 'StudentPhone',
    },
    {
      title: 'Tùy chọn',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <DeleteOutlined onClick={() => handleDeleteStudent(record.StudentId)} />
          <FormOutlined onClick={() => openStudentDetailModal(record.StudentId)} />
        </Space>
      ),
    },
  ];

  function showDeleteConfirm() {
    confirm({
      title: 'Are you sure delete this task?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const handleDeleteStudent = (studentId = '') => {
    confirm({
      title: 'Xóa học sinh khỏi lớp này?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        const params = {
          classId: classId,
          studentList: [studentId],
        };
        ClassRemoveStudent(params)
          .then((res) => {
            if (res.data.Success) {
              openNotification('Xóa học sinh', 'Xóa học sinh thành công', 'success');
            } else {
              openNotification('Xóa học sinh', res.data.Message, 'error');
            }
          })
          .catch((error) => {
            console.log('error', error);
            openNotification('Xóa học sinh', 'Xóa học sinh không thành công', 'error');
          })
          .finally(() => {
            LoadDetail();
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const openStudentDetailModal = (studentId = '') => {
    setStudentId(studentId);
    setIsAddModal(false);
    setShowModal(true);
  };

  const handleOpenAddStudentModal = () => {
    setIsAddModal(true);
    setShowModal(true);
  };

  useEffect(() => {
    LoadDetail();
  }, []);

  useEffect(() => {
    if (!showModal) {
      LoadDetail();
    }
  }, [showModal]);

  const onCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Layout title={'Danh sách lớp'} backButton backButtonUrl="/teacher/class">
      <div>
        <Form {...formItemLayout} form={form} name="register" onFinish={handleSubmit} scrollToFirstError>
          <Form.Item
            name="ClassName"
            label="Tên lớp"
            rules={[
              {
                required: true,
                message: 'Tên lớp không thể trống',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ClassYear"
            label="Năm học"
            rules={[{ type: 'object' as const, required: true, message: 'Chọn năm học!' }]}
          >
            <DatePicker picker="year" />
          </Form.Item>
          <Form.Item name="ClassStatus" label="Trạng thái">
            <Select>
              {ClassStatusList.map((item: any) => (
                <Option value={item?.value}>{item.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                {'Cập nhật'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <div>
        <Button type="primary" htmlType="submit" onClick={handleOpenAddStudentModal}>
          {'Thêm học sinh'}
        </Button>
        <Table columns={columns} dataSource={studentData} pagination={false} />
        {/* <Pagination
          defaultPageSize={pageSize}
          defaultCurrent={currentPage}
          onChange={onPagingChange}
          current={currentPage}
          total={totalRecord}
        /> */}
      </div>

      <div>
        <Modal
          width={755}
          bodyStyle={{ height: 'max-content' }}
          title={isAddModal ? 'Thêm học sinh lớp' : 'Học sinh'}
          visible={showModal}
          onCancel={() => setShowModal(false)}
          destroyOnClose
          footer={null}
          className="edit-profile-modal"
        >
          {isAddModal ? (
            <ClassAddStudentModal classId={classId as string} onCloseModal={onCloseModal} />
          ) : (
            <StudentDetailModal classId={classId as string} studentId={studentId} onCloseModal={onCloseModal} />
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default index;
