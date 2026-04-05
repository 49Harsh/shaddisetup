"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";

type Service = {
  id: string; name: string; service_type: string;
  actual_price: number; selling_price: number;
  description: string; main_image: string; images: string[];
  vendors: { business_name: string; phone: string; district: string; block: string };
};

const TYPES = ["सभी", "DJ", "Catering", "Decoration", "Mehndi"];
const ICONS: Record<string, string> = { DJ: "🎵", Catering: "🍽️", Decoration: "🌸", Mehndi: "🎨" };

export default function BrowsePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filtered, setFiltered] = useState<Service[]>([]);
  const [activeType, setActiveType] = useState("सभी");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`)
      .then(r => r.json())
      .then(d => { setServices(Array.isArray(d) ? d : []); setFiltered(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = services;
    if (activeType !== "सभी") result = result.filter(s => s.service_type === activeType);
    if (search.trim()) result = result.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.vendors?.business_name?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [activeType, search, services]);

  return (
    <div style={{ minHeight: "80vh", background: "#f5f5f5" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1.5px solid #eee", padding: "20px 20px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111", marginBottom: 16 }}>सभी Services देखें</h1>
          {/* Search */}
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Service या Vendor का नाम खोजें..."
            style={{ width: "100%", maxWidth: 500, padding: "10px 16px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 15, marginBottom: 16, boxSizing: "border-box" }}
          />
          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingBottom: 0 }}>
            {TYPES.map(t => (
              <button key={t} onClick={() => setActiveType(t)}
                style={{ padding: "8px 18px", borderRadius: "8px 8px 0 0", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", background: activeType === t ? "#b5451b" : "#f5f5f5", color: activeType === t ? "#fff" : "#555", borderBottom: activeType === t ? "2px solid #b5451b" : "2px solid transparent" }}>
                {ICONS[t] || "🎊"} {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "#aaa", fontSize: 18 }}>लोड हो रहा है...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 18, color: "#777" }}>कोई service नहीं मिली</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 16 }}>{filtered.length} results मिले</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
              {filtered.map(s => {
                const disc = Math.round(((s.actual_price - s.selling_price) / s.actual_price) * 100);
                return (
                  <Link key={s.id} href={`/browse/${s.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1.5px solid #eee", cursor: "pointer", transition: "box-shadow 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)")}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
                      {/* Image */}
                      <div style={{ height: 200, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                        {s.main_image
                          ? <img src={s.main_image} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <span style={{ fontSize: 56 }}>{ICONS[s.service_type] || "📦"}</span>}
                        {disc > 0 && (
                          <span style={{ position: "absolute", top: 10, left: 10, background: "#b5451b", color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                            -{disc}%
                          </span>
                        )}
                      </div>
                      {/* Info */}
                      <div style={{ padding: "14px" }}>
                        <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{ICONS[s.service_type]} {s.service_type} · {s.vendors?.district}</p>
                        <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111", marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{s.name}</h3>
                        <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>🏪 {s.vendors?.business_name}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 18, fontWeight: 900, color: "#b5451b" }}>₹{s.selling_price.toLocaleString()}</span>
                          {disc > 0 && <span style={{ fontSize: 12, color: "#aaa", textDecoration: "line-through" }}>₹{s.actual_price.toLocaleString()}</span>}
                        </div>
                        <div style={{ marginTop: 10, background: "#b5451b", color: "#fff", padding: "8px", borderRadius: 8, textAlign: "center", fontWeight: 700, fontSize: 13 }}>
                          Book करें →
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
