import { notification } from 'antd';

export const openNotification = (
  Title: string,
  Content?: string,
  type: any = 'info',
  onNotiClick?: Function | undefined,
) => {
  notification[type]({
    message: Title,
    description: Content,
    onClick: onNotiClick ? onNotiClick() : () => null,
    placement: 'bottomRight',
  });
};
