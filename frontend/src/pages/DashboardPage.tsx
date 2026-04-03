import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import type { Task } from "../api";
import { tasksAPI } from "../api";
import TaskCard from "../components/TaskCard";
import CreateTaskForm from "../components/CreateTaskForm";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await tasksAPI.getAll();
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Filter tasks by status and search query
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === "ALL" || task.status === filter;
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Group tasks by status for the board view
  const columns = {
    TODO: filteredTasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: filteredTasks.filter((t) => t.status === "IN_PROGRESS"),
    DONE: filteredTasks.filter((t) => t.status === "DONE"),
  };

  const columnLabels: Record<string, string> = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
  };

  const columnColors: Record<string, string> = {
    TODO: "#3b82f6",
    IN_PROGRESS: "#f59e0b",
    DONE: "#22c55e",
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>TaskBoard</h1>
          <span className="welcome">Hello, {user?.name}!</span>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Log Out
        </button>
      </header>

      {/* Toolbar: Search + Filter + Create */}
      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All ({tasks.length})</option>
          <option value="TODO">To Do ({tasks.filter((t) => t.status === "TODO").length})</option>
          <option value="IN_PROGRESS">In Progress ({tasks.filter((t) => t.status === "IN_PROGRESS").length})</option>
          <option value="DONE">Done ({tasks.filter((t) => t.status === "DONE").length})</option>
        </select>
        <CreateTaskForm onCreated={fetchTasks} />
      </div>

      {/* Board View — 3 columns like Trello */}
      <div className="board">
        {(["TODO", "IN_PROGRESS", "DONE"] as const).map((status) => (
          <div className="board-column" key={status}>
            <div className="column-header" style={{ borderBottom: `3px solid ${columnColors[status]}` }}>
              <h2>{columnLabels[status]}</h2>
              <span className="column-count">{columns[status].length}</span>
            </div>
            <div className="column-tasks">
              {columns[status].length === 0 ? (
                <p className="empty-column">No tasks</p>
              ) : (
                columns[status].map((task) => (
                  <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
