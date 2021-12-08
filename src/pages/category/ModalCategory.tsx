import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Checkbox, Row, Col, Form, Input, Button, Space, notification } from 'antd';
import { CategoryAdd, CategoryDetail, CategoryUpdate } from '@core/services/product';
import { string_to_slug } from '@utils/StringUtil';
import { openNotification } from '@utils/Noti';

interface IStaffInfo {
  categoryId?: string;
  onCloseModal?: () => void;
  onSubmitAndReload?: () => void;
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
const ModalEditStaffInfo: React.FC<IStaffInfo> = ({ categoryId, onCloseModal, onSubmitAndReload }) => {
  const [form] = Form.useForm();

  const LoadDetail = () => {
    CategoryDetail(categoryId!)
      .then((resp) => {
        const data = resp.data.Data?.category;
        if (data) {
          fillForm(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fillForm = (data: any) => {
    form.setFieldsValue({
      CategoryCode: data?.CategoryCode,
      Title: data?.Title,
      Slug: data?.Slug,
      Content: data.Content,
      CategoryId: data.CategoryId,
    });
  };

  const handleSubmit = (values: any) => {
    if (categoryId && categoryId !== '') {
      CategoryUpdate(values)
        .then((resp) => {
          if (resp.data.Success) {
            openNotification('Cập nhật phân loại', 'Cập nhật phân loại thành công');
          } else {
            openNotification('Cập nhật phân loại', resp.data.Message);
          }
        })
        .catch((error) => {
          console.log('error', error);
          openNotification('Cập nhật phân loại', 'Cập nhật phân loại thất bại');
        });
    } else {
      CategoryAdd(values)
        .then((resp) => {
          if (resp.data.Success) {
            openNotification('Thêm mới phân loại', 'Thêm mới phân loại thành công');
          } else {
            openNotification('Thêm mới phân loại', resp.data.Message);
          }
        })
        .catch((error) => {
          console.log('error', error);
          openNotification('Thêm mới phân loại', 'Thêm mới phân loại thất bại');
        });
    }
  };

  // const openNotification = (Title: string, Content: string) => {
  //   notification.open({
  //     message: Title,
  //     description: Content,
  //     onClick: () => {},
  //     placement: 'bottomRight',
  //   });
  // };

  const handleTitleChange = ({ target }: any) => {
    form.setFieldsValue({
      Slug: string_to_slug(target.value),
    });
  };

  useEffect(() => {
    if (categoryId && categoryId !== '') {
      LoadDetail();
    }
  }, [categoryId]);

  return (
    <>
      <Form {...formItemLayout} form={form} name="register" onFinish={handleSubmit} scrollToFirstError>
        {categoryId && categoryId !== '' && (
          <Form.Item name="CategoryId" label="ID" preserve>
            <Input disabled={true} />
          </Form.Item>
        )}
        <Form.Item name="CategoryCode" label="Mã phân loại">
          <Input />
        </Form.Item>
        <Form.Item name="Title" label="Tên phân loại">
          <Input onChange={handleTitleChange} />
        </Form.Item>
        <Form.Item name="Slug" label="Link hiển thị" preserve>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="Content" label="Nội dung">
          <Input />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              {categoryId && categoryId !== '' ? 'Cập nhật' : 'Thêm mới'}
            </Button>
            <Button htmlType="button" onClick={onCloseModal}>
              Hủy
            </Button>
            {categoryId && categoryId !== '' && (
              <Button type="ghost" htmlType="button" onClick={onCloseModal}>
                Xóa
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default ModalEditStaffInfo;
