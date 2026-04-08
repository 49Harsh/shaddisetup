"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type ServiceDetail = {
  id: string; service_type: string; name: string;
  actual_price: number; selling_price: number; description: string;
  main_image: string; images: string[]; is_active: boolean;
  vendor: {
    id?: string;
    business_name: string; phone: string; district: string; block: string;
    experience_years?: number; experience_desc?: string; working_hours?: string;
  };
};

type RatingData = {
  avg: number; count: number;
  ratings: { id: string; rating: number; review: string; created_at: string; users: { full_name: string } }[];
};

const ICONS: Record<string, string> = { DJ: "🎵", Catering: "🍽️", Decoration: "🌸", Mehndi: "🎨" };

function StarDisplay({ avg, big }: { avg: number; big?: boolean }) {
  const size = big ? 18 : 14;
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: size, color: i <= Math.round(avg) ? "#f59e0b" : "#ddd" }}>★</span>
      ))}
    </span>
  );
}

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [activeImg, setActiveImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState("");
  const [ratingMsg, setRatingMsg] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d) d.vendor = d.vendor || d.vendors || {};
        setService(d);
        setActiveImg(d.main_image || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch ratings
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ratings/${id}`)
      .then(r => r.json())
      .then(d => setRatingData(d))
      .catch(() => {});
  }, [id]);

  async function submitRating(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { setRatingMsg("Rating देने के लिए पहले Login करें।"); return; }
    if (myRating < 1 || myRating > 5) { setRatingMsg("1-5 के बीच rating दें।"); return; }
    setRatingLoading(true); setRatingMsg("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ service_id: id, rating: myRating, review: myReview }),
      });
      const data = await res.json();
      if (data.id) {
        setRatingMsg("✅ आपकी rating save हो गई!");
        // Refresh ratings
        const rd = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ratings/${id}`).then(r => r.json());
        setRatingData(rd);
      } else {
        setRatingMsg(data.error || "Error saving rating.");
      }
    } catch { setRatingMsg("Server से connect नहीं हो पाया।"); }
    setRatingLoading(false);
  }

  if (loading) return <div style={{ textAlign: "center", padding: 80, color: "#aaa", fontSize: 18 }}>लोड हो रहा है...</div>;
  if (!service) return <div style={{ textAlign: "center", padding: 80 }}>Service नहीं मिली।</div>;

  const allImgs = [service.main_image, ...service.images].filter(Boolean);
  const disc = Math.round(((service.actual_price - service.selling_price) / service.actual_price) * 100);

  return (
    <div style={{ background: "#f5f5f5", minHeight: "80vh", padding: "32px 20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Breadcrumb */}
        <p style={{ fontSize: 14, color: "#888", marginBottom: 20 }}>
          <Link href="/" style={{ color: "#b5451b", textDecoration: "none" }}>होम</Link> →{" "}
          <Link href={`/services/${service.service_type.toLowerCase()}`} style={{ color: "#b5451b", textDecoration: "none" }}>{service.service_type}</Link> →{" "}
          {service.name}
        </p>

        <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1.5px solid #eee" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="detail-grid">

            {/* Left — Images */}
            <div>
              <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 12, background: "#f5f5f5", height: 360, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {activeImg
                  ? <img src={activeImg} alt={service.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontSize: 80 }}>{ICONS[service.service_type] || "📦"}</span>}
              </div>
              {allImgs.length > 1 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {allImgs.map((img, i) => (
                    <img key={i} src={img} alt="" onClick={() => setActiveImg(img)}
                      style={{ width: 68, height: 68, objectFit: "cover", borderRadius: 8, cursor: "pointer", border: activeImg === img ? "2px solid #b5451b" : "2px solid #eee" }} />
                  ))}
                </div>
              )}
            </div>

            {/* Right — Details */}
            <div>
              <span style={{ fontSize: 13, background: "#f5f5f5", color: "#555", padding: "3px 12px", borderRadius: 20, fontWeight: 600 }}>
                {ICONS[service.service_type]} {service.service_type}
              </span>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111", margin: "12px 0 8px" }}>{service.name}</h1>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>
                🏪 {service.vendor?.business_name || "Unknown"} · 📍 {service.vendor?.district || "Unknown"}, {service.vendor?.block || "Unknown"}
              </p>

              {/* Rating Summary */}
              {ratingData && ratingData.count > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, background: "#fffbf0", borderRadius: 8, padding: "8px 14px", border: "1px solid #fde68a" }}>
                  <StarDisplay avg={ratingData.avg} big />
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#b45309" }}>{ratingData.avg.toFixed(1)}</span>
                  <span style={{ fontSize: 13, color: "#888" }}>({ratingData.count} ratings)</span>
                </div>
              )}

              {/* Price Box */}
              <div style={{ background: "#f9f9f9", borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: "#b5451b" }}>₹{service.selling_price.toLocaleString()}</span>
                  {disc > 0 && <span style={{ fontSize: 13, background: "#dcfce7", color: "#16a34a", padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>{disc}% OFF</span>}
                </div>
                <p style={{ fontSize: 14, color: "#aaa" }}>
                  MRP: <span style={{ textDecoration: "line-through" }}>₹{service.actual_price.toLocaleString()}</span>
                  {disc > 0 && <span style={{ color: "#16a34a", marginLeft: 8 }}>₹{(service.actual_price - service.selling_price).toLocaleString()} की बचत</span>}
                </p>
              </div>

              {/* Vendor Info */}
              <div style={{ background: "#f9f9f9", borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
                {service.vendor?.working_hours && (
                  <p style={{ fontSize: 14, color: "#555", marginBottom: 6 }}>
                    🕐 <strong>Working Hours:</strong> {service.vendor.working_hours}
                  </p>
                )}
                {service.vendor?.experience_years && (
                  <p style={{ fontSize: 14, color: "#555", marginBottom: 6 }}>
                    🏆 <strong>Experience:</strong> {service.vendor.experience_years} साल से Business में
                  </p>
                )}
                {service.vendor?.experience_desc && (
                  <p style={{ fontSize: 13, color: "#777" }}>{service.vendor.experience_desc}</p>
                )}
              </div>

              {/* Description */}
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111", marginBottom: 8 }}>Service के बारे में</h3>
              <p style={{ fontSize: 15, color: "#555", lineHeight: 1.8, marginBottom: 24 }}>{service.description}</p>

              {/* CTA */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href={`https://wa.me/91${service.vendor?.phone || ""}?text=नमस्ते! मुझे "${service.name}" service के बारे में जानकारी चाहिए।`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ background: "#25D366", color: "#fff", padding: 14, borderRadius: 10, fontWeight: 800, fontSize: 16, textDecoration: "none", textAlign: "center" }}>
                  💬 WhatsApp पर Book करें
                </a>
                <a href={`tel:+91${service.vendor?.phone || ""}`}
                  style={{ background: "#f5f5f5", color: "#333", padding: 14, borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: "none", textAlign: "center", border: "1.5px solid #eee" }}>
                  📞 Call करें
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings Section */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1.5px solid #eee", marginTop: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#111", marginBottom: 20 }}>⭐ Customer Reviews</h2>

          {/* Rating Form */}
          <form onSubmit={submitRating} style={{ background: "#f9f9f9", borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#333", marginBottom: 12 }}>अपनी Rating दें:</p>
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              {[1,2,3,4,5].map(star => (
                <button key={star} type="button" onClick={() => setMyRating(star)}
                  style={{ fontSize: 28, background: "none", border: "none", cursor: "pointer", color: star <= myRating ? "#f59e0b" : "#ddd", transition: "color 0.15s" }}>
                  ★
                </button>
              ))}
              {myRating > 0 && <span style={{ fontSize: 14, color: "#888", alignSelf: "center" }}>{myRating}/5</span>}
            </div>
            <textarea value={myReview} onChange={e => setMyReview(e.target.value)}
              placeholder="अपना अनुभव लिखें (optional)..."
              rows={3}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, boxSizing: "border-box" as const, marginBottom: 10, resize: "vertical" }} />
            {ratingMsg && <p style={{ color: ratingMsg.startsWith("✅") ? "#16a34a" : "red", fontSize: 13, marginBottom: 8 }}>{ratingMsg}</p>}
            <button type="submit" disabled={ratingLoading || myRating === 0}
              style={{ background: myRating > 0 ? "#b5451b" : "#ccc", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700, cursor: myRating > 0 ? "pointer" : "not-allowed", fontSize: 15 }}>
              {ratingLoading ? "सेव हो रहा है..." : "Rating Submit करें"}
            </button>
          </form>

          {/* Existing Ratings */}
          {ratingData && ratingData.ratings.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ratingData.ratings.map(r => (
                <div key={r.id} style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ background: "#b5451b", color: "#fff", borderRadius: "50%", width: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>
                      {(r.users?.full_name || "U").charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#111", margin: 0 }}>{r.users?.full_name || "Anonymous"}</p>
                      <StarDisplay avg={r.rating} />
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: 12, color: "#aaa" }}>
                      {new Date(r.created_at).toLocaleDateString("hi-IN")}
                    </span>
                  </div>
                  {r.review && <p style={{ fontSize: 14, color: "#555", margin: "6px 0 0 42px" }}>{r.review}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#aaa", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
              अभी कोई review नहीं है। पहले review दें!
            </p>
          )}
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
