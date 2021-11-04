export const CONTEXT = {
  API: 'api',
  STATIC: 'static',
  ADMIN: 'admin',
};

export const CONTROLLERS = {
  ACCOUNTS: 'accounts',
  PRODUCTS: 'products',
  ROLE: 'role',
};

export const ENDPOINTS = {
  LOGIN: `${CONTEXT.API}/${CONTROLLERS.ACCOUNTS}/login`,
  SIGNUP: `${CONTEXT.API}/${CONTROLLERS.ACCOUNTS}/signup`,
  PRODUCTS: `${CONTEXT.API}/${CONTROLLERS.PRODUCTS}/`,
  LISTS: `${CONTEXT.ADMIN}/${CONTROLLERS.ROLE}/list`,
};
