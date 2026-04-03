const TaskTableView = ({
  tasks = [],
  editingId,
  editData,
  handleEditClick,
  handleEditChange,
  handleSave,
  handleCancel,
  handleDelete,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Task List</h2>

      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Reported To</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) =>
            editingId === task.task_id ? (
              <tr key={task.task_id} className="border-t bg-yellow-50">
                <td className="p-2">
                  <input
                    name="title"
                    value={editData.title}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td>
                  <input
                    name="description"
                    value={editData.description}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td>
                  <select
                    name="status"
                    value={editData.status}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="todo">Todo</option>
                    <option value="progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </td>
                <td>
                  <input
                    name="reported_to"
                    value={editData.reported_to}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="text-center space-x-2">
                  <button
                    onClick={() => handleSave(task.task_id)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-400 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={task.task_id} className="border-t">
                <td className="p-2 text-center">{task.title}</td>
                <td className="text-center">{task.description}</td>
                <td className="text-center">{task.status}</td>
                <td className="text-center">{task.reported_to}</td>
                <td className="text-center space-x-2">
                  <button
                    onClick={() => handleEditClick(task)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(task.task_id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTableView;