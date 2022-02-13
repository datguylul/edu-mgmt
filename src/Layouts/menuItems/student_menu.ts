import { MenuItemType } from '@paljs/ui/types';

export const student_menu: MenuItemType[] = [
  {
    title: 'Trang Chủ',
    icon: { name: 'home' },
    link: { href: '/student/dashboard' },
  },
  {
    title: 'Bài tập',
    icon: { name: 'book-outline' },
    link: { href: '/student/homework' },
  },
  {
    title: 'Đăng Xuất',
    icon: { name: 'log-out-outline' },
    link: { href: '/logout' },
  },
];
