"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Order = {
  id: string; status: string; event_date: string; message: string; created_at: string;
  vendor_services: { name: string; service_type: string; selling_price: number };
  users: { full_name: string; phone: string; email: string };
};

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: "#fef3c7", color: "#d97706", label: "⏳ Pending" },
  confirmed: { bg: "#dcfce7", color: "#16a34a", label: "✅ Confirmed" },
  rejected:  { bg: "#fee2e2", color: "#ef4444", label: "❌ Rejected" },
};

export default function VendorOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    const role = JSON.parse(u).role;
    if (role !== "vendor" && role !== "pandit") { router.push("/dashboard"); return; }
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/vendor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch { setOrders([]); }
    setLoading(false);
  }

  async function updateStatus(id: string, status: "confirmed" | "rejected") {
    setUpdating(id);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    await fetchOrders();
    setUpdating(null);
  }

  const pending = orders.filter(o => o.status === "pending");
  const others = orders.filter(o => o.status !== "pending");

  return (
    <div style={{ minHeight: "80vh", background: "#f5f5f5", padding: "32px 20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
          <div>
            <Link href="/dashboard" style={{ color: "#b5451b", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>← Dashboard</Link>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111", marginTop: 4 }}>Orders</h1>
            <p style={{ color: "#777", fontSize: 14 }}>{pending.length} pending · {orders.length} total</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>लोड हो रहा है...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 16, border: "1.5px solid #eee" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <p style={{ fontSize: 16, color: "#777" }}>अभी कोई order नहीं है</p>
          </div>
        ) : (
          <>
            {/* Pending Orders */}
            {pending.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#d97706", marginBottom: 14 }}>⏳ Pending Orders ({pending.length})</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {pending.map(o => <OrderCard key={o.id} order={o} onUpdate={updateStatus} updating={updating} />)}
                </div>
              </div>
            )}
            {/* Other Orders */}
            {others.length > 0 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#555", marginBottom: 14 }}>पुराने Orders ({others.length})</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {others.map(o => <OrderCard key={o.id} order={o} onUpdate={updateStatus} updating={updating} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, onUpdate, updating }: {
  order: Order;
  onUpdate: (id: string, status: "confirmed" | "rejected") => void;
  updating: string | null;
}) {
  const s = STATUS_STYLE[order.status] || STATUS_STYLE.pending;
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", border: "1.5px solid #eee" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ background: s.bg, color: s.color, padding: "3px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>{s.label}</span>
            <span style={{ fontSize: 13, color: "#888" }}>#{order.id.slice(0, 8)}</span>
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: "#111", marginBottom: 4 }}>{order.vendor_services?.name}</h3>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
            👤 {order.users?.full_name} · 📞 {order.users?.phone || order.users?.email}
          </p>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
            📅 Event Date: <strong>{new Date(order.event_date).toLocaleDateString("hi-IN")}</strong>
          </p>
          {order.message && <p style={{ fontSize: 13, color: "#777", background: "#f9f9f9", padding: "8px 12px", borderRadius: 8, marginTop: 6 }}>💬 {order.message}</p>}
          <p style={{ fontSize: 12, color: "#aaa", marginTop: 8 }}>Order: {new Date(order.created_at).toLocaleDateString("hi-IN")}</p>
        </div>

        {/* Actions */}
        {order.status === "pending" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 140 }}>
            <button onClick={() => onUpdate(order.id, "confirmed")} disabled={updating === order.id}
              style={{ background: "#22c55e", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 8, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
              {updating === order.id ? "..." : "✅ Confirm"}
            </button>
            <button onClick={() => onUpdate(order.id, "rejected")} disabled={updating === order.id}
              style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "10px 16px", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              ❌ Reject
            </button>
            <a href={`https://wa.me/91${order.users?.phone}?text=नमस्ते ${order.users?.full_name}! आपका "${order.vendor_services?.name}" का order confirm हो गया है।`}
              target="_blank" rel="noopener noreferrer"
              style={{ background: "#25D366", color: "#fff", padding: "10px 16px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none", textAlign: "center" }}>
              💬 WhatsApp
            </a>
          </div>
        )}
        {order.status !== "pending" && (
          <a href={`https://wa.me/91${order.users?.phone}`} target="_blank" rel="noopener noreferrer"
            style={{ background: "#25D366", color: "#fff", padding: "10px 16px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            💬 WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
