import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController";

const router = Router();

// ALL task routes are protected — authenticate middleware runs first
// This means every request must have a valid JWT token in the Authorization header

router.post("/", authenticate, createTask);       // POST   /api/tasks
router.get("/", authenticate, getTasks);           // GET    /api/tasks
router.get("/:id", authenticate, getTask);         // GET    /api/tasks/3
router.put("/:id", authenticate, updateTask);      // PUT    /api/tasks/3
router.delete("/:id", authenticate, deleteTask);   // DELETE /api/tasks/3

export default router;
