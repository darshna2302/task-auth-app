const TaskFormView = ({ task, handleChange, handleSubmit }) => {
  return (
    <div className="flex items-center justify-center px-6 sm:px-0 mb-8">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-[500px] text-indigo-300 text-sm"
      >
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          Create Task
        </h2>

        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <input
            name="title"
            value={task.title}
            onChange={handleChange}
            placeholder="Task Title"
            required
            className="bg-transparent outline-none w-full"
          />
        </div>

        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <input
            name="reported_to"
            value={task.reported_to}
            onChange={handleChange}
            placeholder="Reported To"
            required
            className="bg-transparent outline-none w-full"
          />
        </div>

        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className="bg-transparent outline-none w-full"
          >
            <option value="todo" className="bg-[#0B1736]">Todo</option>
            <option value="progress" className="bg-[#0B1736]">In Progress</option>
            <option value="done" className="bg-[#0B1736]">Done</option>
          </select>
        </div>

        <div className="mb-6 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <input
            name="description"
            value={task.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="bg-transparent outline-none w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-900 text-white py-2.5 rounded-full hover:opacity-90 transition duration-300"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskFormView;