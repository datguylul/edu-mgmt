import React, { useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';

import { Checkbox, Row, Col, Form, Input, Button, Space } from 'antd';
import { getStaffDetail, editStaffDetail } from 'core/services/staff';
import { getRole, getRoleName } from 'core/services/role';

interface IStaffInfo {
  staffID?: string;
  showModal: boolean;
  onCloseModal?: () => void;
}
interface RoleItem {
  Name: string;
  RoleId: number;
  Role_Code: string;
}

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
const ModalEditStaffInfo: React.FC<IStaffInfo> = ({ showModal = false, staffID, onCloseModal }) => {
  const [form] = Form.useForm();
  const [rolesData, setRolesData] = useState<[RoleItem] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const LoadDetail = () => {
    getStaffDetail(staffID!.toString())
      .then((resp) => {
        const data = resp.data.Data.account;
        getAccountRole(staffID!, data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAccountRole = (id: string, data: {}) => {
    if (id) {
      getRole(id).then((res) => {
        const rolesAccount = res.data.Data.map((a: RoleItem) => a.RoleId);
        // const findAdmin = rolesAccount.includes(1);

        // let roles = rolesAccount;
        // if (findAdmin) {
        //   roles = rolesData.map((a: RoleItem) => a.RoleId);
        // }
        fillForm(data, rolesAccount);
      });
    }
  };

  const getRolesName = () => {
    getRoleName()
      .then((res) => {
        // console.log("res", res.data.Data);
        setRolesData(res.data.Data);
      })
      .catch((error) => {});
  };

  const fillForm = (data: any, role: [number]) => {
    form.setFieldsValue({
      AccountId: data?.AccountId,
      DisplayName: data?.DisplayName,
      LastName: data?.LastName,
      MidName: data.MidName,
      Email: data.Email,
      Address: data.Address,
      Mobile: data.Mobile,
      Intro: data.Intro,
      RoleIds: role,
    });
  };

  const handleEditProfile = (params: any) => {
    console.log('params', params);
    setLoading(true);

    editStaffDetail(params)
      .then((resp) => {
        console.log(resp.data);
      })
      .catch((error) => {
        console.log('error', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (staffID && showModal) {
      setLoading(true);
      try {
        LoadDetail();
        getRolesName();
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoading(false);
      }
    }
  }, [showModal, staffID]);

  return (
    <>
      <Form {...formItemLayout} form={form} name="register" onFinish={handleEditProfile} scrollToFirstError>
        <Form.Item name="AccountId" label="ID">
          <Input disabled={true} />
          {/* <Input /> */}
        </Form.Item>
        <Form.Item name="DisplayName" label="Tên nhân viên">
          <Input />
        </Form.Item>
        <Form.Item name="Email" label="Email">
          <Input />
        </Form.Item>
        <Form.Item name="Mobile" label="Số điện thoại">
          <Input />
        </Form.Item>
        <Form.Item name="Address" label="Địa chỉ">
          <Input />
        </Form.Item>
        <Form.Item name="RoleIds" label="Quyền" extra="Quyền Admin có tất cả các quyền khác.">
          {rolesData && rolesData.length > 0 && (
            <Checkbox.Group>
              {rolesData.map((item: RoleItem) => {
                return (
                  <Row>
                    <Checkbox value={item.RoleId}>{item.Name}</Checkbox>
                  </Row>
                );
              })}
            </Checkbox.Group>
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              Cập Nhật
            </Button>
            <Button htmlType="button" onClick={onCloseModal}>
              Huỷ
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default ModalEditStaffInfo;
