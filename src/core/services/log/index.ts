import { apiClient } from '../axiosInstance';
import { ENDPOINTS } from '../../constants/endpoint';

const { get, post, put } = apiClient;

export const LogList = (page: number, record: number) => get(`${ENDPOINTS.LOGING}?page=${page}&record=${record}`);
