import { Router, Request, Response } from "express";
import multer from "multer";
import { prisma } from "../lib/prisma";
import { uploadImage } from "../lib/cloudinary";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth.middleware";

const router = Router();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const upload = (multer as any)({ storage: multer.memoryStorage() });

// All valid Pooja service types
type PoojaType =
  | "BhoomiPooja" | "GrihaPravesh" | "VastuShanti" | "VahaanPooja"
  | "DukaanUdghatan" | "SatyanarayanKatha" | "GaneshChaturthi" | "LakshmiPooja"
  | "NavratriPooja" | "MahaMrityunjayaJaap" | "KundaliMilan" | "GrahaShanti" | "Rudrabhishek";

const POOJA_TYPES: PoojaType[] = [
  "BhoomiPooja", "GrihaPravesh", "VastuShanti", "VahaanPooja",
  "DukaanUdghatan", "SatyanarayanKatha", "GaneshChaturthi", "LakshmiPooja",
  "NavratriPooja", "MahaMrityunjayaJaap", "KundaliMilan", "GrahaShanti", "Rudrabhishek",
];

// ─────────────────────────────────────────────────────────────────
// GET /api/pooja  — Public: return all active Pooja services
// ─────────────────────────────────────────────────────────────────
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const { type, district } = req.query;

  // validate type if provided
  if (type && !POOJA_TYPES.includes(type as PoojaType)) {
    res.status(400).json({ error: "Invalid pooja type." });
    return;
  }

  try {
    const services = await prisma.vendor_services.findMany({
      where: {
        is_active: true,
        service_type: { in: POOJA_TYPES as string[] as never },
        ...(type ? { service_type: type as never } : {}),
        ...(district ? { vendors: { district: String(district) } } : {}),
      },
      include: {
        vendors: {
          select: {
            business_name: true,
            phone: true,
            district: true,
            block: true,
            village: true,
            working_hours: true,
            experience_years: true,
            experience_desc: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });
    res.json(services);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error." });
  }
});

// ─────────────────────────────────────────────────────────────────
// GET /api/pooja/vendor/my  — Vendor: own pooja services
// ─────────────────────────────────────────────────────────────────
router.get(
  "/vendor/my",
  authenticate,
  requireRole("vendor", "pandit"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const vendor = await prisma.vendor.findUnique({ where: { user_id: req.userId } });
      if (!vendor) { res.status(404).json({ error: "Vendor nahi mila." }); return; }

      const services = await prisma.vendor_services.findMany({
        where: {
          vendor_id: vendor.id,
          service_type: { in: POOJA_TYPES as string[] as never },
        },
        orderBy: { created_at: "desc" },
      });
      res.json(services);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error." });
    }
  }
);

// ─────────────────────────────────────────────────────────────────
// GET /api/pooja/:id  — Public: single pooja service detail
// ─────────────────────────────────────────────────────────────────
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await prisma.vendor_services.findFirst({
      where: {
        id: req.params.id,
        service_type: { in: POOJA_TYPES as string[] as never },
      },
      include: {
        vendors: {
          select: {
            business_name: true,
            phone: true,
            district: true,
            block: true,
            village: true,
            working_hours: true,
            experience_years: true,
            experience_desc: true,
          },
        },
      },
    });
    if (!service) { res.status(404).json({ error: "Pooja service nahi mili." }); return; }
    res.json(service);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error." });
  }
});

// ─────────────────────────────────────────────────────────────────
// POST /api/pooja  — Vendor: add new pooja service
// ─────────────────────────────────────────────────────────────────
router.post(
  "/",
  authenticate,
  requireRole("vendor", "pandit"),
  upload.fields([{ name: "main_image", maxCount: 1 }, { name: "images", maxCount: 5 }]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { service_type, name, actual_price, selling_price, description } = req.body;

      if (!service_type || !name || !actual_price || !selling_price || !description) {
        res.status(400).json({ error: "Saari fields bharein." }); return;
      }
      if (!POOJA_TYPES.includes(service_type as PoojaType)) {
        res.status(400).json({ error: "Invalid pooja type." }); return;
      }

      const vendor = await prisma.vendor.findUnique({ where: { user_id: req.userId } });
      if (!vendor) { res.status(404).json({ error: "Vendor profile nahi mila." }); return; }

      const files = req.files as { [f: string]: Express.Multer.File[] };
      let main_image = "";
      if (files?.main_image?.[0])
        main_image = await uploadImage(files.main_image[0].buffer, "pooja");

      const images: string[] = [];
      if (files?.images) {
        for (const f of files.images) images.push(await uploadImage(f.buffer, "pooja"));
      }

      const service = await prisma.vendor_services.create({
        data: {
          vendor_id: vendor.id,
          service_type: service_type as never,
          name,
          actual_price: +actual_price,
          selling_price: +selling_price,
          description,
          main_image,
          images,
        },
      });
      res.json(service);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error." });
    }
  }
);

