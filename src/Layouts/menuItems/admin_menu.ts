import { MenuItemType } from '@paljs/ui/types';

export const admin_menu: MenuItemType[] = [
  {
    title: 'Trang Chủ',
    icon: { name: 'home' },
    link: { href: '/admin/dashboard' },
  },
  {
    title: 'Năm học',
    icon: { name: 'folder-outline' },
    link: { href: '/admin/school-year' },
  },
  {
    title: 'Lớp',
    icon: { name: 'folder-outline' },
    link: { href: '/admin/class' },
  },
  {
    title: 'Học sinh',
    icon: { name: 'folder-outline' },
    link: { href: '/admin/student' },
  },
  {
    title: 'Giáo viên',
    icon: { name: 'folder-outline' },
    link: { href: '/admin/teacher' },
  },
  {
    title: 'Tài khoản người dùng',
    icon: { name: 'folder-outline' },
    link: { href: '/admin/user' },
  },
  {
    title: 'Đăng Xuất',
    icon: { name: 'log-out-outline' },
    link: { href: '/logout' },
  },
];
