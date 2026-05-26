import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";

const router = Router();

/**
 * POST /api/auth/google
 * Frontend se Supabase Google OAuth token aata hai,
 * hum verify karke apna JWT dete hain.
 */
router.post("/google", async (req: Request, res: Response): Promise<void> => {
  const { access_token } = req.body;
  if (!access_token) {
    res.status(400).json({ error: "access_token required hai." });
    return;
  }

  try {
    // Supabase se user verify 
    const { data: { user }, error } = await supabase.auth.getUser(access_token);
    if (error || !user) {
      res.status(401).json({ error: "Invalid Supabase token." });
      return;
    }

    // Check user already 
    let dbUser = await prisma.user.findFirst({
      where: { email: user.email! },
    });

    // Naya user - basic entry banao (profile baad mein complete hogi)
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.email!.split("@")[0],
          phone: user.email!,  // email as placeholder — unique rehega
          block: "",
          district: "",
          pincode: "",
          role: "user",
        },
      });
    }

    // Apna JWT banao
    const token = jwt.sign(
      { userId: dbUser.id, role: dbUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        full_name: dbUser.full_name,
        role: dbUser.role,
        profileComplete: !!(dbUser.phone && dbUser.block && dbUser.district && dbUser.pincode),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

/**
 * POST /api/auth/complete-profile
 * Naye user ka profile complete karna (phone, address etc.)
 */
router.post("/complete-profile", async (req: Request, res: Response): Promise<void> => {
  const { userId, phone, full_name, block, district, pincode, village, role } = req.body;

  if (!userId || !phone || !full_name || !block || !district || !pincode) {
    res.status(400).json({ error: "Saari mandatory fields bharein." });
    return;
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        phone,
        full_name,
        block,
        district,
        pincode,
        village: village || null,
        role: role === "vendor" ? "vendor" : "user",
      },
    });

    // Agar vendor role chuna toh vendors table mein bhi entry
    if (role === "vendor") {
      const { business_name, service_types, experience_years } = req.body;
      await prisma.vendor.upsert({
        where: { user_id: userId },
        update: { business_name, service_types, experience_years, block, district, phone },
        create: { user_id: userId, business_name, service_types, experience_years, block, district, phone },
      });
    }

    const token = jwt.sign(
      { userId: updated.id, role: updated.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({ token, user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Profile update mein error." });
  }
});

/**
 * POST /api/auth/admin-login
 * Admin credentials (email + phone) env se check karke JWT deta hai
 */
router.post("/admin-login", async (req: Request, res: Response): Promise<void> => {
  const { email, phone } = req.body;

  if (!email || !phone) {
    res.status(400).json({ error: "Email aur phone dono zaroori hain." });
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPhone = process.env.ADMIN_PHONE;

  if (email !== adminEmail || phone !== adminPhone) {
    res.status(401).json({ error: "Credentials galat hain." });
    return;
  }

  try {
    // DB mein admin user dhundo ya banao
    let adminUser = await prisma.user.findFirst({ where: { email: adminEmail } });

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          full_name: "Admin",
          phone: adminPhone,
          block: "",
          district: "",
          pincode: "",
          role: "admin",
        },
      });
      // admins table mein bhi entry
      await prisma.admin.create({
        data: { user_id: adminUser.id, admin_level: "super_admin" },
      });
    }

    const token = jwt.sign(
      { userId: adminUser.id, role: "admin" },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        full_name: adminUser.full_name,
        role: "admin",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

export default router;
