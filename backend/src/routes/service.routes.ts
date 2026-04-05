import { Router, Request, Response } from "express";
import multer from "multer";
import { prisma } from "../lib/prisma";
import { uploadImage } from "../lib/cloudinary";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth.middleware";

const router = Router();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const upload = (multer as any)({ storage: multer.memoryStorage() });

type SType = "DJ" | "Catering" | "Decoration" | "Mehndi";

// GET /api/services — public, sirf active
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const { type, district } = req.query;
  try {
    const services = await prisma.vendor_services.findMany({
      where: {
        is_active: true,
        ...(type ? { service_type: type as SType } : {}),
        ...(district ? { vendors: { district: String(district) } } : {}),
      },
      include: { vendors: { select: { business_name: true, phone: true, district: true, block: true } } },
      orderBy: { created_at: "desc" },
    });
    res.json(services);
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});

// GET /api/services/vendor/my — vendor ki apni services
router.get("/vendor/my", authenticate, requireRole("vendor"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { user_id: req.userId } });
    if (!vendor) { res.status(404).json({ error: "Vendor nahi mila." }); return; }
    const services = await prisma.vendor_services.findMany({
      where: { vendor_id: vendor.id },
      orderBy: { created_at: "desc" },
    });
    res.json(services);
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});

// GET /api/services/:id — public detail
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await prisma.vendor_services.findUnique({
      where: { id: req.params.id },
      include: { vendors: { select: { business_name: true, phone: true, district: true, block: true } } },
    });
    if (!service) { res.status(404).json({ error: "Service nahi mili." }); return; }
    res.json(service);
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});

// POST /api/services — vendor: nai service
router.post("/", authenticate, requireRole("vendor"),
  upload.fields([{ name: "main_image", maxCount: 1 }, { name: "images", maxCount: 5 }]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { service_type, name, actual_price, selling_price, description } = req.body;
      if (!service_type || !name || !actual_price || !selling_price || !description) {
        res.status(400).json({ error: "Saari fields bharein." }); return;
      }
      const vendor = await prisma.vendor.findUnique({ where: { user_id: req.userId } });
      if (!vendor) { res.status(404).json({ error: "Vendor profile nahi mila." }); return; }

      const files = req.files as { [f: string]: Express.Multer.File[] };
      let main_image = "";
      if (files?.main_image?.[0]) main_image = await uploadImage(files.main_image[0].buffer, "services");
      const images: string[] = [];
      if (files?.images) for (const f of files.images) images.push(await uploadImage(f.buffer, "services"));

      const service = await prisma.vendor_services.create({
        data: { vendor_id: vendor.id, service_type: service_type as SType, name, actual_price: +actual_price, selling_price: +selling_price, description, main_image, images },
      });
      res.json(service);
    } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
  }
);

// PUT /api/services/:id — vendor: update
router.put("/:id", authenticate, requireRole("vendor"),
  upload.fields([{ name: "main_image", maxCount: 1 }, { name: "images", maxCount: 5 }]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const vendor = await prisma.vendor.findUnique({ where: { user_id: req.userId } });
      if (!vendor) { res.status(404).json({ error: "Vendor nahi mila." }); return; }
      const existing = await prisma.vendor_services.findFirst({ where: { id: req.params.id, vendor_id: vendor.id } });
      if (!existing) { res.status(403).json({ error: "Permission nahi hai." }); return; }

      const { service_type, name, actual_price, selling_price, description } = req.body;
      const files = req.files as { [f: string]: Express.Multer.File[] };

      let main_image = existing.main_image;
      if (files?.main_image?.[0]) main_image = await uploadImage(files.main_image[0].buffer, "services");
      let images = existing.images;
      if (files?.images?.length) { images = []; for (const f of files.images) images.push(await uploadImage(f.buffer, "services")); }

      const updated = await prisma.vendor_services.update({
        where: { id: req.params.id },
        data: { service_type: service_type as SType, name, actual_price: +actual_price, selling_price: +selling_price, description, main_image, images },
      });
      res.json(updated);
    } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
  }
);

// PATCH /api/services/:id/toggle
router.patch("/:id/toggle", authenticate, requireRole("vendor"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { user_id: req.userId } });
    if (!vendor) { res.status(404).json({ error: "Vendor nahi mila." }); return; }
    const existing = await prisma.vendor_services.findFirst({ where: { id: req.params.id, vendor_id: vendor.id } });
    if (!existing) { res.status(403).json({ error: "Permission nahi hai." }); return; }
    const updated = await prisma.vendor_services.update({ where: { id: req.params.id }, data: { is_active: !existing.is_active } });
    res.json(updated);
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});

// DELETE /api/services/:id
router.delete("/:id", authenticate, requireRole("vendor"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { user_id: req.userId } });
    if (!vendor) { res.status(404).json({ error: "Vendor nahi mila." }); return; }
    const existing = await prisma.vendor_services.findFirst({ where: { id: req.params.id, vendor_id: vendor.id } });
    if (!existing) { res.status(403).json({ error: "Permission nahi hai." }); return; }
    await prisma.vendor_services.delete({ where: { id: req.params.id } });
    res.json({ message: "Service delete ho gayi." });
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error." }); }
});

export default router;
