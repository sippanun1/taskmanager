import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma";
import { generateToken } from "../utils/jwt";

// ==========================================
// POST /api/auth/register
// Creates a new user account
// ==========================================
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name } = req.body;

    // Validate input — make sure all fields are provided
    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, password, and name are required." });
      return;
    }

    // Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: "A user with this email already exists." });
      return;
    }

    // Hash the password before storing it
    // The "10" is the salt rounds — higher = more secure but slower
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate a JWT token for the new user
    const token = generateToken(user.id);

    // Send back the token and user info (but NEVER the password!)
    res.status(201).json({
      message: "User registered successfully!",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

// ==========================================
// POST /api/auth/login
// Authenticates a user and returns a token
// ==========================================
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If no user found, return error
    // (We say "Invalid credentials" instead of "User not found" for security —
    //  we don't want attackers to know which emails are registered)
    if (!user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    // Compare the provided password with the stored hash
    // bcrypt.compare handles the hashing internally
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    // Password is correct — generate a token
    const token = generateToken(user.id);

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
