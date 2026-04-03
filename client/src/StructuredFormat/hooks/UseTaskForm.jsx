import { useState } from "react";
import { toast } from "react-toastify";
import { createTaskAPI } from "../services/TaskService";

const INITIAL_STATE = {
  title: "",
  description: "",
  status: "todo",
  reported_to: "",
};

export const useTaskForm = () => {
  const [task, setTask] = useState(INITIAL_STATE);

  const handleChange = (e) => {
    setTask((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createTaskAPI(task);
      toast.success(data?.message || "Task created successfully");
      setTask(INITIAL_STATE);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create task");
    }
  };

  return {
    task,
    handleChange,
    handleSubmit,
  };
};