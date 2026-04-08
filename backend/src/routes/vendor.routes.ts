import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// GET /api/vendors - Saare vendors list (public)
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const { district, service_type } = req.query;
  try {
    const vendors = await prisma.vendor.findMany({
      where: {
        ...(district ? { district: String(district) } : {}),
        ...(service_type ? { service_types: { has: String(service_type) } } : {}),
      },
      include: {
        user: { select: { full_name: true, email: true, profile_photo: true } },
      },
    });
    res.json(vendors);
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// GET /api/vendors/:id - Ek vendor ki detail
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { full_name: true, email: true, profile_photo: true } } },
    });
    if (!vendor) {
      res.status(404).json({ error: "Vendor nahi mila." });
      return;
    }
    res.json(vendor);
  } catch {
    res.status(500).json({ error: "Server error." });
  }
});

// PUT /api/vendors/me - Vendor apni details update kare
router.put("/me", authenticate, requireRole("vendor"), async (req: AuthRequest, res: Response): Promise<void> => {
  const { business_name, service_types, experience_years, experience_desc, working_hours, village, block, district, phone } = req.body;
  try {
    const updated = await prisma.vendor.update({
      where: { user_id: req.userId },
      data: { business_name, service_types, experience_years, experience_desc, working_hours, village, block, district, phone },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Update mein error." });
  }
});

export default router;
