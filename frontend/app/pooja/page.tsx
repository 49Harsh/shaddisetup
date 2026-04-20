"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";

type RatingInfo = { avg: number; count: number };

type PoojaService = {
  id: string; name: string; service_type: string;
  actual_price: number; selling_price: number;
  description: string; main_image: string; images: string[];
  vendors: { business_name: string; phone: string; district: string; block: string };
  ratingInfo?: RatingInfo;
};

export const POOJA_META: Record<string, { label: string; icon: string; desc: string }> = {
  BhoomiPooja:        { label: "Bhoomi Pooja",         icon: "🏗️",  desc: "Naya ghar/dukaan shuru karne se pehle" },
  GrihaPravesh:       { label: "Griha Pravesh",         icon: "🏠",  desc: "Naye ghar mein pahli baar enter karna" },
  VastuShanti:        { label: "Vastu Shanti",          icon: "🕊️",  desc: "Ghar ki negative energy hatana" },
  VahaanPooja:        { label: "Vahaan Pooja",          icon: "🚗",  desc: "Naya vehicle kharidne pe" },
  DukaanUdghatan:     { label: "Dukaan Udghatan",       icon: "🏪",  desc: "Naya business shuru karna" },
  SatyanarayanKatha:  { label: "Satyanarayan Katha",    icon: "📖",  desc: "Har mahine ya kisi bhi khushi mein" },
  GaneshChaturthi:    { label: "Ganesh Chaturthi",      icon: "🐘",  desc: "Bhagwan Ganesh ki pooja" },
  LakshmiPooja:       { label: "Lakshmi Pooja (Diwali)",icon: "🪔",  desc: "Dhan aur samridhi ke liye" },
  NavratriPooja:      { label: "Navratri Pooja",        icon: "🌺",  desc: "9 din ki pooja" },
  MahaMrityunjayaJaap:{ label: "Maha Mrityunjaya Jaap", icon: "🔱",  desc: "Bimari se bachne ke liye" },
  KundaliMilan:       { label: "Kundali Milan",         icon: "💍",  desc: "Rishta pakka karne se pehle" },
  GrahaShanti:        { label: "Graha Shanti",          icon: "⭐",  desc: "Kundali mein dosh hatana" },
  Rudrabhishek:       { label: "Rudrabhishek",          icon: "🙏",  desc: "Shiv ji ki special pooja" },
};

const ALL_TYPES = ["सभी", ...Object.keys(POOJA_META)];
const DISTRICTS = ["सभी जिले","लखनऊ","आगरा","वाराणसी","कानपुर","इलाहाबाद","मेरठ","गोरखपुर","फैजाबाद","बरेली"];

function StarRating({ avg, count }: { avg: number; count: number }) {
  const full = Math.floor(avg);
  const half = avg - full >= 0.5;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
      <div style={{ display: "flex", gap: 1 }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{ fontSize: 13, color: i <= full ? "#f59e0b" : (i === full+1 && half ? "#f59e0b" : "#ddd") }}>★</span>
        ))}
      </div>
      <span style={{ fontSize: 12, color: "#888" }}>
        {avg > 0 ? `${avg.toFixed(1)} (${count})` : "No ratings"}
      </span>
    </div>
  );
}

