"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<Record<string, string> | null>(null);
  const [vendors, setVendors] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    setUser(JSON.parse(u));

    // Vendors fetch karo
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendors`)
      .then(r => r.json())
      .then(setVendors)
      .catch(() => {});
  }, [router]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  if (!user) return null;

  return (
    <div style={{ minHeight: "80vh", background: "#f5f5f5", padding: "40px 20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Welcome Card */}
        <div style={{ background: "#b5451b", borderRadius: 16, padding: "32px", color: "#fff", marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 15, opacity: 0.85, marginBottom: 4 }}>नमस्ते 👋</p>
            <h1 style={{ fontSize: 28, fontWeight: 900 }}>{user.full_name || user.email}</h1>
            <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
              {user.role === "vendor" ? "🏪 Vendor" : user.role === "admin" ? "⚙️ Admin" : "👤 User"}
            </span>
          </div>
          <button onClick={logout} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "2px solid rgba(255,255,255,0.4)", padding: "10px 22px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
            लॉगआउट
          </button>
        </div>

        {/* Quick Links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { icon: "🌸", label: "डेकोरेशन देखें", href: "/services/decoration" },
            { icon: "🎵", label: "DJ / बैंड देखें", href: "/services/dj-band" },
            { icon: "🍽️", label: "कैटरिंग देखें", href: "/services/catering" },
            { icon: "📞", label: "WhatsApp करें", href: "https://wa.me/919999999999" },
          ].map((item, i) => (
            <Link key={i} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", borderRadius: 12, padding: "24px 20px", textAlign: "center", border: "1.5px solid #eee", cursor: "pointer" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{item.icon}</div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#333" }}>{item.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Vendors List */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "28px", border: "1.5px solid #eee" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111", marginBottom: 20 }}>
            उपलब्ध वेंडर्स ({vendors.length})
          </h2>
          {vendors.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <p style={{ fontSize: 16 }}>अभी कोई वेंडर नहीं है</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {vendors.map((v, i) => (
                <div key={i} style={{ border: "1.5px solid #eee", borderRadius: 12, padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111", marginBottom: 4 }}>{v.business_name}</h3>
                    <p style={{ fontSize: 14, color: "#777" }}>📍 {v.district}, {v.block}</p>
                    <p style={{ fontSize: 13, color: "#999", marginTop: 4 }}>{Array.isArray(v.service_types) ? v.service_types.join(", ") : v.service_types}</p>
                  </div>
                  <a href={`https://wa.me/91${v.phone}`} target="_blank" rel="noopener noreferrer"
                    style={{ background: "#25D366", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                    💬 WhatsApp
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
