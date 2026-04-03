import { useState, useEffect } from "react";
import {
  fetchTasksAPI,
  createTaskAPI,
  deleteTaskAPI,
  updateTaskAPI,
} from "../services/TaskService";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await fetchTasksAPI();
      setTasks(data.message || []);
    } catch (err) {
      console.error("Fetch error", err);
    }
    setLoading(false);
  };

  const createTask = async (task) => {
    const { data } = await createTaskAPI(task);
    fetchTasks();
    return data;
  };

  const deleteTask = async (task_id) => {
    await deleteTaskAPI(task_id);      // sends { task_id } in req.body
    fetchTasks();
  };

  const updateTask = async (task_id, taskData) => {
    await updateTaskAPI(task_id, taskData);  // sends { ...taskData, task_id } in req.body
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    fetchTasks,
    createTask,
    deleteTask,
    updateTask,
  };
};