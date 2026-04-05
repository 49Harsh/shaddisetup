"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Service = {
  id: string; name: string; service_type: string;
  selling_price: number; actual_price: number;
  main_image: string; is_active: boolean;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<Record<string, string> | null>(null);
  const [vendors, setVendors] = useState<Record<string, string>[]>([]);
  const [myServices, setMyServices] = useState<Service[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    const parsed = JSON.parse(u);
    setUser(parsed);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendors`)
      .then(r => r.json()).then(setVendors).catch(() => {});

    if (parsed.role === "vendor") {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/vendor/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then(r => r.json()).then(d => setMyServices(Array.isArray(d) ? d : [])).catch(() => {});
    }
  }, [router]);

  async function toggleService(id: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}/toggle`, {
      method: "PATCH", headers: { Authorization: `Bearer ${token}` },
    });
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/vendor/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMyServices(Array.isArray(data) ? data : []);
  }

  async function deleteService(id: string) {
    if (!confirm("Service delete karein?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    setMyServices(prev => prev.filter(s => s.id !== id));
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  if (!user) return null;

  const ICONS: Record<string, string> = { DJ: "🎵", Catering: "🍽️", Decoration: "🌸", Mehndi: "🎨" };

  return (
    <div style={{ minHeight: "80vh", background: "#f5f5f5", padding: "32px 20px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Welcome Card */}
        <div style={{ background: "#b5451b", borderRadius: 16, padding: "28px 32px", color: "#fff", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 14, opacity: 0.85, marginBottom: 4 }}>नमस्ते 👋</p>
            <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>{user.full_name || user.email}</h1>
            <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
              {user.role === "vendor" ? "🏪 Vendor" : user.role === "admin" ? "⚙️ Admin" : "👤 User"}
            </span>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {user.role === "vendor" && (
              <Link href="/vendor/services" style={{ background: "#fff", color: "#b5451b", padding: "10px 20px", borderRadius: 8, fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
                + Service Add करें
              </Link>
            )}
            {user.role === "vendor" && (
              <Link href="/vendor/orders" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.3)" }}>
                📋 Orders देखें
              </Link>
            )}
            {user.role === "user" && (
              <Link href="/my-orders" style={{ background: "#fff", color: "#b5451b", padding: "10px 20px", borderRadius: 8, fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
                📋 मेरे Orders
              </Link>
            )}
            <button onClick={logout} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "2px solid rgba(255,255,255,0.4)", padding: "10px 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
              लॉगआउट
            </button>
          </div>
        </div>

        {/* Vendor: My Services Section */}
        {user.role === "vendor" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1.5px solid #eee", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111" }}>मेरी Services ({myServices.length})</h2>
              <Link href="/vendor/services" style={{ background: "#b5451b", color: "#fff", padding: "8px 18px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                सभी Manage करें →
              </Link>
            </div>

            {myServices.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#aaa" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📦</div>
                <p style={{ marginBottom: 14 }}>अभी कोई service नहीं है</p>
                <Link href="/vendor/services" style={{ background: "#b5451b", color: "#fff", padding: "10px 22px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                  + पहली Service Add करें
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {myServices.map(s => (
                  <div key={s.id} style={{ border: `1.5px solid ${s.is_active ? "#eee" : "#fecaca"}`, borderRadius: 12, overflow: "hidden" }}>
                    {/* Image */}
                    <div style={{ height: 130, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                      {s.main_image
                        ? <img src={s.main_image} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ fontSize: 40 }}>{ICONS[s.service_type] || "📦"}</span>}
                      <span style={{ position: "absolute", top: 8, left: 8, background: s.is_active ? "#22c55e" : "#ef4444", color: "#fff", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                        {s.is_active ? "✓ Active" : "✕ Off"}
                      </span>
                    </div>
                    <div style={{ padding: "12px" }}>
                      <p style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>{ICONS[s.service_type]} {s.service_type}</p>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111", marginBottom: 4 }}>{s.name}</h3>
                      <p style={{ fontSize: 16, fontWeight: 900, color: "#b5451b", marginBottom: 10 }}>₹{s.selling_price.toLocaleString()}</p>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Link href={`/services/detail/${s.id}`} style={{ flex: 1, background: "#f5f5f5", color: "#333", padding: "6px", borderRadius: 6, fontWeight: 700, fontSize: 12, textDecoration: "none", textAlign: "center" }}>👁</Link>
                        <Link href={`/vendor/services?edit=${s.id}`} style={{ flex: 1, background: "#f5f5f5", color: "#333", padding: "6px", borderRadius: 6, fontWeight: 700, fontSize: 12, textDecoration: "none", textAlign: "center" }}>✏️</Link>
                        <button onClick={() => toggleService(s.id)} style={{ flex: 1, background: s.is_active ? "#fef3c7" : "#dcfce7", color: s.is_active ? "#d97706" : "#16a34a", border: "none", padding: "6px", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                          {s.is_active ? "⏸" : "▶"}
                        </button>
                        <button onClick={() => deleteService(s.id)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 10px", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>🗑</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
          {[
            { icon: "🌸", label: "डेकोरेशन देखें", href: "/services/decoration" },
            { icon: "🎵", label: "DJ / बैंड देखें", href: "/services/dj-band" },
            { icon: "🍽️", label: "कैटरिंग देखें", href: "/services/catering" },
            { icon: "📞", label: "WhatsApp करें", href: "https://wa.me/919999999999" },
          ].map((item, i) => (
            <Link key={i} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", borderRadius: 12, padding: "20px", textAlign: "center", border: "1.5px solid #eee", cursor: "pointer" }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>{item.icon}</div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#333" }}>{item.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Vendors List */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1.5px solid #eee" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 18 }}>उपलब्ध वेंडर्स ({vendors.length})</h2>
          {vendors.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#aaa" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
              <p>अभी कोई वेंडर नहीं है</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {vendors.map((v, i) => (
                <div key={i} style={{ border: "1.5px solid #eee", borderRadius: 10, padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111", marginBottom: 2 }}>{v.business_name}</h3>
                    <p style={{ fontSize: 13, color: "#777" }}>📍 {v.district}, {v.block}</p>
                    <p style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{Array.isArray(v.service_types) ? v.service_types.join(", ") : v.service_types}</p>
                  </div>
                  <a href={`https://wa.me/91${v.phone}`} target="_blank" rel="noopener noreferrer"
                    style={{ background: "#25D366", color: "#fff", padding: "8px 16px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
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
