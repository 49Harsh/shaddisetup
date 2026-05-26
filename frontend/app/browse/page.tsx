"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/langContext";
import { tr } from "@/lib/translations";

type RatingInfo = { avg: number; count: number };
type Service = {
  id: string; name: string; service_type: string;
  actual_price: number; selling_price: number;
  description: string; main_image: string; images: string[];
  vendors: { business_name: string; phone: string; district: string; block: string; village: string | null };
  ratingInfo?: RatingInfo;
};

const TYPES_EN = ["All", "DJ", "Catering", "Decoration", "Mehndi", "BhoomiPooja", "GrihaPravesh", "VastuShanti", "VahaanPooja", "DukaanUdghatan", "SatyanarayanKatha", "GaneshChaturthi", "LakshmiPooja", "NavratriPooja", "MahaMrityunjayaJaap", "KundaliMilan", "GrahaShanti", "Rudrabhishek"];
const TYPES_HI = ["सभी", "DJ", "Catering", "Decoration", "Mehndi", "BhoomiPooja", "GrihaPravesh", "VastuShanti", "VahaanPooja", "DukaanUdghatan", "SatyanarayanKatha", "GaneshChaturthi", "LakshmiPooja", "NavratriPooja", "MahaMrityunjayaJaap", "KundaliMilan", "GrahaShanti", "Rudrabhishek"];

const ICONS: Record<string, string> = { DJ: "🎵", Catering: "🍽️", Decoration: "🌸", Mehndi: "🎨", BhoomiPooja: "🏗️", GrihaPravesh: "🏠", VastuShanti: "🕊️", VahaanPooja: "🚗", DukaanUdghatan: "🏪", SatyanarayanKatha: "📖", GaneshChaturthi: "🐘", LakshmiPooja: "🪔", NavratriPooja: "🌺", MahaMrityunjayaJaap: "🔱", KundaliMilan: "💍", GrahaShanti: "⭐", Rudrabhishek: "🙏" };
const SERVICE_LABELS: Record<string, string> = { DJ: "DJ", Catering: "Catering", Decoration: "Decoration", Mehndi: "Mehndi", BhoomiPooja: "Bhoomi Pooja", GrihaPravesh: "Griha Pravesh", VastuShanti: "Vastu Shanti", VahaanPooja: "Vahaan Pooja", DukaanUdghatan: "Dukaan Udghatan", SatyanarayanKatha: "Satyanarayan Katha", GaneshChaturthi: "Ganesh Chaturthi", LakshmiPooja: "Lakshmi Pooja", NavratriPooja: "Navratri Pooja", MahaMrityunjayaJaap: "Maha Mrityunjaya Jaap", KundaliMilan: "Kundali Milan", GrahaShanti: "Graha Shanti", Rudrabhishek: "Rudrabhishek" };

const DISTRICTS_EN = ["All Districts", "Lucknow", "Agra", "Varanasi", "Kanpur", "Allahabad", "Meerut", "Gorakhpur", "Faizabad", "Bareilly"];
const DISTRICTS_HI = ["सभी जिले", "लखनऊ", "आगरा", "वाराणसी", "कानपुर", "इलाहाबाद", "मेरठ", "गोरखपुर", "फैजाबाद", "बरेली"];

function StarRating({ avg, count }: { avg: number; count: number }) {
  const full = Math.floor(avg);
  const half = avg - full >= 0.5;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
      <div style={{ display: "flex", gap: 1 }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{ fontSize: 13, color: i <= full ? "#f59e0b" : (i === full + 1 && half ? "#f59e0b" : "#ddd") }}>★</span>
        ))}
      </div>
      <span style={{ fontSize: 12, color: "#888" }}>{avg > 0 ? `${avg.toFixed(1)} (${count})` : "No ratings"}</span>
    </div>
  );
}

