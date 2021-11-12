import React, { useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';

import { Checkbox, Row, Col, Form, Input, Button, Space } from 'antd';
import { getStaffDetail, editStaffDetail } from 'core/services/staff';
import { getRole, getRoleName } from 'core/services/role';

interface IStaffInfo {
  staffID?: string;
  onCloseModal?: () => void;
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
const ModalEditStaffInfo: React.FC<IStaffInfo> = ({ staffID, onCloseModal }) => {
  const [form] = Form.useForm();
  const [accountId, setAccountId] = useState<string>('');
  const [rolesID, setRolesID] = useState<any>([]);
  const LoadDetail = () => {
    getStaffDetail(staffID!.toString())
      .then((resp) => {
        const data = resp.data.Data.account;
        if (data) {
          console.log('resp', data);
          fillForm(data);
          setAccountId(data?.AccountId);
          console.log(`data.AccountId`, data.AccountId);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAccountRole = () => {
    console.log(`accountId`, accountId);
    getRole(accountId).then((resp) => {
      const data = resp?.data?.Data.map((item: any) => item.RoleId);
      console.log(`rolesID.indexOf(1) > -1`, data.indexOf(1) > -1);
      setRolesID(data);
    });
  };

  const getRolesName = () => {
    getRoleName();
  };
  const fillForm = (data: any) => {
    form.setFieldsValue({
      AccountId: data?.AccountId,
      DisplayName: data?.DisplayName,
      LastName: data?.LastName,
      MidName: data.MidName,
      Email: data.Email,
      Address: data.Address,
      Mobile: data.Mobile,
      Intro: data.Intro,
    });
  };

  const handleEditProfile = (params: any) => {
    editStaffDetail(params)
      .then((resp) => {
        console.log(resp.data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const handleCheckboxChange = (checkedValues: any) => {
    console.log(`checkedValues`, checkedValues);
  };

  console.log(`rolesID.indexOf(1) > -1`, rolesID.indexOf(1) > -1);

  useEffect(() => {
    LoadDetail();
    getAccountRole();
    getRolesName();
  }, [accountId]);

  return (
    <>
      <Form {...formItemLayout} form={form} name="register" onFinish={handleEditProfile} scrollToFirstError>
        <Form.Item name="AccountId" label="AccountId">
          <Input disabled={true} />
          {/* <Input /> */}
        </Form.Item>
        <Form.Item name="DisplayName" label="DisplayName">
          <Input />
        </Form.Item>
        <Form.Item name="Email" label="Email">
          <Input />
        </Form.Item>
        <Form.Item name="Mobile" label="Mobile">
          <Input />
        </Form.Item>
        <Form.Item name="Address" label="Address">
          <Input />
        </Form.Item>
        <Form.Item name="Intro" label="Intro">
          <Input />
        </Form.Item>
        <Form.Item name="Right" label="Right">
          <Checkbox.Group>
            <Row>
              <Col xs={4}>
                <Checkbox value="5">Add Product</Checkbox>
              </Col>
              <Col xs={4}>
                <Checkbox checked={rolesID.indexOf(5) > -1} value="6">
                  Edit Product
                </Checkbox>
              </Col>
              <Col xs={4}>
                <Checkbox value="4">Delete Product</Checkbox>
              </Col>
              <Col xs={4}>
                <Checkbox value="3">Delete Account</Checkbox>
              </Col>
              <Col xs={4}>
                <Checkbox value="1" checked={rolesID.indexOf(1) > -1}>
                  All
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
            <Button htmlType="button" onClick={onCloseModal}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default ModalEditStaffInfo;
