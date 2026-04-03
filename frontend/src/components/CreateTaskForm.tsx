import { useState } from "react";
import { tasksAPI } from "../api";

interface CreateTaskFormProps {
  onCreated: () => void;
}

export default function CreateTaskForm({ onCreated }: CreateTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError("");

    try {
      await tasksAPI.create({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
      });
      // Reset form
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setDueDate("");
      setIsOpen(false);
      onCreated();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button className="btn btn-primary create-task-btn" onClick={() => setIsOpen(true)}>
        + New Task
      </button>
    );
  }

  return (
    <div className="create-task-form">
      <h3>Create New Task</h3>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            rows={2}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Task"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
