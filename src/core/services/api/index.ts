import { apiClient } from '../axiosInstance';
import { ENDPOINTS } from '../../constants/endpoint';

const { get, post, put } = apiClient;

export const login = (loginInfo: {}) => post(ENDPOINTS.LOGIN, loginInfo);
export const signUp = (signUpInfo: {}) => post(ENDPOINTS.SIGNUP, signUpInfo);
export const logOut = () => post(ENDPOINTS.LOGOUT);

export const ClassList = (params: object) => get(ENDPOINTS.CLASS_LIST, { params });
export const CreateClass = (params: object) => post(ENDPOINTS.CREATE_CLASS, { params });
