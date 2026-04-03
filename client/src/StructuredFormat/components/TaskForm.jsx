import { useTaskForm } from "../hooks/UseTaskForm";
import TaskFormView from "../pages/TaskformView";
import { createTaskAPI } from "../services/TaskService";

const TaskForm = () => {
  const formProps = useTaskForm();
  return <TaskFormView {...formProps} />;
};

export default TaskForm;