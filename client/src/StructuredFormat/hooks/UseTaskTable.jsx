import { useState } from "react";

export const useTaskTable = (deleteTask, updateTask) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (task) => {
    setEditingId(task.task_id);
    setEditData({
      title: task.title,
      description: task.description,
      status: task.status,
      reported_to: task.reported_to,
    });
  };

  const handleEditChange = (e) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (task_id) => {
    await updateTask(task_id, editData);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = async (task_id) => {
    await deleteTask(task_id);
  };

  return {
    editingId,
    editData,
    handleEditClick,
    handleEditChange,
    handleSave,
    handleCancel,
    handleDelete,
  };
};