export default function BrowsePage() {
  const { lang } = useLang();
  const t = (k: { en: string; hi: string }) => k[lang];
  const TYPES = lang === "en" ? TYPES_EN : TYPES_HI;
  const DISTRICTS = lang === "en" ? DISTRICTS_EN : DISTRICTS_HI;

  const [services, setServices] = useState<Service[]>([]);
  const [filtered, setFiltered] = useState<Service[]>([]);
  const [activeType, setActiveType] = useState(TYPES[0]);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [sortBy, setSortBy] = useState<"popular"|"rating"|"price_low"|"price_high">("popular");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`)
      .then(r => r.json())
      .then(async (d: Service[]) => {
        const list = Array.isArray(d) ? d : [];
        const withRatings = await Promise.all(list.map(async s => {
          try {
            const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ratings/${s.id}`);
            const rd = await r.json();
            return { ...s, ratingInfo: { avg: rd.avg || 0, count: rd.count || 0 } };
          } catch { return { ...s, ratingInfo: { avg: 0, count: 0 } }; }
        }));
        setServices(withRatings); setFiltered(withRatings); setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Reset filters when language changes
    setActiveType(TYPES[0]);
    setDistrict(DISTRICTS[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    let result = [...services];
    const isAll = activeType === "All" || activeType === "सभी";
    if (!isAll) result = result.filter(s => s.service_type === activeType);
    const isAllDist = district === "All Districts" || district === "सभी जिले";
    if (!isAllDist) {
      const distMap: Record<string, string> = { "Lucknow": "लखनऊ", "Agra": "आगरा", "Varanasi": "वाराणसी", "Kanpur": "कानपुर", "Allahabad": "इलाहाबाद", "Meerut": "मेरठ", "Gorakhpur": "गोरखपुर", "Faizabad": "फैजाबाद", "Bareilly": "बरेली" };
      const searchDist = distMap[district] || district;
      result = result.filter(s => s.vendors?.district?.includes(district) || s.vendors?.district?.includes(searchDist));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.vendors?.business_name?.toLowerCase().includes(q) || s.vendors?.district?.toLowerCase().includes(q) || s.vendors?.block?.toLowerCase().includes(q));
    }
    if (sortBy === "rating") result.sort((a, b) => (b.ratingInfo?.avg||0) - (a.ratingInfo?.avg||0));
    else if (sortBy === "price_low") result.sort((a, b) => a.selling_price - b.selling_price);
    else if (sortBy === "price_high") result.sort((a, b) => b.selling_price - a.selling_price);
    setFiltered(result);
  }, [activeType, search, district, sortBy, services]);

  return (
    <div style={{ minHeight: "80vh", background: "#f5f5f5" }}>
      <div style={{ background: "#fff", borderBottom: "1.5px solid #eee", padding: "20px 20px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111", marginBottom: 16 }}>{t(tr.browseTitle)}</h1>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14, alignItems: "center" }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t(tr.searchPlaceholder)}
              style={{ flex: 1, minWidth: 220, padding: "10px 16px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 15, boxSizing: "border-box" as const }} />
            <select value={district} onChange={e => setDistrict(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, background: "#fff", cursor: "pointer" }}>
              {DISTRICTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, background: "#fff", cursor: "pointer" }}>
              <option value="popular">{lang === "en" ? "🔥 Popular" : "🔥 Popular"}</option>
              <option value="rating">⭐ Rating</option>
              <option value="price_low">{lang === "en" ? "💰 Price: Low to High" : "💰 Price: Low to High"}</option>
              <option value="price_high">{lang === "en" ? "💎 Price: High to Low" : "💎 Price: High to Low"}</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingBottom: 0, overflowX: "auto" }}>
            {TYPES.map(type => {
              const key = type === "All" || type === "सभी" ? "" : type;
              return (
                <button key={type} onClick={() => setActiveType(type)}
                  style={{ padding: "8px 14px", borderRadius: "8px 8px 0 0", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", background: activeType === type ? "#b5451b" : "#f5f5f5", color: activeType === type ? "#fff" : "#555", borderBottom: activeType === type ? "2px solid #b5451b" : "2px solid transparent" }}>
                  {ICONS[key] || "🎊"} {SERVICE_LABELS[key] || type}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 80 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <p style={{ color: "#aaa", fontSize: 18 }}>{t(tr.loading)}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 18, color: "#777" }}>{t(tr.noService)}</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 16 }}>{filtered.length} {t(tr.resultsFound)}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
              {filtered.map(s => {
                const disc = Math.round(((s.actual_price - s.selling_price) / s.actual_price) * 100);
                return (
                  <Link key={s.id} href={`/services/detail/${s.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1.5px solid #eee", cursor: "pointer" }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                      <div style={{ height: 200, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                        {s.main_image ? <img src={s.main_image} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 56 }}>{ICONS[s.service_type] || "📦"}</span>}
                        {disc > 0 && <span style={{ position: "absolute", top: 10, left: 10, background: "#b5451b", color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>-{disc}%</span>}
                        {(s.ratingInfo?.avg || 0) >= 4.5 && <span style={{ position: "absolute", top: 10, right: 10, background: "#f59e0b", color: "#fff", padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>⭐ Top Rated</span>}
                      </div>
                      <div style={{ padding: "14px" }}>
                        <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{ICONS[s.service_type] || "🙏"} {SERVICE_LABELS[s.service_type] || s.service_type} · 📍 {s.vendors?.district}, {s.vendors?.block}</p>
                        <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111", marginBottom: 4 }}>{s.name}</h3>
                        <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>🏪 {s.vendors?.business_name}</p>
                        <StarRating avg={s.ratingInfo?.avg || 0} count={s.ratingInfo?.count || 0} />
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
                          <span style={{ fontSize: 18, fontWeight: 900, color: "#b5451b" }}>₹{s.selling_price.toLocaleString()}</span>
                          {disc > 0 && <span style={{ fontSize: 12, color: "#aaa", textDecoration: "line-through" }}>₹{s.actual_price.toLocaleString()}</span>}
                        </div>
                        <div style={{ marginTop: 10, background: "#b5451b", color: "#fff", padding: "8px", borderRadius: 8, textAlign: "center", fontWeight: 700, fontSize: 13 }}>
                          {t(tr.bookNow)}
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
