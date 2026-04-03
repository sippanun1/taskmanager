import { Request, Response } from "express";
import prisma from "../utils/prisma";

// Helper to safely extract route params (Express v5 types params as string | string[])
function getParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0];
  return param || "";
}

// ==========================================
// POST /api/tasks — Create a new task
// ==========================================
export async function createTask(req: Request, res: Response): Promise<void> {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const userId = req.userId!; // Set by auth middleware (the ! tells TypeScript "I know this exists")

    // Title is required
    if (!title) {
      res.status(400).json({ error: "Title is required." });
      return;
    }

    // Validate status if provided (optional field)
    const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({ error: "Status must be TODO, IN_PROGRESS, or DONE." });
      return;
    }

    // Validate priority if provided
    const validPriorities = ["LOW", "MEDIUM", "HIGH"];
    if (priority && !validPriorities.includes(priority)) {
      res.status(400).json({ error: "Priority must be LOW, MEDIUM, or HIGH." });
      return;
    }

    // Create the task in the database, linked to the logged-in user
    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: status || "TODO",
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}

// ==========================================
// GET /api/tasks — Get all tasks for the logged-in user
// ==========================================
export async function getTasks(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId!;

    // Find all tasks belonging to this user, newest first
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}

// ==========================================
// GET /api/tasks/:id — Get a single task by ID
// ==========================================
export async function getTask(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    const taskId = parseInt(getParam(req.params.id));

    // parseInt returns NaN if the id is not a number
    if (isNaN(taskId)) {
      res.status(400).json({ error: "Invalid task ID." });
      return;
    }

    // Find the task — but ONLY if it belongs to this user
    // This prevents users from viewing other people's tasks
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found." });
      return;
    }

    res.json(task);
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}

// ==========================================
// PUT /api/tasks/:id — Update a task
// ==========================================
export async function updateTask(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    const taskId = parseInt(getParam(req.params.id));
    const { title, description, status, priority, dueDate } = req.body;

    if (isNaN(taskId)) {
      res.status(400).json({ error: "Invalid task ID." });
      return;
    }

    // Validate status if provided
    const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({ error: "Status must be TODO, IN_PROGRESS, or DONE." });
      return;
    }

    // Validate priority if provided
    const validPriorities = ["LOW", "MEDIUM", "HIGH"];
    if (priority && !validPriorities.includes(priority)) {
      res.status(400).json({ error: "Priority must be LOW, MEDIUM, or HIGH." });
      return;
    }

    // First check: does this task exist AND belong to this user?
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!existingTask) {
      res.status(404).json({ error: "Task not found." });
      return;
    }

    // Update only the fields that were provided
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title || existingTask.title,
        description: description !== undefined ? description : existingTask.description,
        status: status || existingTask.status,
        priority: priority || existingTask.priority,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : existingTask.dueDate,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}

// ==========================================
// DELETE /api/tasks/:id — Delete a task
// ==========================================
export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId!;
    const taskId = parseInt(getParam(req.params.id));

    if (isNaN(taskId)) {
      res.status(400).json({ error: "Invalid task ID." });
      return;
    }

    // Check: does this task exist AND belong to this user?
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!existingTask) {
      res.status(404).json({ error: "Task not found." });
      return;
    }

    // Delete it
    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}
