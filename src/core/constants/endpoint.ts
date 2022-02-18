export const CONTEXT = {
  API: 'api',
  STATIC: 'static',
  ADMIN: 'admin',
};

export const CONTROLLERS = {
  ACCOUNTS: 'accounts',
  PRODUCTS: 'products',
  ROLE: 'roles',
  LOG: 'logging',
  ORDER: 'order',
  CATEGORY: 'category',
};

export const ENDPOINTS = {
  LOGIN: `login`,
  SIGNUP: `signup`,
  LOGOUT: `logout`,

  PRODUCTS: `${CONTEXT.API}/${CONTROLLERS.PRODUCTS}`,
  PRODUCTS_EDIT: `${CONTEXT.API}/${CONTROLLERS.PRODUCTS}/edit`,
  LISTS: `${CONTEXT.ADMIN}/${CONTROLLERS.ROLE}/list`,
  LOGING: `${CONTEXT.API}/${CONTROLLERS.LOG}/paging`,
  ORDER: `${CONTEXT.API}/${CONTROLLERS.ORDER}`,
  ROLES: `${CONTEXT.API}/${CONTROLLERS.ROLE}`,
  CATEGORY: `${CONTEXT.API}/${CONTROLLERS.CATEGORY}`,
};
