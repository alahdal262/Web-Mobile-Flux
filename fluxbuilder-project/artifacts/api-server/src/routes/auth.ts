import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, createSession, getSession, deleteSession } from "../lib/auth";
import { z } from "zod";

const router: IRouter = Router();

const signupSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1).optional(),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

// POST /api/auth/signup
router.post("/auth/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const { email, password, fullName } = parsed.data;

  try {
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db.insert(usersTable).values({ email, passwordHash, fullName }).returning();

    const sessionId = createSession({ userId: user.id, email: user.email, fullName: user.fullName ?? undefined });
    res.cookie("session", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(201).json({ id: user.id, email: user.email, fullName: user.fullName });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/login
router.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { email, password } = parsed.data;

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await verifyPassword(user.passwordHash, password);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const sessionId = createSession({ userId: user.id, email: user.email, fullName: user.fullName ?? undefined });
    res.cookie("session", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ id: user.id, email: user.email, fullName: user.fullName });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/logout
router.post("/auth/logout", (req, res) => {
  const sessionId = req.cookies?.session as string | undefined;
  if (sessionId) deleteSession(sessionId);
  res.clearCookie("session");
  res.json({ ok: true });
});

// GET /api/auth/me
router.get("/auth/me", (req, res) => {
  const sessionId = req.cookies?.session as string | undefined;
  if (!sessionId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const session = getSession(sessionId);
  if (!session) {
    res.status(401).json({ error: "Session expired" });
    return;
  }
  res.json(session);
});

export default router;
