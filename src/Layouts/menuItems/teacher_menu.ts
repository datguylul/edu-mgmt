import { MenuItemType } from '@paljs/ui/types';

export const teacher_menu: MenuItemType[] = [
  {
    title: 'Trang Chủ',
    icon: { name: 'home' },
    link: { href: '/teacher/dashboard' },
  },
  {
    title: 'Bài tập',
    icon: { name: 'book-outline' },
    link: { href: '/teacher/homework' },
  },
  {
    title: 'Danh sách lớp/Học sinh',
    icon: { name: 'people-outline' },
    children: [
      {
        title: 'Lớp',
        link: { href: '/teacher/class' },
      },
      {
        title: 'Học sinh',
        link: { href: '/teacher/student' },
      },
    ],
  },
  {
    title: 'Ngân hàng đề thi',
    icon: { name: 'folder-outline' },
    link: { href: '/teacher/testbank' },
  },
  {
    title: 'Đăng Xuất',
    icon: { name: 'log-out-outline' },
    link: { href: '/logout' },
  },
];
