// This file creates a single Prisma Client instance and exports it.
// We do this so the ENTIRE app shares ONE database connection,
// instead of each file creating its own (which would be wasteful).

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
