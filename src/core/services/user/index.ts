import { apiClient } from '../axiosInstance';
import { ENDPOINTS } from '../../constants/endpoint';

const { post } = apiClient;

export const login = (loginInfo: {}) => post(ENDPOINTS.LOGIN, loginInfo);
export const signUp = (signUpInfo: {}) => post(ENDPOINTS.LOGIN, signUpInfo);
export const logOut = () => post(ENDPOINTS.LOGOUT);
