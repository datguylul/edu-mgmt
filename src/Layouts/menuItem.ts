import { MenuItemType } from '@paljs/ui/types';

const items: MenuItemType[] = [
  {
    title: 'Trang Chủ',
    icon: { name: 'home' },
    link: { href: '/dashboard' },
  },
  {
    title: 'Phân Loại (Category)',
    icon: { name: 'pricetags-outline' },
    link: { href: '/category' },
  },
  {
    title: 'Sản Phẩm (Product)',
    icon: { name: 'shopping-bag-outline' },
    children: [
      {
        title: 'Nhập mới',
        link: { href: '/product/product-create' },
      },
      {
        title: 'Danh sách',
        link: { href: '/product' },
      },
    ],
  },
  {
    title: 'Đơn Hàng (Order)',
    icon: { name: 'shopping-cart-outline' },
    children: [
      {
        title: 'Tạo mới',
        link: { href: '/order/order-create' },
      },
      {
        title: 'Danh sách',
        link: { href: '/order' },
      },
    ],
  },
  {
    title: 'Nhân Viên',
    icon: { name: 'person-outline' },
    children: [
      {
        title: 'Danh sách nhân viên',
        link: { href: '/staff' },
      },
      {
        title: 'Quyền nhân viên (Role)',
        link: { href: '/role' },
      },
    ],
  },
  {
    title: 'Log',
    icon: { name: 'book-outline' },
    link: { href: '/log' },
  },
  {
    title: 'Đăng Xuất',
    icon: { name: 'log-out-outline' },
    link: { href: '/logout' },
  },
];

export default items;
