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
    // Supabase se user verify karo
    const { data: { user }, error } = await supabase.auth.getUser(access_token);
    if (error || !user) {
      res.status(401).json({ error: "Invalid Supabase token." });
      return;
    }

    // Check karo user already hai ya nahi
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
        profileComplete: !!(dbUser.phone && dbUser.phone !== dbUser.email && dbUser.block && dbUser.district && dbUser.pincode),
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
        role: role === "vendor" || role === "pandit" ? role : "user",
      },
    });

    // Agar vendor ya pandit role chuna toh vendors table mein bhi entry
    if (role === "vendor" || role === "pandit") {
      const { business_name, service_types, experience_years } = req.body;
      await prisma.vendor.upsert({
        where: { user_id: userId },
        update: { business_name, service_types, experience_years, block, district, village: village || null, phone },
        create: { user_id: userId, business_name, service_types, experience_years, block, district, village: village || null, phone },
      });
    }

    const token = jwt.sign(
      { userId: updated.id, role: updated.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({ token, user: updated });
  } catch (err: any) {
    console.error(err);
    if (err.code === "P2002" && err.meta?.target?.includes("phone")) {
      res.status(400).json({ error: "यह मोबाइल नंबर पहले से रजिस्टर है। कृपया दूसरा नंबर इस्तेमाल करें।" });
      return;
    }
    res.status(500).json({ error: "Profile update mein error." });
  }
});

export default router;
