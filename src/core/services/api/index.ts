import { apiClient } from '../axiosInstance';
import { ENDPOINTS } from '../../constants/endpoint';

const { get, post, put } = apiClient;

export const login = (loginInfo: {}) => post(ENDPOINTS.LOGIN, loginInfo);
export const signUp = (signUpInfo: {}) => post(ENDPOINTS.SIGNUP, signUpInfo);
export const logOut = () => post(ENDPOINTS.LOGOUT);

export const ProductList = (params: object) => get(ENDPOINTS.PRODUCTS, { params });
export const ProductDetail = (id: string) => get(`${ENDPOINTS.PRODUCTS}/detail?id=${id}`);
export const ProductUpdate = (params: {}) => post(`${ENDPOINTS.PRODUCTS}/edit`, params);
export const ProductAdd = (params: {}) => post(ENDPOINTS.PRODUCTS, params);
export const DeleteProduct = (id: string) => apiClient.delete(`${ENDPOINTS.PRODUCTS}/${id}`);
