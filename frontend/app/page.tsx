"use client";
import Link from "next/link";

const services = [
  {
    icon: "🌸",
    title: "डेकोरेशन",
    desc: "शादी, मंडप, स्टेज, फूलों की सजावट — हर पल को खूबसूरत बनाएं।",
    href: "/services/decoration",
  },
  {
    icon: "🎵",
    title: "DJ / बैंड पार्टी",
    desc: "बारात, संगीत, मेहंदी — हर फंक्शन के लिए बेस्ट म्यूजिक।",
    href: "/services/dj-band",
  },
  {
    icon: "🍽️",
    title: "कैटरिंग",
    desc: "स्वादिष्ट खाना, चेयर-टेबल सेटअप, पूरा इवेंट मैनेजमेंट।",
    href: "/services/catering",
  },
  {
    icon: "🙏",
    title: "Pooja Services",
    desc: "Bhoomi Pooja, Griha Pravesh, Satyanarayan Katha, Rudrabhishek — घर बैठे Expert Pandit Book करें।",
    href: "/pooja",
    highlight: true,
  },
];

const whyUs = [
  { icon: "✅", text: "100% भरोसेमंद वेंडर्स" },
  { icon: "💰", text: "किफायती दाम, कोई छुपा चार्ज नहीं" },
  { icon: "📞", text: "WhatsApp पर तुरंत सपोर्ट" },
  { icon: "🎯", text: "हर बजट के लिए पैकेज" },
  { icon: "🏆", text: "500+ सफल इवेंट" },
  { icon: "🚀", text: "बुकिंग सिर्फ 5 मिनट में" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: "#fff", padding: "80px 20px", textAlign: "center", borderBottom: "2px solid #eee" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ fontSize: 18, color: "#b5451b", fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>
            🎊 शादी और इवेंट की पूरी तैयारी
          </p>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 60px)", fontWeight: 900, color: "#111", lineHeight: 1.2, marginBottom: 20 }}>
            आपकी शादी को बनाएं <span style={{ color: "#b5451b" }}>यादगार</span>
          </h1>
          <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "#555", lineHeight: 1.8, marginBottom: 36 }}>
            डेकोरेशन, DJ/बैंड, कैटरिंग, चेयर-टेबल — सब कुछ एक जगह बुक करें।<br />
            हजारों खुश परिवारों का भरोसा।
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/services/decoration" style={{ background: "#b5451b", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 800, fontSize: 18, textDecoration: "none" }}>
              सेवाएं देखें
            </Link>
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
              style={{ background: "#25D366", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 800, fontSize: 18, textDecoration: "none" }}>
              💬 WhatsApp करें
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: "72px 20px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, marginBottom: 12, color: "#111" }}>
            हमारी सेवाएं
          </h2>
          <p style={{ textAlign: "center", color: "#777", fontSize: 17, marginBottom: 48 }}>
            हर इवेंट के लिए बेस्ट सर्विस, बेस्ट दाम
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
            {services.map((s) => (
              <Link key={s.href} href={s.href} style={{ textDecoration: "none" }}>
                <div style={{
                  background: (s as {highlight?:boolean}).highlight
                    ? "linear-gradient(135deg,#7c2d12,#b5451b)"
                    : "#fff",
                  borderRadius: 16,
                  padding: "36px 28px",
                  border: (s as {highlight?:boolean}).highlight ? "none" : "1.5px solid #eee",
                  cursor: "pointer",
                  height: "100%",
                  color: (s as {highlight?:boolean}).highlight ? "#fff" : "inherit",
                }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10, color: (s as {highlight?:boolean}).highlight ? "#fff" : "#111" }}>{s.title}</h3>
                  <p style={{ fontSize: 16, lineHeight: 1.7, color: (s as {highlight?:boolean}).highlight ? "rgba(255,255,255,0.85)" : "#555" }}>{s.desc}</p>
                  <span style={{ display: "inline-block", marginTop: 20, fontWeight: 700, fontSize: 15, color: (s as {highlight?:boolean}).highlight ? "#fcd9b6" : "#b5451b" }}>
                    और जानें →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section style={{ padding: "72px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 800, marginBottom: 48, color: "#111" }}>
            हमें क्यों चुनें?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {whyUs.map((w, i) => (
              <div key={i} style={{ background: "#f5f5f5", borderRadius: 12, padding: "28px 20px", textAlign: "center", border: "1.5px solid #eee" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{w.icon}</div>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: "#b5451b", color: "#fff", padding: "64px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, marginBottom: 16 }}>
          अभी बुकिंग करें और पाएं स्पेशल डिस्काउंट!
        </h2>
        <p style={{ fontSize: 18, marginBottom: 32, opacity: 0.9 }}>
          WhatsApp पर मैसेज करें और हमारे एक्सपर्ट से बात करें
        </p>
        <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
          style={{ background: "#fff", color: "#b5451b", padding: "16px 40px", borderRadius: 10, fontWeight: 800, fontSize: 20, textDecoration: "none" }}>
          💬 WhatsApp पर बात करें
        </a>
      </section>
    </div>
  );
}
