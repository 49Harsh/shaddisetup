"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Stats = {
  totalVendors: number; totalUsers: number; totalOrders: number;
  totalServices: number; pendingOrders: number;
};

type Vendor = {
  id: string; business_name: string; phone: string; district: string; block: string;
  service_types: string[]; created_at: string;
  user: { full_name: string; email: string; profile_photo: string | null };
  _count: { vendor_services: number; orders: number };
};

type Service = {
  id: string; name: string; service_type: string; selling_price: number;
  actual_price: number; is_active: boolean; main_image: string; created_at: string;
  _count: { orders: number };
};

type Order = {
  id: string; status: string; event_date: string; created_at: string; message: string;
  vendor_services: { name: string; service_type: string; selling_price: number };
  users: { full_name: string; phone: string; email: string };
  vendors: { business_name: string; phone: string };
};

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pending:   { bg: "#fef3c7", color: "#d97706" },
  confirmed: { bg: "#dcfce7", color: "#16a34a" },
  rejected:  { bg: "#fee2e2", color: "#ef4444" },
};

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"stats" | "vendors" | "orders">("stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendorServices, setVendorServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    if (JSON.parse(u).role !== "admin") { router.push("/dashboard"); return; }
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function fetchVendors() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/vendors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(await res.json());
    } catch { setVendors([]); }
    setLoading(false);
  }

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch { setOrders([]); }
    setLoading(false);
  }

  async function openVendorServices(vendor: Vendor) {
    setSelectedVendor(vendor);
    setLoadingServices(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/vendors/${vendor.id}/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendorServices(await res.json());
    } catch { setVendorServices([]); }
    setLoadingServices(false);
  }

  async function deleteVendor(id: string, name: string) {
    if (!confirm(`"${name}" ko delete karein? Uski saari services aur orders bhi delete ho jayenge.`)) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/vendors/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    setVendors(prev => prev.filter(v => v.id !== id));
    if (selectedVendor?.id === id) setSelectedVendor(null);
  }

  async function deleteService(id: string, name: string) {
    if (!confirm(`"${name}" service delete karein?`)) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/services/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    setVendorServices(prev => prev.filter(s => s.id !== id));
    // update vendor count
    setVendors(prev => prev.map(v =>
      v.id === selectedVendor?.id
        ? { ...v, _count: { ...v._count, vendor_services: v._count.vendor_services - 1 } }
        : v
    ));
  }

  function switchTab(t: "stats" | "vendors" | "orders") {
    setTab(t);
    setSelectedVendor(null);
    if (t === "vendors" && vendors.length === 0) fetchVendors();
    if (t === "orders" && orders.length === 0) fetchOrders();
    if (t === "stats") fetchStats();
  }

  const cardStyle = (active: boolean) => ({
    padding: "10px 22px", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer",
    border: "none", background: active ? "#b5451b" : "#f0f0f0", color: active ? "#fff" : "#555",
  });

  return (
    <div style={{ minHeight: "80vh", background: "#f5f5f5", padding: "32px 20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: "#b5451b", borderRadius: 16, padding: "24px 32px", color: "#fff", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>⚙️ Admin Panel</p>
            <h1 style={{ fontSize: 26, fontWeight: 900 }}>ShaadiSetup Admin</h1>
          </div>
          <Link href="/dashboard" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.3)" }}>
            ← Dashboard
          </Link>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <button style={cardStyle(tab === "stats")} onClick={() => switchTab("stats")}>📊 Overview</button>
          <button style={cardStyle(tab === "vendors")} onClick={() => switchTab("vendors")}>🏪 Vendors</button>
          <button style={cardStyle(tab === "orders")} onClick={() => switchTab("orders")}>📋 Orders</button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>लोड हो रहा है...</div>
        ) : (
          <>
            {/* STATS TAB */}
            {tab === "stats" && stats && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
                {[
                  { label: "कुल Vendors", value: stats.totalVendors, icon: "🏪" },
                  { label: "कुल Users", value: stats.totalUsers, icon: "👤" },
                  { label: "कुल Services", value: stats.totalServices, icon: "🛎️" },
                  { label: "कुल Orders", value: stats.totalOrders, icon: "📋" },
                  { label: "Pending Orders", value: stats.pendingOrders, icon: "⏳" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "24px 20px", textAlign: "center", border: "1.5px solid #eee" }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: "#b5451b" }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: "#777", marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* VENDORS TAB */}
            {tab === "vendors" && (
              <div style={{ display: "grid", gridTemplateColumns: selectedVendor ? "1fr 1fr" : "1fr", gap: 20 }}>
                {/* Vendors List */}
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14, color: "#111" }}>
                    सभी Vendors ({vendors.length})
                  </h2>
                  {vendors.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 40, background: "#fff", borderRadius: 12, color: "#aaa" }}>कोई vendor नहीं मिला</div>
                  ) : vendors.map(v => (
                    <div key={v.id} style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", marginBottom: 12, border: selectedVendor?.id === v.id ? "2px solid #b5451b" : "1.5px solid #eee", cursor: "pointer" }}
                      onClick={() => openVendorServices(v)}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 16, color: "#111" }}>{v.business_name}</div>
                          <div style={{ fontSize: 13, color: "#777", marginTop: 2 }}>{v.user.full_name} · {v.user.email}</div>
                          <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>{v.district}, {v.block}</div>
                          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                            <span style={{ background: "#f0f0f0", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                              🛎️ {v._count.vendor_services} services
                            </span>
                            <span style={{ background: "#f0f0f0", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                              📋 {v._count.orders} orders
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); deleteVendor(v.id, v.business_name); }}
                          style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "7px 14px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vendor Services Panel */}
                {selectedVendor && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111" }}>
                        {selectedVendor.business_name} की Services
                      </h2>
                      <button onClick={() => setSelectedVendor(null)} style={{ background: "#f0f0f0", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>✕</button>
                    </div>
                    {loadingServices ? (
                      <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>लोड हो रहा है...</div>
                    ) : vendorServices.length === 0 ? (
                      <div style={{ textAlign: "center", padding: 40, background: "#fff", borderRadius: 12, color: "#aaa" }}>कोई service नहीं है</div>
                    ) : vendorServices.map(s => (
                      <div key={s.id} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", marginBottom: 10, border: "1.5px solid #eee", display: "flex", gap: 12, alignItems: "center" }}>
                        {s.main_image && (
                          <img src={s.main_image} alt={s.name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: 15, color: "#111" }}>{s.name}</div>
                          <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>{s.service_type}</div>
                          <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#b5451b" }}>₹{s.selling_price.toLocaleString()}</span>
                            <span style={{ background: "#f0f0f0", padding: "2px 8px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                              📋 {s._count.orders} orders
                            </span>
                            <span style={{ background: s.is_active ? "#dcfce7" : "#fee2e2", color: s.is_active ? "#16a34a" : "#ef4444", padding: "2px 8px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                              {s.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteService(s.id, s.name)}
                          style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "7px 12px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0 }}>
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ORDERS TAB */}
            {tab === "orders" && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14, color: "#111" }}>
                  सभी Orders ({orders.length})
                </h2>
                {orders.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 16, color: "#aaa" }}>कोई order नहीं मिला</div>
                ) : orders.map(o => (
                  <div key={o.id} style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", marginBottom: 12, border: "1.5px solid #eee" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: "#111" }}>{o.vendor_services.name}</div>
                        <div style={{ fontSize: 13, color: "#777", marginTop: 2 }}>
                          🏪 {o.vendors.business_name} · ₹{o.vendor_services.selling_price.toLocaleString()}
                        </div>
                        <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
                          👤 {o.users.full_name} · 📞 {o.users.phone}
                        </div>
                        <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>
                          📅 Event: {new Date(o.event_date).toLocaleDateString("hi-IN")}
                        </div>
                        {o.message && <div style={{ fontSize: 12, color: "#888", marginTop: 4, fontStyle: "italic" }}>"{o.message}"</div>}
                      </div>
                      <span style={{ background: STATUS_STYLE[o.status]?.bg || "#f0f0f0", color: STATUS_STYLE[o.status]?.color || "#555", padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                        {o.status === "pending" ? "⏳ Pending" : o.status === "confirmed" ? "✅ Confirmed" : "❌ Rejected"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
