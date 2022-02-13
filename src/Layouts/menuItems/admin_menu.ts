import { MenuItemType } from '@paljs/ui/types';

export const admin_menu: MenuItemType[] = [
  {
    title: 'Trang Chủ',
    icon: { name: 'home' },
    link: { href: '/admin/dashboard' },
  },
  {
    title: 'Bài tập',
    icon: { name: 'book-outline' },
    link: { href: '/admin/homework' },
  },
  {
    title: 'Danh sách lớp/Học sinh',
    icon: { name: 'people-outline' },
    children: [
      {
        title: 'Lớp',
        link: { href: '/admin/class' },
      },
      {
        title: 'Học sinh',
        link: { href: '/admin/student' },
      },
    ],
  },
  {
    title: 'Ngân hàng đề thi',
    icon: { name: 'folder-outline' },
    link: { href: '/admin/testbank' },
  },
  {
    title: 'Đăng Xuất',
    icon: { name: 'log-out-outline' },
    link: { href: '/logout' },
  },
];
