import { apiClient } from '../axiosInstance';
import { ENDPOINTS } from '../../constants/endpoint';

const { get, post } = apiClient;

export const ProductList = (page: number, record: number) => get(`${ENDPOINTS.PRODUCTS}?page=${page}&record=${record}`);
export const ProductDetail = (id: string) => get(`${ENDPOINTS.PRODUCTS}detail?id=${id}`);
