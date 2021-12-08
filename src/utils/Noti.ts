import { notification } from 'antd';

export const openNotification = (Title: string, Content: string) => {
  notification.open({
    message: Title,
    description: Content,
    onClick: () => {},
    placement: 'bottomRight',
  });
};
