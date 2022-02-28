export const CONTEXT = {
  API: 'api',
  STATIC: 'static',
  ADMIN: 'admin',
};

export const CONTROLLERS = {
  CLASS: 'manage-clazz',
  STUDENT: 'manage-student',
};

export const ENDPOINTS = {
  LOGIN: `login`,
  SIGNUP: `signup`,
  LOGOUT: `logout`,

  STUDENT_LIST: `${CONTROLLERS.STUDENT}/list`,
  CLASS_LIST: `${CONTROLLERS.CLASS}/list`,
  CREATE_CLASS: `${CONTROLLERS.CLASS}/create`,
};
