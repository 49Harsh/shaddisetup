import { Router, Request, Response } from "express";
import { db } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// POST /api/ratings — user: rate a service
router.post("/", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { service_id, rating, review } = req.body;
  if (!service_id || !rating || rating < 1 || rating > 5) {
    res.status(400).json({ error: "service_id aur 1-5 rating zaroori hai." }); return;
  }
  try {
    const r = await db.service_ratings.upsert({
      where: { service_id_user_id: { service_id, user_id: req.userId } },
      update: { rating: +rating, review: review || "" },
      create: { service_id, user_id: req.userId, rating: +rating, review: review || "" },
    });
    res.json(r);
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});

// GET /api/ratings/:serviceId — service ki ratings
router.get("/:serviceId", async (req: Request, res: Response): Promise<void> => {
  try {
    const ratings = await db.service_ratings.findMany({
      where: { service_id: req.params.serviceId },
      include: { users: { select: { full_name: true } } },
      orderBy: { created_at: "desc" },
    });
    const avg = ratings.length ? ratings.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / ratings.length : 0;
    res.json({ ratings, avg: Math.round(avg * 10) / 10, count: ratings.length });
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});

export default router;
