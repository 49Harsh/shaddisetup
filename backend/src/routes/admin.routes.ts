import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireRole("admin"));

// GET /api/admin/vendors — saare vendors with their services count and orders count
router.get("/vendors", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        user: { select: { full_name: true, email: true, profile_photo: true, created_at: true } },
        _count: { select: { vendor_services: true, orders: true } },
      },
      orderBy: { created_at: "desc" },
    });
    res.json(vendors);
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});

// GET /api/admin/vendors/:id/services — ek vendor ki saari services
router.get("/vendors/:id/services", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const services = await prisma.vendor_services.findMany({
      where: { vendor_id: req.params.id },
      include: {
        _count: { select: { orders: true } },
      },
      orderBy: { created_at: "desc" },
    });
    res.json(services);
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});

// DELETE /api/admin/vendors/:id — vendor delete karo (cascade: services + orders bhi delete honge)
router.delete("/vendors/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { id: req.params.id } });
    if (!vendor) { res.status(404).json({ error: "Vendor nahi mila." }); return; }
    // User delete karne se cascade mein vendor bhi delete hoga
    await prisma.user.delete({ where: { id: vendor.user_id } });
    res.json({ message: "Vendor aur uski saari services delete ho gayi." });
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});

// DELETE /api/admin/services/:id — kisi bhi vendor ki service delete karo
router.delete("/services/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const service = await prisma.vendor_services.findUnique({ where: { id: req.params.id } });
    if (!service) { res.status(404).json({ error: "Service nahi mili." }); return; }
    await prisma.vendor_services.delete({ where: { id: req.params.id } });
    res.json({ message: "Service delete ho gayi." });
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});

// GET /api/admin/stats — overall stats
router.get("/stats", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalVendors, totalUsers, totalOrders, totalServices, pendingOrders] = await Promise.all([
      prisma.vendor.count(),
      prisma.user.count({ where: { role: "user" } }),
      prisma.orders.count(),
      prisma.vendor_services.count(),
      prisma.orders.count({ where: { status: "pending" } }),
    ]);
    res.json({ totalVendors, totalUsers, totalOrders, totalServices, pendingOrders });
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});

// GET /api/admin/orders — saare orders
router.get("/orders", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        vendor_services: { select: { name: true, service_type: true, selling_price: true } },
        users: { select: { full_name: true, phone: true, email: true } },
        vendors: { select: { business_name: true, phone: true } },
      },
      orderBy: { created_at: "desc" },
    });
    res.json(orders);
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});

export default router;
