import { apiClient } from '../axiosInstance';
import { ENDPOINTS } from '../../constants/endpoint';

const { get, post, put } = apiClient;

export const ProductList = (page: number, record: number) => get(`${ENDPOINTS.PRODUCTS}?page=${page}&record=${record}`);
export const ProductDetail = (id: string) => get(`${ENDPOINTS.PRODUCTS}detail?id=${id}`);
export const ProductUpdate = (params: {}) => post(ENDPOINTS.PRODUCTS_EDIT, params);
export const ProductAdd = (params: {}) => post(ENDPOINTS.PRODUCTS, params);
export const DeleteProduct = (id: string) => apiClient.delete(`${ENDPOINTS.PRODUCTS}${id}`);
