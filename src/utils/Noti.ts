import { notification } from 'antd';

export const openNotification = (Title: string, Content?: string, onNotiClick?: Function | undefined) => {
  notification.open({
    message: Title,
    description: Content,
    onClick: onNotiClick ? onNotiClick() : () => null,
    placement: 'bottomRight',
  });
};
