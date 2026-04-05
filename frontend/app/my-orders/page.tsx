"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Order = {
  id: string; status: string; event_date: string; message: string; created_at: string;
  vendor_services: { name: string; service_type: string; selling_price: number; main_image: string };
};

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string; desc: string }> = {
  pending:   { bg: "#fef3c7", color: "#d97706", label: "⏳ Pending", desc: "Vendor confirm करने वाला है" },
  confirmed: { bg: "#dcfce7", color: "#16a34a", label: "✅ Confirmed", desc: "Vendor ने confirm कर दिया!" },
  rejected:  { bg: "#fee2e2", color: "#ef4444", label: "❌ Rejected", desc: "Vendor ने reject किया" },
};

const ICONS: Record<string, string> = { DJ: "🎵", Catering: "🍽️", Decoration: "🌸", Mehndi: "🎨" };

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/my`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(d => { setOrders(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "80vh", background: "#f5f5f5", padding: "32px 20px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <Link href="/dashboard" style={{ color: "#b5451b", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>← Dashboard</Link>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111", marginTop: 4 }}>मेरे Orders</h1>
          <p style={{ color: "#777", fontSize: 14 }}>{orders.length} total orders</p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>लोड हो रहा है...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 16, border: "1.5px solid #eee" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
            <p style={{ fontSize: 16, color: "#777", marginBottom: 20 }}>अभी कोई order नहीं है</p>
            <Link href="/browse" style={{ background: "#b5451b", color: "#fff", padding: "12px 28px", borderRadius: 10, fontWeight: 800, fontSize: 15, textDecoration: "none" }}>
              Services देखें →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {orders.map(o => {
              const s = STATUS_STYLE[o.status] || STATUS_STYLE.pending;
              return (
                <div key={o.id} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: `2px solid ${s.bg}` }}>
                  {/* Status Bar */}
                  <div style={{ background: s.bg, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ color: s.color, fontWeight: 800, fontSize: 15 }}>{s.label}</span>
                    <span style={{ color: s.color, fontSize: 13 }}>{s.desc}</span>
                  </div>

                  <div style={{ padding: "18px 20px", display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {/* Image */}
                    <div style={{ width: 80, height: 80, borderRadius: 10, overflow: "hidden", background: "#f5f5f5", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {o.vendor_services?.main_image
                        ? <img src={o.vendor_services.main_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ fontSize: 32 }}>{ICONS[o.vendor_services?.service_type] || "📦"}</span>}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 800, color: "#111", marginBottom: 4 }}>{o.vendor_services?.name}</h3>
                      <p style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
                        {ICONS[o.vendor_services?.service_type]} {o.vendor_services?.service_type} ·
                        <strong style={{ color: "#b5451b" }}> ₹{o.vendor_services?.selling_price?.toLocaleString()}</strong>
                      </p>
                      <p style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
                        📅 Event Date: <strong>{new Date(o.event_date).toLocaleDateString("hi-IN")}</strong>
                      </p>
                      {o.message && <p style={{ fontSize: 13, color: "#777" }}>💬 {o.message}</p>}
                      <p style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>Order #{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleDateString("hi-IN")}</p>
                    </div>

                    {/* Action */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
                      <Link href={`/browse/${o.vendor_services ? o.id : ""}`}
                        style={{ background: "#f5f5f5", color: "#333", padding: "8px 16px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none", textAlign: "center" }}>
                        👁 देखें
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
