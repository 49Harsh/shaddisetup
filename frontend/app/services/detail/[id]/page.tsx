"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type ServiceDetail = {
  id: string; service_type: string; name: string;
  actual_price: number; selling_price: number; description: string;
  main_image: string; images: string[]; is_active: boolean;
  vendors: {
    id?: string;
    business_name: string; phone: string; district: string; block: string;
    experience_years?: number; experience_desc?: string; working_hours?: string;
  };
};

type RatingData = {
  avg: number; count: number;
  ratings: { id: string; rating: number; review: string; created_at: string; users: { full_name: string } }[];
};

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
  const router = useRouter();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [activeImg, setActiveImg] = useState("");
  const [loading, setLoading] = useState(true);

  // Order state
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderMsg, setOrderMsg] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Rating state
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [hasConfirmedOrder, setHasConfirmedOrder] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState("");
  const [ratingMsg, setRatingMsg] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);

  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("token");

  useEffect(() => {
    // Fetch service
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`)
      .then(r => r.json())
      .then(d => {
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

    // Check if logged-in user has a confirmed order for this service
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/check?service_id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.json())
        .then(d => setHasConfirmedOrder(!!d.hasConfirmedOrder))
        .catch(() => {});
    }
  }, [id]);

  // Place Order
  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    if (!eventDate) { setOrderMsg("Event date select करें।"); return; }
    setOrderLoading(true); setOrderMsg("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ service_id: id, event_date: eventDate, message }),
      });
      const data = await res.json();
      if (data.id) {
        setOrderSuccess(true);
        setOrderMsg("✅ Order request भेज दी गई! Vendor confirm करेगा।");
      } else {
        setOrderMsg(data.error || "Order place करने में error हुई।");
      }
    } catch { setOrderMsg("Server से connect नहीं हो पाया।"); }
    setOrderLoading(false);
  }

  // Submit Rating
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
        setRatingMsg("✅ आपकी rating save हो गई! धन्यवाद।");
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

  const vendor = service.vendors;
  const allImgs = [service.main_image, ...service.images].filter(Boolean);
  const disc = Math.round(((service.actual_price - service.selling_price) / service.actual_price) * 100);
  // Min date = today
  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={{ background: "#f5f5f5", minHeight: "80vh", padding: "32px 20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Breadcrumb */}
        <p style={{ fontSize: 14, color: "#888", marginBottom: 20 }}>
          <Link href="/" style={{ color: "#b5451b", textDecoration: "none" }}>होम</Link> →{" "}
          <Link href="/browse" style={{ color: "#b5451b", textDecoration: "none" }}>Services</Link> →{" "}
          {service.name}
        </p>

        {/* Main Card */}
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

            {/* Right — Details + Order Form */}
            <div>
              <span style={{ fontSize: 13, background: "#f5f5f5", color: "#555", padding: "3px 12px", borderRadius: 20, fontWeight: 600 }}>
                {ICONS[service.service_type] || "🙏"} {SERVICE_LABELS[service.service_type] || service.service_type}
              </span>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111", margin: "12px 0 6px" }}>{service.name}</h1>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>
                🏪 {vendor?.business_name || "Unknown"} · 📍 {vendor?.district || "Unknown"}, {vendor?.block || "Unknown"}
              </p>

              {/* Rating Summary */}
              {ratingData && ratingData.count > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, background: "#fffbf0", borderRadius: 8, padding: "8px 14px", border: "1px solid #fde68a" }}>
                  <StarDisplay avg={ratingData.avg} big />
                  <span style={{ fontSize: 17, fontWeight: 900, color: "#b45309" }}>{ratingData.avg.toFixed(1)}</span>
                  <span style={{ fontSize: 13, color: "#888" }}>({ratingData.count} ratings)</span>
                </div>
              )}

              {/* Price Box */}
              <div style={{ background: "#f9f9f9", borderRadius: 10, padding: 16, marginBottom: 16 }}>
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
              {(vendor?.working_hours || vendor?.experience_years) && (
                <div style={{ background: "#f9f9f9", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 14 }}>
                  {vendor?.working_hours && (
                    <p style={{ color: "#555", marginBottom: 4 }}>🕐 <strong>Working Hours:</strong> {vendor.working_hours}</p>
                  )}
                  {vendor?.experience_years && (
                    <p style={{ color: "#555", marginBottom: 0 }}>🏆 <strong>Experience:</strong> {vendor.experience_years} साल से Business में</p>
                  )}
                </div>
              )}

              {/* Description */}
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111", marginBottom: 6 }}>Service के बारे में</h3>
              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, marginBottom: 20 }}>{service.description}</p>

              {/* ===== ORDER FORM ===== */}
              {!orderSuccess ? (
                <form onSubmit={placeOrder} style={{ background: "#fff8f5", borderRadius: 12, padding: 18, border: "1.5px solid #f0c080", marginBottom: 12 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "#b5451b", marginBottom: 12 }}>🗓️ Order Book करें</p>

                  <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>Event Date *</label>
                  <input type="date" min={today} value={eventDate} onChange={e => setEventDate(e.target.value)} required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, marginBottom: 12, boxSizing: "border-box" as const }} />

                  <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>Message (optional)</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} rows={2}
                    placeholder="कोई special requirement हो तो लिखें..."
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, marginBottom: 12, resize: "vertical", boxSizing: "border-box" as const }} />

                  {orderMsg && <p style={{ color: orderMsg.startsWith("✅") ? "#16a34a" : "red", fontSize: 13, marginBottom: 8 }}>{orderMsg}</p>}

                  {isLoggedIn ? (
                    <button type="submit" disabled={orderLoading}
                      style={{ width: "100%", background: "#b5451b", color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
                      {orderLoading ? "भेज रहे हैं..." : "✅ Order Request भेजें"}
                    </button>
                  ) : (
                    <Link href="/login"
                      style={{ display: "block", width: "100%", background: "#b5451b", color: "#fff", borderRadius: 10, padding: "13px", fontWeight: 800, fontSize: 16, textDecoration: "none", textAlign: "center", boxSizing: "border-box" as const }}>
                      🔑 Login करके Book करें
                    </Link>
                  )}
                </form>
              ) : (
                <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 20, border: "1.5px solid #86efac", marginBottom: 12, textAlign: "center" }}>
                  <p style={{ fontSize: 36, marginBottom: 8 }}>🎉</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: "#16a34a", marginBottom: 4 }}>Order Request भेज दी गई!</p>
                  <p style={{ fontSize: 13, color: "#555" }}>Vendor जल्द से जल्द Confirm करेगा। Status देखें:</p>
                  <Link href="/my-orders" style={{ display: "inline-block", marginTop: 12, background: "#16a34a", color: "#fff", padding: "10px 24px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                    📋 मेरे Orders देखें →
                  </Link>
                </div>
              )}

              {/* Secondary CTAs */}
              <div style={{ display: "flex", gap: 10 }}>
                <a href={`https://wa.me/91${vendor?.phone || ""}?text=नमस्ते! मुझे "${service.name}" के बारे में जानकारी चाहिए।`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, background: "#25D366", color: "#fff", padding: "11px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none", textAlign: "center" }}>
                  💬 WhatsApp
                </a>
                <a href={`tel:+91${vendor?.phone || ""}`}
                  style={{ flex: 1, background: "#f5f5f5", color: "#333", padding: "11px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none", textAlign: "center", border: "1.5px solid #eee" }}>
                  📞 Call
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RATINGS & REVIEWS SECTION ===== */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1.5px solid #eee", marginTop: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#111", marginBottom: 20 }}>⭐ Customer Reviews</h2>

          {/* Rating Form — Only if user has a CONFIRMED order */}
          {hasConfirmedOrder ? (
            <form onSubmit={submitRating} style={{ background: "#f9f9f9", borderRadius: 12, padding: 20, marginBottom: 24, border: "1.5px solid #e5e5e5" }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#333", marginBottom: 4 }}>अपनी Rating दें:</p>
              <p style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>आपका order confirm हो चुका है — आप rating दे सकते हैं।</p>
              <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                {[1,2,3,4,5].map(star => (
                  <button key={star} type="button" onClick={() => setMyRating(star)}
                    style={{ fontSize: 30, background: "none", border: "none", cursor: "pointer", color: star <= myRating ? "#f59e0b" : "#ddd", transition: "color 0.15s", padding: "0 2px" }}>
                    ★
                  </button>
                ))}
                {myRating > 0 && <span style={{ fontSize: 14, color: "#888", alignSelf: "center", marginLeft: 6 }}>{myRating}/5</span>}
              </div>
              <textarea value={myReview} onChange={e => setMyReview(e.target.value)}
                placeholder="अपना अनुभव लिखें (optional)..." rows={3}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, boxSizing: "border-box" as const, marginBottom: 10, resize: "vertical" }} />
              {ratingMsg && <p style={{ color: ratingMsg.startsWith("✅") ? "#16a34a" : "red", fontSize: 13, marginBottom: 8 }}>{ratingMsg}</p>}
              <button type="submit" disabled={ratingLoading || myRating === 0}
                style={{ background: myRating > 0 ? "#b5451b" : "#ccc", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700, cursor: myRating > 0 ? "pointer" : "not-allowed", fontSize: 15 }}>
                {ratingLoading ? "सेव हो रहा है..." : "Rating Submit करें ★"}
              </button>
            </form>
          ) : isLoggedIn ? (
            <div style={{ background: "#f9f9f9", borderRadius: 12, padding: 16, marginBottom: 24, textAlign: "center", border: "1.5px solid #e5e5e5" }}>
              <p style={{ fontSize: 14, color: "#888" }}>
                🔒 Rating देने के लिए पहले <strong>Order Book करें</strong> और Vendor का Confirmation मिलने पर rating दें।
              </p>
            </div>
          ) : (
            <div style={{ background: "#f9f9f9", borderRadius: 12, padding: 16, marginBottom: 24, textAlign: "center", border: "1.5px solid #e5e5e5" }}>
              <Link href="/login" style={{ color: "#b5451b", fontWeight: 700, textDecoration: "none" }}>Login करें</Link>
              <span style={{ fontSize: 14, color: "#888" }}> और order confirm होने के बाद rating दें।</span>
            </div>
          )}

          {/* Existing Reviews — always visible */}
          {ratingData && ratingData.ratings.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ratingData.ratings.map(r => (
                <div key={r.id} style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ background: "#b5451b", color: "#fff", borderRadius: "50%", width: 34, height: 34, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
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
                  {r.review && <p style={{ fontSize: 14, color: "#555", margin: "6px 0 0 44px", lineHeight: 1.6 }}>{r.review}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#aaa", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
              अभी कोई review नहीं है। Order confirm होने के बाद पहले review दें!
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
