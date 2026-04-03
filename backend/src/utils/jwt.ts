import jwt from "jsonwebtoken";

// Get the secret key from .env
// This secret is used to SIGN tokens — only our server knows it
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

// Create a token for a user (called after register/login)
// The token contains the userId — so we can identify who sent a request later
export function generateToken(userId: number): string {
  return jwt.sign(
    { userId },        // Payload: data stored inside the token
    JWT_SECRET,        // Secret key: used to sign (like a stamp of authenticity)
    { expiresIn: "7d" } // Token expires in 7 days (user must log in again after that)
  );
}

// Verify a token and extract the userId from it
// Returns the userId if valid, or null if the token is fake/expired
export function verifyToken(token: string): { userId: number } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded;
  } catch {
    return null; // Token is invalid or expired
  }
}