// ─────────────────────────────────────────────────────────────────
// PUT /api/pooja/:id  — Vendor: update pooja service
// ─────────────────────────────────────────────────────────────────
router.put(
  "/:id",
  authenticate,
  requireRole("vendor", "pandit"),
  upload.fields([{ name: "main_image", maxCount: 1 }, { name: "images", maxCount: 5 }]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const vendor = await prisma.vendor.findUnique({ where: { user_id: req.userId } });
      if (!vendor) { res.status(404).json({ error: "Vendor nahi mila." }); return; }

      const existing = await prisma.vendor_services.findFirst({
        where: {
          id: req.params.id,
          vendor_id: vendor.id,
          service_type: { in: POOJA_TYPES as string[] as never },
        },
      });
      if (!existing) { res.status(403).json({ error: "Permission nahi hai." }); return; }

      const { service_type, name, actual_price, selling_price, description } = req.body;

      if (service_type && !POOJA_TYPES.includes(service_type as PoojaType)) {
        res.status(400).json({ error: "Invalid pooja type." }); return;
      }

      const files = req.files as { [f: string]: Express.Multer.File[] };
      let main_image = existing.main_image;
      if (files?.main_image?.[0])
        main_image = await uploadImage(files.main_image[0].buffer, "pooja");

      let images = existing.images;
      if (files?.images?.length) {
        images = [];
        for (const f of files.images) images.push(await uploadImage(f.buffer, "pooja"));
      }

      const updated = await prisma.vendor_services.update({
        where: { id: req.params.id },
        data: {
          service_type: (service_type ?? existing.service_type) as never,
          name: name ?? existing.name,
          actual_price: actual_price ? +actual_price : existing.actual_price,
          selling_price: selling_price ? +selling_price : existing.selling_price,
          description: description ?? existing.description,
          main_image,
          images,
        },
      });
      res.json(updated);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error." });
    }
  }
);

// ─────────────────────────────────────────────────────────────────
// PATCH /api/pooja/:id/toggle  — Vendor: toggle active/inactive
// ─────────────────────────────────────────────────────────────────
router.patch(
  "/:id/toggle",
  authenticate,
  requireRole("vendor", "pandit"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const vendor = await prisma.vendor.findUnique({ where: { user_id: req.userId } });
      if (!vendor) { res.status(404).json({ error: "Vendor nahi mila." }); return; }

      const existing = await prisma.vendor_services.findFirst({
        where: {
          id: req.params.id,
          vendor_id: vendor.id,
          service_type: { in: POOJA_TYPES as string[] as never },
        },
      });
      if (!existing) { res.status(403).json({ error: "Permission nahi hai." }); return; }

      const updated = await prisma.vendor_services.update({
        where: { id: req.params.id },
        data: { is_active: !existing.is_active },
      });
      res.json(updated);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error." });
    }
  }
);

// ─────────────────────────────────────────────────────────────────
// DELETE /api/pooja/:id  — Vendor: delete pooja service
// ─────────────────────────────────────────────────────────────────
router.delete(
  "/:id",
  authenticate,
  requireRole("vendor", "pandit"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const vendor = await prisma.vendor.findUnique({ where: { user_id: req.userId } });
      if (!vendor) { res.status(404).json({ error: "Vendor nahi mila." }); return; }

      const existing = await prisma.vendor_services.findFirst({
        where: {
          id: req.params.id,
          vendor_id: vendor.id,
          service_type: { in: POOJA_TYPES as string[] as never },
        },
      });
      if (!existing) { res.status(403).json({ error: "Permission nahi hai." }); return; }

      await prisma.vendor_services.delete({ where: { id: req.params.id } });
      res.json({ message: "Pooja service delete ho gayi." });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error." });
    }
  }
);

export default router;
