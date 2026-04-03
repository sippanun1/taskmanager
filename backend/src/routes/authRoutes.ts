import { Router } from "express";
import { register, login } from "../controllers/authController";

// Create a mini-router for auth routes
// This keeps our routes organized — all auth routes start with /api/auth
const router = Router();

// POST /api/auth/register — Create a new account
router.post("/register", register);

// POST /api/auth/login — Log in and get a token
router.post("/login", login);

export default router;
