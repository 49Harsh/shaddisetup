"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type ServiceDetail = {
  id: string; service_type: string; name: string;
  actual_price: number; selling_price: number; description: string;
  main_image: string; images: string[];
  vendors: { business_name: string; phone: string; district: string; block: string };
};

const ICONS: Record<string, string> = { DJ: "🎵", Catering: "🍽️", Decoration: "🌸", Mehndi: "🎨" };

export default function ServiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [showOrder, setShowOrder] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [orderMsg, setOrderMsg] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`)
      .then(r => r.json())
      .then(d => { setService(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    if (!eventDate) { setOrderMsg("Event date select karein."); return; }
    setOrdering(true); setOrderMsg("");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ service_id: id, event_date: eventDate, message }),
    });
    const data = await res.json();
    if (data.id) { setOrderSuccess(true); }
    else setOrderMsg(data.error || "Kuch galat hua.");
    setOrdering(false);
  }

  if (loading) return <div style={{ textAlign: "center", padding: 80, color: "#aaa", fontSize: 18 }}>लोड हो रहा है...</div>;
  if (!service) return <div style={{ textAlign: "center", padding: 80 }}>Service नहीं मिली।</div>;

  const allImgs = [service.main_image, ...service.images].filter(Boolean);
  const disc = Math.round(((service.actual_price - service.selling_price) / service.actual_price) * 100);

  return (
    <div style={{ background: "#f5f5f5", minHeight: "80vh", padding: "24px 20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Breadcrumb */}
        <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
          <Link href="/browse" style={{ color: "#b5451b", textDecoration: "none" }}>सभी Services</Link> → {service.service_type} → {service.name}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, background: "#fff", borderRadius: 16, padding: 28, border: "1.5px solid #eee" }} className="detail-grid">

          {/* LEFT — Image Slider */}
          <div>
            {/* Main Image */}
            <div style={{ borderRadius: 12, overflow: "hidden", background: "#f5f5f5", height: 380, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", marginBottom: 12 }}>
              {allImgs.length > 0 && allImgs[imgIdx]
                ? <img src={allImgs[imgIdx]} alt={service.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 80 }}>{ICONS[service.service_type] || "📦"}</span>}

              {/* Left/Right Arrows */}
              {allImgs.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i - 1 + allImgs.length) % allImgs.length)}
                    style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.45)", color: "#fff", border: "none", borderRadius: "50%", width: 40, height: 40, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    ‹
                  </button>
                  <button onClick={() => setImgIdx(i => (i + 1) % allImgs.length)}
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.45)", color: "#fff", border: "none", borderRadius: "50%", width: 40, height: 40, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    ›
                  </button>
                  {/* Dots */}
                  <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
                    {allImgs.map((_, i) => (
                      <div key={i} onClick={() => setImgIdx(i)}
                        style={{ width: 8, height: 8, borderRadius: "50%", background: i === imgIdx ? "#b5451b" : "rgba(255,255,255,0.7)", cursor: "pointer" }} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImgs.length > 1 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {allImgs.map((img, i) => (
                  <img key={i} src={img} alt="" onClick={() => setImgIdx(i)}
                    style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, cursor: "pointer", border: i === imgIdx ? "2px solid #b5451b" : "2px solid #eee" }} />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Details */}
          <div>
            <span style={{ fontSize: 12, background: "#f5f5f5", color: "#555", padding: "3px 12px", borderRadius: 20, fontWeight: 600 }}>
              {ICONS[service.service_type]} {service.service_type}
            </span>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#111", margin: "10px 0 6px" }}>{service.name}</h1>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>
              🏪 {service.vendors.business_name} · 📍 {service.vendors.district}, {service.vendors.block}
            </p>

            {/* Price */}
            <div style={{ background: "#f9f9f9", borderRadius: 10, padding: "14px 16px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 30, fontWeight: 900, color: "#b5451b" }}>₹{service.selling_price.toLocaleString()}</span>
                {disc > 0 && <span style={{ fontSize: 13, background: "#dcfce7", color: "#16a34a", padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>{disc}% OFF</span>}
              </div>
              {disc > 0 && (
                <p style={{ fontSize: 13, color: "#aaa" }}>
                  MRP: <span style={{ textDecoration: "line-through" }}>₹{service.actual_price.toLocaleString()}</span>
                  <span style={{ color: "#16a34a", marginLeft: 8 }}>₹{(service.actual_price - service.selling_price).toLocaleString()} की बचत</span>
                </p>
              )}
            </div>

            {/* Description */}
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111", marginBottom: 6 }}>Service के बारे में</h3>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, marginBottom: 20 }}>{service.description}</p>

            {/* CTA Buttons */}
            {!showOrder ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={() => setShowOrder(true)}
                  style={{ background: "#b5451b", color: "#fff", border: "none", padding: "14px", borderRadius: 10, fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
                  📅 अभी Book करें
                </button>
                <a href={`https://wa.me/91${service.vendors.phone}?text=नमस्ते! मुझे "${service.name}" service book करनी है।`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ background: "#25D366", color: "#fff", padding: "14px", borderRadius: 10, fontWeight: 800, fontSize: 16, textDecoration: "none", textAlign: "center" }}>
                  💬 WhatsApp पर बात करें
                </a>
              </div>
            ) : orderSuccess ? (
              <div style={{ background: "#dcfce7", borderRadius: 12, padding: "24px", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 10 }}>✅</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#16a34a", marginBottom: 6 }}>Order भेज दिया गया!</h3>
                <p style={{ fontSize: 14, color: "#555", marginBottom: 16 }}>Vendor जल्द ही confirm करेगा। WhatsApp पर भी बात कर सकते हैं।</p>
                <a href={`https://wa.me/91${service.vendors.phone}?text=नमस्ते! मैंने "${service.name}" के लिए order किया है।`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ background: "#25D366", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                  💬 WhatsApp करें
                </a>
              </div>
            ) : (
              <form onSubmit={placeOrder} style={{ background: "#f9f9f9", borderRadius: 12, padding: "20px" }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111", marginBottom: 14 }}>📅 Booking Details</h3>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#444", display: "block", marginBottom: 4 }}>Event की Date *</label>
                <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 15, marginBottom: 12, boxSizing: "border-box" }} required />

                <label style={{ fontSize: 13, fontWeight: 700, color: "#444", display: "block", marginBottom: 4 }}>Message (optional)</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="कोई खास जरूरत हो तो बताएं..."
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, marginBottom: 12, minHeight: 70, resize: "vertical", boxSizing: "border-box" }} />

                {orderMsg && <p style={{ color: "red", fontSize: 13, marginBottom: 10 }}>{orderMsg}</p>}

                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => setShowOrder(false)}
                    style={{ flex: 1, background: "#f5f5f5", color: "#333", border: "none", padding: "11px", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={ordering}
                    style={{ flex: 2, background: "#b5451b", color: "#fff", border: "none", padding: "11px", borderRadius: 8, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
                    {ordering ? "भेज रहे हैं..." : "Order Confirm करें ✓"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