export default function PoojaPage() {
  const [services, setServices] = useState<PoojaService[]>([]);
  const [filtered, setFiltered]  = useState<PoojaService[]>([]);
  const [activeType, setActiveType] = useState("सभी");
  const [search, setSearch]   = useState("");
  const [district, setDistrict] = useState("सभी जिले");
  const [sortBy, setSortBy]   = useState<"popular"|"rating"|"price_low"|"price_high">("popular");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pooja`)
      .then(r => r.json())
      .then(async (d: PoojaService[]) => {
        const list = Array.isArray(d) ? d : [];
        const withRatings = await Promise.all(
          list.map(async s => {
            try {
              const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ratings/${s.id}`);
              const rd = await r.json();
              return { ...s, ratingInfo: { avg: rd.avg || 0, count: rd.count || 0 } };
            } catch { return { ...s, ratingInfo: { avg: 0, count: 0 } }; }
          })
        );
        setServices(withRatings);
        setFiltered(withRatings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...services];
    if (activeType !== "सभी") result = result.filter(s => s.service_type === activeType);
    if (district !== "सभी जिले") result = result.filter(s => s.vendors?.district?.includes(district));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        POOJA_META[s.service_type]?.label.toLowerCase().includes(q) ||
        s.vendors?.business_name?.toLowerCase().includes(q) ||
        s.vendors?.district?.toLowerCase().includes(q)
      );
    }
    if (sortBy === "rating")     result.sort((a, b) => (b.ratingInfo?.avg||0) - (a.ratingInfo?.avg||0));
    else if (sortBy === "price_low")  result.sort((a, b) => a.selling_price - b.selling_price);
    else if (sortBy === "price_high") result.sort((a, b) => b.selling_price - a.selling_price);
    setFiltered(result);
  }, [activeType, search, district, sortBy, services]);

  return (
    <div style={{ minHeight: "80vh", background: "#fdf8f3" }}>
      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(135deg,#7c2d12 0%,#b5451b 60%,#ea7c42 100%)", padding: "36px 20px 0", color: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>
            <Link href="/" style={{ color: "#fcd9b6", textDecoration: "none" }}>होम</Link>
            {" → "}Pooja Services
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 6 }}>🙏 Pooja Services Book करें</h1>
          <p style={{ fontSize: 15, opacity: 0.85, marginBottom: 20 }}>
            Griha Pravesh से Rudrabhishek तक — अपने घर बैठे Expert Pandit Book करें
          </p>

          {/* Search + Filters */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Pooja या Pandit का नाम खोजें..."
              style={{ flex: 1, minWidth: 220, padding: "10px 16px", borderRadius: 8, border: "none", fontSize: 15, boxSizing: "border-box" as const, outline: "none" }}
            />
            <select value={district} onChange={e => setDistrict(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: 8, border: "none", fontSize: 14, background: "#fff", cursor: "pointer" }}>
              {DISTRICTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
              style={{ padding: "10px 14px", borderRadius: 8, border: "none", fontSize: 14, background: "#fff", cursor: "pointer" }}>
              <option value="popular">🔥 Popular</option>
              <option value="rating">⭐ Rating</option>
              <option value="price_low">💰 Price: Low–High</option>
              <option value="price_high">💎 Price: High–Low</option>
            </select>
          </div>

          {/* Type Tabs */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingBottom: 0, overflowX: "auto" }}>
            {ALL_TYPES.map(t => {
              const meta = POOJA_META[t];
              return (
                <button key={t} onClick={() => setActiveType(t)}
                  style={{
                    padding: "8px 16px", borderRadius: "8px 8px 0 0", border: "none",
                    fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap",
                    background: activeType === t ? "#fff" : "rgba(255,255,255,0.15)",
                    color: activeType === t ? "#b5451b" : "#fff",
                  }}>
                  {meta ? `${meta.icon} ${meta.label}` : "🌸 सभी"}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 80 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <p style={{ color: "#aaa", fontSize: 18 }}>लोड हो रहा है...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, background: "#fff", borderRadius: 16, border: "1.5px solid #eee" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🙏</div>
            <p style={{ fontSize: 18, color: "#777", marginBottom: 8 }}>कोई Pooja service नहीं मिली</p>
            <p style={{ fontSize: 14, color: "#aaa" }}>जल्द ही नए Pandit register होंगे!</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 20 }}>{filtered.length} Pooja services मिले</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 22 }}>
              {filtered.map(s => {
                const meta = POOJA_META[s.service_type] || { label: s.service_type, icon: "🙏", desc: "" };
                const disc = s.actual_price > 0 ? Math.round(((s.actual_price - s.selling_price) / s.actual_price) * 100) : 0;
                return (
                  <Link key={s.id} href={`/services/detail/${s.id}`} style={{ textDecoration: "none" }}>
                    <div
                      style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1.5px solid #f0e8df", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(181,69,27,0.13)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>

                      {/* Image */}
                      <div style={{ height: 200, background: "linear-gradient(135deg,#fdf0e0,#fce8d0)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                        {s.main_image
                          ? <img src={s.main_image} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <span style={{ fontSize: 64 }}>{meta.icon}</span>}
                        {disc > 0 && (
                          <span style={{ position: "absolute", top: 10, left: 10, background: "#b5451b", color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                            -{disc}%
                          </span>
                        )}
                        {(s.ratingInfo?.avg || 0) >= 4.5 && (
                          <span style={{ position: "absolute", top: 10, right: 10, background: "#f59e0b", color: "#fff", padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                            ⭐ Top Rated
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ padding: "14px" }}>
                        <p style={{ fontSize: 12, color: "#b5451b", fontWeight: 700, marginBottom: 2 }}>
                          {meta.icon} {meta.label}
                        </p>
                        <p style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>
                          📍 {s.vendors?.district}, {s.vendors?.block}
                        </p>
                        <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111", marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                          {s.name}
                        </h3>
                        <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>🏪 {s.vendors?.business_name}</p>
                        <StarRating avg={s.ratingInfo?.avg || 0} count={s.ratingInfo?.count || 0} />
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
                          <span style={{ fontSize: 18, fontWeight: 900, color: "#b5451b" }}>₹{s.selling_price.toLocaleString()}</span>
                          {disc > 0 && <span style={{ fontSize: 12, color: "#aaa", textDecoration: "line-through" }}>₹{s.actual_price.toLocaleString()}</span>}
                        </div>
                        <div style={{ marginTop: 10, background: "linear-gradient(90deg,#b5451b,#ea7c42)", color: "#fff", padding: "9px", borderRadius: 8, textAlign: "center", fontWeight: 700, fontSize: 13 }}>
                          🙏 Book करें →
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
