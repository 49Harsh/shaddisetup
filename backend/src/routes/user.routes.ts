import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// GET /api/users/me - Apni profile dekho
router.get("/me", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { vendor: true },
    });
    if (!user) {
      res.status(404).json({ error: "User nahi mila." });
      return;
    }
    res.json(user);
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// PUT /api/users/me - Profile update karo
router.put("/me", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { full_name, phone, village, block, district, pincode, profile_photo } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: { full_name, phone, village, block, district, pincode, profile_photo },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Update mein error." });
  }
});

export default router;
