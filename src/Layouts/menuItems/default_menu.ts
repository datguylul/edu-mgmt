import { MenuItemType } from '@paljs/ui/types';

export const default_menu: MenuItemType[] = [
  {
    title: 'Trang Chủ',
    icon: { name: 'home' },
    link: { href: '/' },
  },
  {
    title: 'Đăng Xuất',
    icon: { name: 'log-out-outline' },
    link: { href: '/logout' },
  },
];
