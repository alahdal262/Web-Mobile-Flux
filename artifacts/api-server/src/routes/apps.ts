import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import { appsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getSession } from "../lib/auth";
import { z } from "zod";

const router: IRouter = Router();

// Auth middleware — attaches session to req if present
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies?.session as string | undefined;
  if (!sessionId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const session = getSession(sessionId);
  if (!session) { res.status(401).json({ error: "Session expired" }); return; }
  (req as any).session = session;
  next();
}

const createAppSchema = z.object({
  appName:      z.string().min(1),
  websiteUrl:   z.string().url().optional(),
  templateId:   z.string().optional(),
  primaryColor: z.string().optional(),
  featureState: z.any().optional(),
});

const patchAppSchema = createAppSchema.partial();

// GET /api/apps
router.get("/apps", requireAuth, async (req, res) => {
  const { userId } = (req as any).session;
  try {
    const apps = await db.select().from(appsTable).where(eq(appsTable.userId, userId));
    res.json(apps);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/apps
router.post("/apps", requireAuth, async (req, res) => {
  const { userId } = (req as any).session;
  const parsed = createAppSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  try {
    const [app] = await db.insert(appsTable).values({ userId, ...parsed.data }).returning();
    res.status(201).json(app);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/apps/:id
router.patch("/apps/:id", requireAuth, async (req, res) => {
  const { userId } = (req as any).session;
  const id = String(req.params.id);
  const parsed = patchAppSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  try {
    const [app] = await db
      .update(appsTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(appsTable.id, id))
      .returning();
    if (!app || app.userId !== userId) {
      res.status(404).json({ error: "App not found" });
      return;
    }
    res.json(app);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/apps/:id
router.delete("/apps/:id", requireAuth, async (req, res) => {
  const { userId } = (req as any).session;
  const id = String(req.params.id);
  try {
    const [deleted] = await db
      .delete(appsTable)
      .where(eq(appsTable.id, id))
      .returning();
    if (!deleted || deleted.userId !== userId) {
      res.status(404).json({ error: "App not found" });
      return;
    }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
