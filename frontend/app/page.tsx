"use client";
import Link from "next/link";
import { useLang } from "@/lib/langContext";

const t = {
  en: {
    tagline: "🎊 Complete Wedding & Event Planning",
    hero: <>Make Your Wedding <span style={{ color: "#b5451b" }}>Unforgettable</span></>,
    heroSub: "Decoration, DJ/Band, Catering, Chair-Table — book everything in one place.\nTrusted by thousands of happy families.",
    viewServices: "View Services",
    whatsapp: "💬 WhatsApp Us",
    ourServices: "Our Services",
    servicesSub: "Best service, best price for every event",
    whyUs: "Why Choose Us?",
    cta: "Book Now & Get a Special Discount!",
    ctaSub: "Message us on WhatsApp and talk to our expert",
    ctaBtn: "💬 Chat on WhatsApp",
    learnMore: "Learn More →",
    services: [
      { icon: "🌸", title: "Decoration", desc: "Wedding, mandap, stage, floral decoration — make every moment beautiful.", href: "/services/decoration" },
      { icon: "🎵", title: "DJ / Band Party", desc: "Baraat, sangeet, mehndi — best music for every function.", href: "/services/dj-band" },
      { icon: "🍽️", title: "Catering", desc: "Delicious food, chair-table setup, complete event management.", href: "/services/catering" },
      { icon: "🙏", title: "Pooja Services", desc: "Bhoomi Pooja, Griha Pravesh, Satyanarayan Katha, Rudrabhishek — book expert pandit at home.", href: "/pooja", highlight: true },
    ],
    whyItems: [
      { icon: "✅", text: "100% Trusted Vendors" },
      { icon: "💰", text: "Affordable prices, no hidden charges" },
      { icon: "📞", text: "Instant support on WhatsApp" },
      { icon: "🎯", text: "Packages for every budget" },
      { icon: "🏆", text: "500+ Successful Events" },
      { icon: "🚀", text: "Booking in just 5 minutes" },
    ],
  },
  hi: {
    tagline: "🎊 शादी और इवेंट की पूरी तैयारी",
    hero: <>आपकी शादी को बनाएं <span style={{ color: "#b5451b" }}>यादगार</span></>,
    heroSub: "डेकोरेशन, DJ/बैंड, कैटरिंग, चेयर-टेबल — सब कुछ एक जगह बुक करें।\nहजारों खुश परिवारों का भरोसा।",
    viewServices: "सेवाएं देखें",
    whatsapp: "💬 WhatsApp करें",
    ourServices: "हमारी सेवाएं",
    servicesSub: "हर इवेंट के लिए बेस्ट सर्विस, बेस्ट दाम",
    whyUs: "हमें क्यों चुनें?",
    cta: "अभी बुकिंग करें और पाएं स्पेशल डिस्काउंट!",
    ctaSub: "WhatsApp पर मैसेज करें और हमारे एक्सपर्ट से बात करें",
    ctaBtn: "💬 WhatsApp पर बात करें",
    learnMore: "और जानें →",
    services: [
      { icon: "🌸", title: "डेकोरेशन", desc: "शादी, मंडप, स्टेज, फूलों की सजावट — हर पल को खूबसूरत बनाएं।", href: "/services/decoration" },
      { icon: "🎵", title: "DJ / बैंड पार्टी", desc: "बारात, संगीत, मेहंदी — हर फंक्शन के लिए बेस्ट म्यूजिक।", href: "/services/dj-band" },
      { icon: "🍽️", title: "कैटरिंग", desc: "स्वादिष्ट खाना, चेयर-टेबल सेटअप, पूरा इवेंट मैनेजमेंट।", href: "/services/catering" },
      { icon: "🙏", title: "Pooja Services", desc: "Bhoomi Pooja, Griha Pravesh, Satyanarayan Katha, Rudrabhishek — घर बैठे Expert Pandit Book करें।", href: "/pooja", highlight: true },
    ],
    whyItems: [
      { icon: "✅", text: "100% भरोसेमंद वेंडर्स" },
      { icon: "💰", text: "किफायती दाम, कोई छुपा चार्ज नहीं" },
      { icon: "📞", text: "WhatsApp पर तुरंत सपोर्ट" },
      { icon: "🎯", text: "हर बजट के लिए पैकेज" },
      { icon: "🏆", text: "500+ सफल इवेंट" },
      { icon: "🚀", text: "बुकिंग सिर्फ 5 मिनट में" },
    ],
  },
};

export default function HomePage() {
  const { lang } = useLang();
  const tx = t[lang];

  return (
    <div>
      {/* Hero */}
      <section style={{ background: "#fff", padding: "80px 20px", textAlign: "center", borderBottom: "2px solid #eee" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ fontSize: 18, color: "#b5451b", fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>
            {tx.tagline}
          </p>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 60px)", fontWeight: 900, color: "#111", lineHeight: 1.2, marginBottom: 20 }}>
            {tx.hero}
          </h1>
          <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "#555", lineHeight: 1.8, marginBottom: 36, whiteSpace: "pre-line" }}>
            {tx.heroSub}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/services/decoration" style={{ background: "#b5451b", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 800, fontSize: 18, textDecoration: "none" }}>
              {tx.viewServices}
            </Link>
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
              style={{ background: "#25D366", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 800, fontSize: 18, textDecoration: "none" }}>
              {tx.whatsapp}
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: "72px 20px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, marginBottom: 12, color: "#111" }}>
            {tx.ourServices}
          </h2>
          <p style={{ textAlign: "center", color: "#777", fontSize: 17, marginBottom: 48 }}>{tx.servicesSub}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
            {tx.services.map((s) => (
              <Link key={s.href} href={s.href} style={{ textDecoration: "none" }}>
                <div style={{
                  background: (s as { highlight?: boolean }).highlight ? "linear-gradient(135deg,#7c2d12,#b5451b)" : "#fff",
                  borderRadius: 16, padding: "36px 28px",
                  border: (s as { highlight?: boolean }).highlight ? "none" : "1.5px solid #eee",
                  cursor: "pointer", height: "100%",
                  color: (s as { highlight?: boolean }).highlight ? "#fff" : "inherit",
                }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10, color: (s as { highlight?: boolean }).highlight ? "#fff" : "#111" }}>{s.title}</h3>
                  <p style={{ fontSize: 16, lineHeight: 1.7, color: (s as { highlight?: boolean }).highlight ? "rgba(255,255,255,0.85)" : "#555" }}>{s.desc}</p>
                  <span style={{ display: "inline-block", marginTop: 20, fontWeight: 700, fontSize: 15, color: (s as { highlight?: boolean }).highlight ? "#fcd9b6" : "#b5451b" }}>
                    {tx.learnMore}
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
            {tx.whyUs}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {tx.whyItems.map((w, i) => (
              <div key={i} style={{ background: "#f5f5f5", borderRadius: 12, padding: "28px 20px", textAlign: "center", border: "1.5px solid #eee" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{w.icon}</div>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#b5451b", color: "#fff", padding: "64px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, marginBottom: 16 }}>{tx.cta}</h2>
        <p style={{ fontSize: 18, marginBottom: 32, opacity: 0.9 }}>{tx.ctaSub}</p>
        <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
          style={{ background: "#fff", color: "#b5451b", padding: "16px 40px", borderRadius: 10, fontWeight: 800, fontSize: 20, textDecoration: "none" }}>
          {tx.ctaBtn}
        </a>
      </section>
    </div>
  );
}
