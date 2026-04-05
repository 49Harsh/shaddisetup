"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type ServiceDetail = {
  id: string; service_type: string; name: string;
  actual_price: number; selling_price: number; description: string;
  main_image: string; images: string[]; is_active: boolean;
  vendor: { business_name: string; phone: string; district: string; block: string };
};

const ICONS: Record<string, string> = { DJ: "🎵", Catering: "🍽️", Decoration: "🌸", Mehndi: "🎨" };

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [activeImg, setActiveImg] = useState("");
  const [loading, setLoading] = useState(true);

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
  }, [id]);

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
              <p style={{ fontSize: 14, color: "#888", marginBottom: 16 }}>
                🏪 {service.vendor?.business_name || "Unknown"} · 📍 {service.vendor?.district || "Unknown"}, {service.vendor?.block || "Unknown"}
              </p>

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
      </div>

      <style>{`
        @media (max-width: 700px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
