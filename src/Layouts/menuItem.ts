import { MenuItemType } from '@paljs/ui/types';

const items: MenuItemType[] = [
  {
    title: 'Trang Chủ',
    icon: { name: 'home' },
    link: { href: '/dashboard' },
  },
  {
    title: 'Sản Phẩm (Product)',
    icon: { name: 'shopping-bag-outline' },
    children: [
      {
        title: 'Nhập mới',
        link: { href: '/' },
      },
      {
        title: 'Danh sách',
        link: { href: '/' },
      },
    ],
  },
  {
    title: 'Đăng Xuất',
    icon: { name: 'log-out-outline' },
    link: { href: '/logout' },
  },
];

export default items;
