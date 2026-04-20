"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SERVICE_TYPES = [
  "DJ", "Catering", "Decoration", "Mehndi",
  "BhoomiPooja", "GrihaPravesh", "VastuShanti", "VahaanPooja",
  "DukaanUdghatan", "SatyanarayanKatha", "GaneshChaturthi", "LakshmiPooja",
  "NavratriPooja", "MahaMrityunjayaJaap", "KundaliMilan", "GrahaShanti", "Rudrabhishek",
];
const ICONS: Record<string, string> = {
  DJ: "🎵", Catering: "🍽️", Decoration: "🌸", Mehndi: "🎨",
  BhoomiPooja: "🏗️", GrihaPravesh: "🏠", VastuShanti: "🕊️", VahaanPooja: "🚗",
  DukaanUdghatan: "🏪", SatyanarayanKatha: "📖", GaneshChaturthi: "🐘",
  LakshmiPooja: "🪔", NavratriPooja: "🌺", MahaMrityunjayaJaap: "🔱",
  KundaliMilan: "💍", GrahaShanti: "⭐", Rudrabhishek: "🙏",
};
const SERVICE_LABELS: Record<string, string> = {
  DJ: "DJ", Catering: "Catering", Decoration: "Decoration", Mehndi: "Mehndi",
  BhoomiPooja: "Bhoomi Pooja", GrihaPravesh: "Griha Pravesh", VastuShanti: "Vastu Shanti",
  VahaanPooja: "Vahaan Pooja", DukaanUdghatan: "Dukaan Udghatan",
  SatyanarayanKatha: "Satyanarayan Katha", GaneshChaturthi: "Ganesh Chaturthi",
  LakshmiPooja: "Lakshmi Pooja (Diwali)", NavratriPooja: "Navratri Pooja",
  MahaMrityunjayaJaap: "Maha Mrityunjaya Jaap", KundaliMilan: "Kundali Milan",
  GrahaShanti: "Graha Shanti", Rudrabhishek: "Rudrabhishek",
};

type Service = {
  id: string; service_type: string; name: string;
  actual_price: number; selling_price: number; description: string;
  main_image: string; images: string[]; is_active: boolean;
};

type FormState = {
  service_type: string; name: string;
  actual_price: string; selling_price: string; description: string;
};

