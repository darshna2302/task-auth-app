import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const createTaskAPI = (data) => {
  return axios.post(`${backendUrl}/api/auth/create-user-task`, data, {
    withCredentials: true,
  });
};

export const fetchTasksAPI = () => {
  return axios.get(`${backendUrl}/api/auth/get-user-task`, {
    withCredentials: true,
  });
};

export const deleteTaskAPI = (task_id) => {
  return axios.delete(`${backendUrl}/api/auth/delete-user-task/`, {data:{task_id}},{
    withCredentials: true,
  });
};

export const updateTaskAPI = ( task_id,data) => {
  return axios.put(`${backendUrl}/api/auth/update-user-task/`, {...data,task_id}, {
    withCredentials: true,
  });
};