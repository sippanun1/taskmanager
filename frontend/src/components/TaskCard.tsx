import { useState } from "react";
import type { Task } from "../api";
import { tasksAPI } from "../api";

interface TaskCardProps {
  task: Task;
  onUpdate: () => void; // Refresh the task list after changes
}

export default function TaskCard({ task, onUpdate }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority || "MEDIUM");
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split("T")[0] : "");
  const [loading, setLoading] = useState(false);

  const statusColors: Record<string, string> = {
    TODO: "#e2e8f0",
    IN_PROGRESS: "#fed7aa",
    DONE: "#bbf7d0",
  };

  const priorityLabels: Record<string, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
  };

  const priorityColors: Record<string, string> = {
    LOW: "#94a3b8",
    MEDIUM: "#f59e0b",
    HIGH: "#ef4444",
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await tasksAPI.update(task.id, {
        title,
        description: description || null,
        status,
        priority,
        dueDate: dueDate || null,
      });
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error("Failed to update task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    setLoading(true);
    try {
      await tasksAPI.delete(task.id);
      onUpdate();
    } catch (err) {
      console.error("Failed to delete task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await tasksAPI.update(task.id, { status: newStatus as Task["status"] });
      onUpdate();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (isEditing) {
    return (
      <div className="task-card editing">
        <input
          className="task-edit-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />
        <textarea
          className="task-edit-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
        />
        <div className="task-edit-row">
          <select value={status} onChange={(e) => setStatus(e.target.value as Task["status"])}>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="task-edit-actions">
          <button className="btn btn-small btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button className="btn btn-small btn-secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-card" style={{ borderLeft: `4px solid ${priorityColors[task.priority || "MEDIUM"]}` }}>
      <div className="task-card-header">
        <h3 className={task.status === "DONE" ? "task-done" : ""}>{task.title}</h3>
        <div className="task-card-actions">
          <button className="btn-icon" onClick={() => setIsEditing(true)} title="Edit">
            &#9998;
          </button>
          <button className="btn-icon btn-icon-danger" onClick={handleDelete} title="Delete">
            &#10005;
          </button>
        </div>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-card-meta">
        <select
          className="status-select"
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          style={{ backgroundColor: statusColors[task.status] }}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>

        <span className="priority-badge" style={{ color: priorityColors[task.priority || "MEDIUM"] }}>
          {priorityLabels[task.priority || "MEDIUM"]}
        </span>

        {task.dueDate && (
          <span className="due-date">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
