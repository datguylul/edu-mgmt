import { apiClient } from '../axiosInstance';
import { ENDPOINTS } from '../../constants/endpoint';

const { get, post } = apiClient;

export const getListStaff = () => get(ENDPOINTS.ACCOUNTS);
export const addStaff = (params: object) => post(ENDPOINTS.ACCOUNTS, params);
export const getStaffDetail = (id: string) => get(`${ENDPOINTS.ACCOUNTS}/${id}`);
export const editStaffDetail = (params: {}) => post(`${ENDPOINTS.ACCOUNTS}/edit_account`, params);
export const deleteStaff = (id: string) => apiClient.delete(`${ENDPOINTS.ACCOUNTS}/${id}`);
