export const CONTEXT = {
  API: 'api',
  STATIC: 'static',
  ADMIN: 'admin',
};

export const CONTROLLERS = {
  USER: 'user',
  CLASS: 'class',
  STUDENT: 'student',
  TEACHER: 'teacher',
  SCHOOL_YEAR: 'school-year',
};

export const ENDPOINTS = {
  LOGIN: `${CONTEXT.API}\\${CONTROLLERS.USER}/login`,

  USER: `${CONTEXT.API}\\${CONTROLLERS.USER}`,
  TEACHER: `${CONTEXT.API}\\${CONTROLLERS.TEACHER}`,
  CLASS: `${CONTEXT.API}\\${CONTROLLERS.CLASS}`,
  STUDENT: `${CONTEXT.API}\\${CONTROLLERS.STUDENT}`,
  SCHOOL_YEAR: `${CONTEXT.API}\\${CONTROLLERS.SCHOOL_YEAR}`,
};
