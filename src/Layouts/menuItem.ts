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
    link: { href: '/staff' },
  },
  {
    title: 'Log',
    icon: { name: 'file-text-outline' },
    link: { href: '/log' },
  },
  // {
  //   title: 'Sys Config (Dev)',
  //   icon: { name: 'options-2-outline' },
  //   link: { href: '/config' },
  // },
  {
    title: 'Đăng Xuất',
    icon: { name: 'log-out-outline' },
    link: { href: '/logout' },
  },
  // {
  //   title: 'FEATURES',
  //   group: true,
  // },
  // {
  //   title: 'Extra Components',
  //   icon: { name: 'star-outline' },
  //   children: [
  //     {
  //       title: 'Accordion',
  //       link: { href: '/extra-components/accordion' },
  //     },
  //     {
  //       title: 'Actions',
  //       link: { href: '/extra-components/actions' },
  //     },
  //     {
  //       title: 'Alert',
  //       link: { href: '/extra-components/alert' },
  //     },
  //     {
  //       title: 'List',
  //       link: { href: '/extra-components/list' },
  //     },
  //     {
  //       title: 'Spinner',
  //       link: { href: '/extra-components/spinner' },
  //     },
  //     {
  //       title: 'Progress Bar',
  //       link: { href: '/extra-components/progress' },
  //     },
  //     {
  //       title: 'Tabs',
  //       link: { href: '/extra-components/tabs' },
  //     },
  //     {
  //       title: 'Chat',
  //       link: { href: '/extra-components/chat' },
  //     },
  //     {
  //       title: 'Cards',
  //       link: { href: '/extra-components/cards' },
  //     },
  //     {
  //       title: 'Flip Card',
  //       link: { href: '/extra-components/flip-card' },
  //     },
  //     {
  //       title: 'Reveal Card',
  //       link: { href: '/extra-components/reveal-card' },
  //     },
  //   ],
  // },
  // {
  //   title: 'Forms',
  //   icon: { name: 'edit-2-outline' },
  //   children: [
  //     {
  //       title: 'Inputs',
  //       link: { href: '/forms/inputs' },
  //     },
  //     {
  //       title: 'Layout',
  //       link: { href: '/forms/form-layout' },
  //     },
  //     {
  //       title: 'Buttons',
  //       link: { href: '/forms/buttons' },
  //     },
  //     {
  //       title: 'Select',
  //       link: { href: '/forms/select' },
  //     },
  //   ],
  // },
  // {
  //   title: 'UI Features',
  //   icon: { name: 'keypad-outline' },
  //   children: [
  //     {
  //       title: 'Grid',
  //       link: { href: '/ui-features/grid' },
  //     },
  //     {
  //       title: 'Animated Searches',
  //       link: { href: '/ui-features/search' },
  //     },
  //   ],
  // },
  // {
  //   title: 'Modal & Overlays',
  //   icon: { name: 'browser-outline' },
  //   children: [
  //     {
  //       title: 'Popover',
  //       link: { href: '/modal-overlays/popover' },
  //     },
  //     {
  //       title: 'Tooltip',
  //       link: { href: '/modal-overlays/tooltip' },
  //     },
  //     {
  //       title: 'Toastr',
  //       link: { href: '/modal-overlays/toastr' },
  //     },
  //   ],
  // },
  // {
  //   title: 'Editors',
  //   icon: { name: 'text-outline' },
  //   children: [
  //     {
  //       title: 'TinyMCE',
  //       link: { href: '/editors/tinymce' },
  //     },
  //     {
  //       title: 'CKEditor',
  //       link: { href: '/editors/ckeditor' },
  //     },
  //   ],
  // },
  // {
  //   title: 'Miscellaneous',
  //   icon: { name: 'shuffle-2-outline' },
  //   children: [
  //     {
  //       title: '404',
  //       link: { href: '/miscellaneous/404' },
  //     },
  //   ],
  // },
  // {
  //   title: 'Auth',
  //   icon: { name: 'lock-outline' },
  //   children: [
  //     {
  //       title: 'Login',
  //       link: { href: '/auth/login' },
  //     },
  //     {
  //       title: 'Register',
  //       link: { href: '/auth/register' },
  //     },
  //     {
  //       title: 'Request Password',
  //       link: { href: '/auth/request-password' },
  //     },
  //     {
  //       title: 'Reset Password',
  //       link: { href: '/auth/reset-password' },
  //     },
  //   ],
  // },
];

export default items;
