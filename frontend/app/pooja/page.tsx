"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

type RatingInfo = { avg: number; count: number };

type PoojaService = {
  id: string; name: string; service_type: string;
  actual_price: number; selling_price: number;
  description: string; main_image: string; images: string[];
  vendors: { business_name: string; phone: string; district: string; block: string; village: string | null };
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

const DISTRICTS = ["सभी जिले","लखनऊ","आगरा","वाराणसी","कानपुर","इलाहाबाद","मेरठ","गोरखपुर","फैजाबाद","बरेली"];

/* ── Custom Pooja-Type Dropdown ── */
function PoojaTypeDropdown({
  value, onChange
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedMeta = value === "सभी" ? null : POOJA_META[value];
  const displayLabel = selectedMeta
    ? `${selectedMeta.icon} ${selectedMeta.label}`
    : "🌸 सभी Pooja Types";

  return (
    <div ref={ref} style={{ position: "relative", minWidth: 220, flex: 1 }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          padding: "10px 16px",
          borderRadius: 8,
          border: "none",
          background: "#fff",
          color: "#1a1a1a",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          boxSizing: "border-box",
          boxShadow: open ? "0 0 0 2px #b5451b" : "none",
        }}
      >
        <span>{displayLabel}</span>
        <span style={{ fontSize: 11, color: "#b5451b", transition: "transform 0.2s", display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          zIndex: 999,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          border: "1.5px solid #f0e8df",
          minWidth: 280,
          maxHeight: 380,
          overflowY: "auto",
          padding: "6px 0",
        }}>
          {/* "Sabhi" option */}
          <button
            onClick={() => { onChange("सभी"); setOpen(false); }}
            style={{
              width: "100%",
              padding: "10px 16px",
              background: value === "सभी" ? "#fdf0e0" : "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              fontSize: 14,
              fontWeight: value === "सभी" ? 700 : 500,
              color: value === "सभी" ? "#b5451b" : "#333",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 18 }}>🌸</span>
            <span>सभी Pooja Types</span>
          </button>

          {/* Divider */}
          <div style={{ height: 1, background: "#f0e8df", margin: "4px 12px" }} />

          {/* Each Pooja Type */}
          {Object.entries(POOJA_META).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => { onChange(key); setOpen(false); }}
              style={{
                width: "100%",
                padding: "10px 16px",
                background: value === key ? "#fdf0e0" : "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: 14,
                fontWeight: value === key ? 700 : 500,
                color: value === key ? "#b5451b" : "#333",
                display: "flex",
                alignItems: "center",
                gap: 10,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { if (value !== key) (e.currentTarget as HTMLButtonElement).style.background = "#fdf8f3"; }}
              onMouseLeave={e => { if (value !== key) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{meta.icon}</span>
              <div>
                <div style={{ fontWeight: 700 }}>{meta.label}</div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 1 }}>{meta.desc}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Shared Select Style ── */
const selectStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "none",
  fontSize: 14,
  background: "#fff",
  color: "#1a1a1a",
  fontWeight: 600,
  cursor: "pointer",
  appearance: "none" as const,
  WebkitAppearance: "none" as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23b5451b' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: 34,
};

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
      <div style={{ background: "linear-gradient(135deg,#7c2d12 0%,#b5451b 60%,#ea7c42 100%)", padding: "36px 20px 28px", color: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>
            <Link href="/" style={{ color: "#fcd9b6", textDecoration: "none" }}>होम</Link>
            {" → "}Pooja Services
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 6 }}>🙏 Pooja Services Book करें</h1>
          <p style={{ fontSize: 15, opacity: 0.85, marginBottom: 20 }}>
            Griha Pravesh से Rudrabhishek तक — अपने घर बैठे Expert Pandit Book करें
          </p>

          {/* ── Search + Filters Row ── */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>

            {/* Search */}
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Pooja या Pandit का नाम खोजें..."
              style={{
                flex: 2, minWidth: 220,
                padding: "10px 16px", borderRadius: 8, border: "none",
                fontSize: 15, boxSizing: "border-box", outline: "none",
                color: "#1a1a1a", background: "#fff",
              }}
            />

            {/* Pooja Type Custom Dropdown */}
            <PoojaTypeDropdown value={activeType} onChange={setActiveType} />

            {/* District Select */}
            <div style={{ position: "relative" }}>
              <select
                value={district}
                onChange={e => setDistrict(e.target.value)}
                style={selectStyle}
              >
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Sort Select */}
            <div style={{ position: "relative" }}>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                style={selectStyle}
              >
                <option value="popular">🔥 Popular</option>
                <option value="rating">⭐ Rating</option>
                <option value="price_low">💰 Price: Low–High</option>
                <option value="price_high">💎 Price: High–Low</option>
              </select>
            </div>

          </div>

          {/* Active filter badge */}
          {activeType !== "सभी" && (
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, opacity: 0.85 }}>Filter:</span>
              <span style={{
                background: "rgba(255,255,255,0.25)",
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: 20,
                padding: "3px 12px",
                fontSize: 13,
                fontWeight: 700,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {POOJA_META[activeType]?.icon} {POOJA_META[activeType]?.label}
                <button
                  onClick={() => setActiveType("सभी")}
                  style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1, marginLeft: 2 }}
                >×</button>
              </span>
            </div>
          )}
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
                          📍 {s.vendors?.district}, {s.vendors?.block}{s.vendors?.village ? `, ${s.vendors.village}` : ""}
                        </p>
                        <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111", marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                          {s.name}
                        </h3>
                        <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>🕉️ {s.vendors?.business_name}</p>
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