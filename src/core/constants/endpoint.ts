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
};

export const ENDPOINTS = {
  ACCOUNTS: `${CONTEXT.API}/${CONTROLLERS.ACCOUNTS}`,
  LOGIN: `${CONTEXT.API}/${CONTROLLERS.ACCOUNTS}/login`,
  LOGOUT: `${CONTEXT.API}/${CONTROLLERS.ACCOUNTS}/logout`,

  SIGNUP: `${CONTEXT.API}/${CONTROLLERS.ACCOUNTS}`,
  PRODUCTS: `${CONTEXT.API}/${CONTROLLERS.PRODUCTS}/`,
  PRODUCTS_EDIT: `${CONTEXT.API}/${CONTROLLERS.PRODUCTS}/edit`,
  LISTS: `${CONTEXT.ADMIN}/${CONTROLLERS.ROLE}/list`,
  LOGING: `${CONTEXT.API}/${CONTROLLERS.LOG}/paging`,
  ORDER: `${CONTEXT.API}/${CONTROLLERS.ORDER}/`,
  ROLES: `${CONTEXT.API}/${CONTROLLERS.ROLE}`,
};
