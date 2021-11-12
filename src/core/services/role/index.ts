import { apiClient } from '../axiosInstance';
import { ENDPOINTS } from '../../constants/endpoint';

const { get, post } = apiClient;

export const getRoleName = () => get(`${ENDPOINTS.ROLES}`);
export const getRole = (id: string) => get(`${ENDPOINTS.ROLES}/roles_account?id=${id}`);
export const editRole = (params: {}) => post(`${ENDPOINTS.ROLES}/edit_role`, params);
