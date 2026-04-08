import { Router, Response } from "express";
import { prisma, db } from "../lib/prisma";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// POST /api/orders — user: order place karo
router.post("/", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { service_id, event_date, message } = req.body;
  if (!service_id || !event_date) {
    res.status(400).json({ error: "service_id aur event_date zaroori hai." }); return;
  }
  try {
    const service = await prisma.vendor_services.findUnique({ where: { id: service_id } });
    if (!service || !service.is_active) { res.status(404).json({ error: "Service nahi mili." }); return; }

    const order = await db.orders.create({
      data: {
        service_id,
        user_id: req.userId!,
        vendor_id: service.vendor_id,
        event_date: new Date(event_date),
        message: message || "",
        status: "pending",
      },
    });
    res.json(order);
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});

// GET /api/orders/check?service_id=X — user ka confirmed order check karo
router.get("/check", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { service_id } = req.query;
  if (!service_id) { res.status(400).json({ error: "service_id required." }); return; }
  try {
    const order = await db.orders.findFirst({
      where: { user_id: req.userId, service_id: String(service_id), status: "confirmed" },
    });
    res.json({ hasConfirmedOrder: !!order });
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});


// GET /api/orders/my — user: apne orders
router.get("/my", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await db.orders.findMany({
      where: { user_id: req.userId },
      include: { vendor_services: { select: { name: true, service_type: true, selling_price: true, main_image: true } } },
      orderBy: { created_at: "desc" },
    });
    res.json(orders);
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});

// GET /api/orders/vendor — vendor: apne orders
router.get("/vendor", authenticate, requireRole("vendor"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { user_id: req.userId } });
    if (!vendor) { res.status(404).json({ error: "Vendor nahi mila." }); return; }
    const orders = await db.orders.findMany({
      where: { vendor_id: vendor.id },
      include: {
        vendor_services: { select: { name: true, service_type: true, selling_price: true } },
        users: { select: { full_name: true, phone: true, email: true } },
      },
      orderBy: { created_at: "desc" },
    });
    res.json(orders);
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});

// PATCH /api/orders/:id — vendor: confirm/reject
router.patch("/:id", authenticate, requireRole("vendor"), async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.body;
  if (!["confirmed", "rejected"].includes(status)) {
    res.status(400).json({ error: "Status confirmed ya rejected hona chahiye." }); return;
  }
  try {
    const updated = await db.orders.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(updated);
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});

export default router;