export default function VendorServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const [form, setForm] = useState<FormState>({ service_type: "", name: "", actual_price: "", selling_price: "", description: "" });
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState("");
  const [extraFiles, setExtraFiles] = useState<File[]>([]);
  const [extraPreviews, setExtraPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const mainRef = useRef<HTMLInputElement>(null);
  const extraRef = useRef<HTMLInputElement>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    if (JSON.parse(u).role !== "vendor") { router.push("/dashboard"); return; }
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/vendor/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch { setServices([]); }
    setLoading(false);
  }

  function openAdd() {
    setEditService(null);
    setForm({ service_type: "", name: "", actual_price: "", selling_price: "", description: "" });
    setMainFile(null); setMainPreview(""); setExtraFiles([]); setExtraPreviews([]);
    setMsg(""); setShowForm(true);
  }

  function openEdit(s: Service) {
    setEditService(s);
    setForm({ service_type: s.service_type, name: s.name, actual_price: String(s.actual_price), selling_price: String(s.selling_price), description: s.description });
    setMainFile(null); setMainPreview(s.main_image);
    setExtraFiles([]); setExtraPreviews(s.images);
    setMsg(""); setShowForm(true);
  }

  function handleMainImg(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!["image/png", "image/jpeg"].includes(f.type)) { setMsg("केवल PNG/JPG allowed है।"); return; }
    setMainFile(f); setMainPreview(URL.createObjectURL(f));
  }

  function handleExtraImgs(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).filter(f => ["image/png", "image/jpeg"].includes(f.type));
    const newFiles = [...extraFiles, ...files].slice(0, 5);
    const newPreviews = [...extraPreviews, ...files.map(f => URL.createObjectURL(f))].slice(0, 5);
    setExtraFiles(newFiles); setExtraPreviews(newPreviews);
  }

  function removeExtra(i: number) {
    setExtraFiles(p => p.filter((_, idx) => idx !== i));
    setExtraPreviews(p => p.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.service_type || !form.name || !form.actual_price || !form.selling_price || !form.description) {
      setMsg("सभी fields भरें।"); return;
    }
    setSaving(true); setMsg("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (mainFile) fd.append("main_image", mainFile);
    extraFiles.forEach(f => fd.append("images", f));

    const url = editService
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/services/${editService.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/services`;

    const res = await fetch(url, { method: editService ? "PUT" : "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
    const data = await res.json();
    if (data.id) { setShowForm(false); fetchServices(); }
    else setMsg(data.error || "Kuch galat hua.");
    setSaving(false);
  }

  async function toggleService(id: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}/toggle`, {
      method: "PATCH", headers: { Authorization: `Bearer ${token}` },
    });
    fetchServices();
  }

  async function deleteService(id: string) {
    if (!confirm("Service delete karein?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    fetchServices();
  }

  const inp = { width: "100%", padding: "11px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 15, boxSizing: "border-box" as const, marginBottom: 14 };
  const lbl = { fontSize: 13, fontWeight: 700 as const, color: "#444", display: "block" as const, marginBottom: 4 };

  return (
    <div style={{ minHeight: "80vh", background: "#f5f5f5", padding: "32px 20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <Link href="/dashboard" style={{ color: "#b5451b", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>← Dashboard</Link>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#111", marginTop: 4 }}>मेरी Services</h1>
            <p style={{ color: "#777", fontSize: 14 }}>{services.length} service{services.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={openAdd}
            style={{ background: "#b5451b", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
            + Service Add करें
          </button>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>लोड हो रहा है...</div>
        ) : services.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 16, border: "1.5px solid #eee" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>📦</div>
            <p style={{ fontSize: 18, color: "#777", marginBottom: 20 }}>अभी कोई service नहीं है</p>
            <button onClick={openAdd} style={{ background: "#b5451b", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
              पहली Service Add करें
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {services.map(s => {
              const disc = Math.round(((s.actual_price - s.selling_price) / s.actual_price) * 100);
              return (
                <div key={s.id} style={{ background: "#fff", borderRadius: 16, border: `2px solid ${s.is_active ? "#eee" : "#fecaca"}`, overflow: "hidden" }}>
                  {/* Status */}
                  <div style={{ position: "relative" }}>
                    <div style={{ height: 180, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      {s.main_image
                        ? <img src={s.main_image} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ fontSize: 56 }}>{ICONS[s.service_type] || "📦"}</span>}
                    </div>
                    <span style={{ position: "absolute", top: 10, left: 10, background: s.is_active ? "#22c55e" : "#ef4444", color: "#fff", padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                      {s.is_active ? "✓ Active" : "✕ Inactive"}
                    </span>
                    {disc > 0 && <span style={{ position: "absolute", top: 10, right: 10, background: "#b5451b", color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{disc}% OFF</span>}
                  </div>

                  <div style={{ padding: 16 }}>
                    <span style={{ fontSize: 12, background: "#f5f5f5", color: "#555", padding: "2px 10px", borderRadius: 20, fontWeight: 600 }}>{ICONS[s.service_type] || "🙏"} {SERVICE_LABELS[s.service_type] || s.service_type}</span>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: "#111", margin: "8px 0 4px" }}>{s.name}</h3>
                    <p style={{ fontSize: 13, color: "#777", marginBottom: 10, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{s.description}</p>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 20, fontWeight: 900, color: "#b5451b" }}>₹{s.selling_price.toLocaleString()}</span>
                      <span style={{ fontSize: 13, color: "#aaa", textDecoration: "line-through" }}>₹{s.actual_price.toLocaleString()}</span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <Link href={`/services/detail/${s.id}`} style={{ flex: 1, background: "#f5f5f5", color: "#333", padding: "8px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none", textAlign: "center" }}>👁 देखें</Link>
                      <button onClick={() => openEdit(s)} style={{ flex: 1, background: "#f5f5f5", color: "#333", border: "none", padding: "8px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>✏️ Edit</button>
                      <button onClick={() => toggleService(s.id)} style={{ flex: 1, background: s.is_active ? "#fef3c7" : "#dcfce7", color: s.is_active ? "#d97706" : "#16a34a", border: "none", padding: "8px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                        {s.is_active ? "⏸ Off" : "▶ On"}
                      </button>
                      <button onClick={() => deleteService(s.id)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "8px 12px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🗑</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "92vh", overflowY: "auto", padding: "28px" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#111" }}>{editService ? "Service Edit करें" : "नई Service Add करें"}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "#f5f5f5", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Service Type */}
              <label style={lbl}>Service Type *</label>
              <select style={inp} value={form.service_type} onChange={e => setForm({ ...form, service_type: e.target.value })} required>
                <option value="">-- Select Service Type --</option>
                <optgroup label="Wedding Services">
                  {["DJ","Catering","Decoration","Mehndi"].map(t => (
                    <option key={t} value={t}>{ICONS[t]} {SERVICE_LABELS[t]}</option>
                  ))}
                </optgroup>
                <optgroup label="Pooja Services">
                  {["BhoomiPooja","GrihaPravesh","VastuShanti","VahaanPooja",
                    "DukaanUdghatan","SatyanarayanKatha","GaneshChaturthi","LakshmiPooja",
                    "NavratriPooja","MahaMrityunjayaJaap","KundaliMilan","GrahaShanti","Rudrabhishek"
                  ].map(t => (
                    <option key={t} value={t}>{ICONS[t]} {SERVICE_LABELS[t]}</option>
                  ))}
                </optgroup>
              </select>

              {/* Name */}
              <label style={lbl}>Service का नाम *</label>
              <input style={inp} placeholder="जैसे: Mukesh Band Baja, Anita Tiffin Service" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />

              {/* Prices */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={lbl}>Actual Price (₹) *</label>
                  <input style={inp} type="number" placeholder="15000" value={form.actual_price} onChange={e => setForm({ ...form, actual_price: e.target.value })} required />
                </div>
                <div>
                  <label style={lbl}>Selling Price (₹) *</label>
                  <input style={inp} type="number" placeholder="12000" value={form.selling_price} onChange={e => setForm({ ...form, selling_price: e.target.value })} required />
                </div>
              </div>
              {form.actual_price && form.selling_price && +form.actual_price > +form.selling_price && (
                <p style={{ fontSize: 13, color: "#16a34a", fontWeight: 700, marginTop: -8, marginBottom: 14 }}>
                  ✓ {Math.round(((+form.actual_price - +form.selling_price) / +form.actual_price) * 100)}% discount मिलेगा
                </p>
              )}

              {/* Description */}
              <label style={lbl}>Description *</label>
              <textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} placeholder="अपनी service के बारे में बताएं..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />

              {/* Main Image */}
              <label style={lbl}>Main Photo * (PNG/JPG)</label>
              <div onClick={() => mainRef.current?.click()} style={{ border: "2px dashed #ddd", borderRadius: 10, padding: 16, textAlign: "center", cursor: "pointer", marginBottom: 14, background: "#fafafa", minHeight: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {mainPreview
                  ? <img src={mainPreview} alt="main" style={{ maxHeight: 130, borderRadius: 8, objectFit: "cover" }} />
                  : <div><div style={{ fontSize: 32, marginBottom: 4 }}>📷</div><p style={{ fontSize: 13, color: "#888" }}>Click करके Main Photo upload करें</p></div>}
              </div>
              <input ref={mainRef} type="file" accept="image/png,image/jpeg" style={{ display: "none" }} onChange={handleMainImg} />

              {/* Extra Images */}
              <label style={lbl}>Extra Photos (max 5, PNG/JPG)</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                {extraPreviews.map((src, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img src={src} alt="" style={{ width: 68, height: 68, objectFit: "cover", borderRadius: 8, border: "1.5px solid #eee" }} />
                    <button type="button" onClick={() => removeExtra(i)} style={{ position: "absolute", top: -6, right: -6, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: 11, cursor: "pointer" }}>✕</button>
                  </div>
                ))}
                {extraPreviews.length < 5 && (
                  <div onClick={() => extraRef.current?.click()} style={{ width: 68, height: 68, border: "2px dashed #ddd", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 24, color: "#aaa" }}>+</div>
                )}
              </div>
              <input ref={extraRef} type="file" accept="image/png,image/jpeg" multiple style={{ display: "none" }} onChange={handleExtraImgs} />

              {msg && <p style={{ color: "red", fontSize: 13, marginBottom: 12 }}>{msg}</p>}

              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, background: "#f5f5f5", color: "#333", border: "none", borderRadius: 10, padding: 13, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex: 2, background: "#b5451b", color: "#fff", border: "none", borderRadius: 10, padding: 13, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                  {saving ? "Save हो रहा है..." : editService ? "Update करें ✓" : "Service Add करें ✓"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
