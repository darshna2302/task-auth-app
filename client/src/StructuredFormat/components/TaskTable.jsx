import { toast } from "react-toastify";
import { useTasks } from "../hooks/TaskTableHook";
import { useTaskTable } from "../hooks/UseTaskTable";
import TaskTableView from "../pages/TaskTableView";

const TaskTable = () => {
  const { tasks, deleteTask, updateTask, loading } = useTasks();

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      toast.success("Task deleted successfully");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateTask(id, data);
      toast.success("Task updated successfully");
    } catch {
      toast.error("Failed to update task");
    }
  };

  const tableProps = useTaskTable(handleDelete, handleUpdate);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading tasks...</p>;
  }

  return <TaskTableView tasks={tasks} {...tableProps} />;
};

export default TaskTable;