import { apiClient } from '../axiosInstance';
import { ENDPOINTS } from '../../constants/endpoint';

const { get, post, put } = apiClient;

export const login = (loginInfo: {}) => post(ENDPOINTS.LOGIN, loginInfo);
export const signUp = (signUpInfo: {}) => post(ENDPOINTS.SIGN_UP, signUpInfo);
// export const logOut = () => post(ENDPOINTS.LOGOUT);

export const ClassList = (search: string, classStatus: number, page: number, record: number) =>
  get(ENDPOINTS.CLASS + `?search=${search}&classStatus=${classStatus}&page=${page}&record=${record}`);
export const ClassListWithHomeWork = (search: string, classStatus: number, page: number, record: number) =>
  get(ENDPOINTS.CLASS + '\\homework' + `?search=${search}&classStatus=${classStatus}&page=${page}&record=${record}`);
export const ClassDetail = (id: string) => get(ENDPOINTS.CLASS + `\\detail\\${id}`);
export const CreateClass = (params: object) => post(ENDPOINTS.CLASS, params);
export const EditClass = (id: string, params: object) => put(ENDPOINTS.CLASS + `\\edit\\${id}`, params);
export const ClassAddStudent = (params: object) => post(ENDPOINTS.CLASS_ADD_STUDENT, params);
export const ClassFindStudent = (params: object) => post(ENDPOINTS.CLASS_FIND_STUDENT, params);
export const ClassEditStatus = (params: object) => put(ENDPOINTS.CLASS_EDIT_STATUS, params);
export const ClassEditStudent = (id: string, params: object) => put(ENDPOINTS.CLASS_EDIT_STUDENT + `\\${id}`, params);
export const ClassRemoveStudent = (params: object) => put(ENDPOINTS.CLASS_REMOVE_STUDENT, params);

export const StudentList = (search: string, sort: string, page: number, record: number) =>
  get(ENDPOINTS.STUDENT + `?search=${search}&sort=${sort}&page=${page}&record=${record}`);
export const StudentDetail = (id: string) => get(ENDPOINTS.STUDENT + `\\detail\\${id}`);
export const StudentDetailPhone = (phone: string) => get(ENDPOINTS.STUDENT + `\\detail-phone\\${phone}`);
export const CreateStudent = (params: object) => post(ENDPOINTS.STUDENT, params);
export const EditStudent = (id: string, params: object) => put(ENDPOINTS.STUDENT + `\\edit\\${id}`, params);
export const StudentReadExcel = (params: FormData) => post(ENDPOINTS.STUDENT_READ_EXCEL, params);

export const TeacherList = (search: string, sort: string, page: number, record: number) =>
  get(ENDPOINTS.TEACHER + `?search=${search}&sort=${sort}&page=${page}&record=${record}`);
export const TeacherDetail = (id: string) => get(ENDPOINTS.TEACHER + `\\detail\\${id}`);
export const CreateTeacher = (params: object) => post(ENDPOINTS.TEACHER, params);
export const EditTeacher = (id: string, params: object) => put(ENDPOINTS.TEACHER + `\\edit\\${id}`, params);

export const UserList = (search: string, sort: string, page: number, record: number) =>
  get(ENDPOINTS.USER + `?search=${search}&sort=${sort}&page=${page}&record=${record}`);
export const UserDetail = (id: string) => get(ENDPOINTS.USER + `\\detail\\${id}`);
export const UserDetailNonId = () => get(ENDPOINTS.USER + `\\detail`);
export const CreateUser = (params: object) => post(ENDPOINTS.USER + 'create-user', params);

export const HomeWorkList = (search: string, sort: string, page: number, record: number) =>
  get(ENDPOINTS.HOME_WORK + `?search=${search}&sort=${sort}&page=${page}&record=${record}`);
export const HomeWorkListByClass = (classId: string, HomeWorkStatus: number, page: number, record: number) =>
  get(ENDPOINTS.HOME_WORK + `\\by-class\\${classId}` + `?page=${page}&status=${HomeWorkStatus}&record=${record}`);
export const HomeWorkDetail = (id: string) => get(ENDPOINTS.HOME_WORK + `\\detail\\${id}`);
export const CreateHomeWork = (params: object) => post(ENDPOINTS.HOME_WORK + '\\create', params);
export const HomeWorkEditStatus = (params: object) => put(ENDPOINTS.HOMEWORK_EDIT_STATUS, params);
export const HomeWorkEdit = (id: string, params: object) => put(ENDPOINTS.HOME_WORK + `\\edit\\${id}`, params);
export const HomeWorkCheck = (params: object) => post(ENDPOINTS.HOMEWORK_CHECK, params);

export const FileDetail = (id: string) => get(ENDPOINTS.FILE + `\\detail\\${id}`);

export const AnswerList = (homeWorkId: string, classId?: string) => {
  let url = ENDPOINTS.ANSWER + `/by-homework/${homeWorkId}`;
  if (classId) {
    url = url + `?classId=${classId}`;
  }
  return get(url);
};
export const AnswerSubmit = (params: object) => post(ENDPOINTS.ANSWER_SUBMIT, params);
export const AnswerDetail = (id: string) => get(ENDPOINTS.ANSWER + `\\detail\\${id}`);

export const ResultSubmit = (params: object) => post(ENDPOINTS.RESULT, params);
export const ResultEdit = (id: string, params: object) => put(ENDPOINTS.RESULT + `\\edit\\${id}`, params);
