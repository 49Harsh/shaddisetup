import Link from "next/link";

const team = [
  { name: "राहुल शर्मा", role: "फाउंडर & CEO", emoji: "👨‍💼" },
  { name: "प्रिया गुप्ता", role: "इवेंट मैनेजर", emoji: "👩‍💼" },
  { name: "अमित वर्मा", role: "डेकोरेशन हेड", emoji: "🎨" },
];

const stats = [
  { num: "500+", label: "सफल इवेंट" },
  { num: "1000+", label: "खुश परिवार" },
  { num: "50+", label: "वेंडर पार्टनर" },
  { num: "5 साल", label: "का अनुभव" },
];

export default function AboutPage() {
  return (
    <div>
      <section style={{ background: "#fff", padding: "72px 20px", textAlign: "center", borderBottom: "2px solid #eee" }}>
        <div style={{ maxWidth: 750, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: "#111", marginBottom: 20 }}>
            हमारे बारे में
          </h1>
          <p style={{ fontSize: 18, color: "#555", lineHeight: 1.9 }}>
            ShaadiSetup.com एक भरोसेमंद प्लेटफॉर्म है जो शादी और इवेंट की सभी जरूरतें एक जगह पूरी करता है।
            हमारा मकसद है — आपकी शादी को तनाव-मुक्त और यादगार बनाना।
          </p>
        </div>
      </section>

      <section style={{ padding: "56px 20px", background: "#b5451b" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{ fontSize: 42, fontWeight: 900, color: "#fff", marginBottom: 6 }}>{s.num}</p>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "72px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "#111", marginBottom: 24 }}>हमारी कहानी</h2>
          <p style={{ fontSize: 17, color: "#555", lineHeight: 1.9, marginBottom: 20 }}>
            ShaadiSetup.com की शुरुआत 2020 में हुई जब हमने देखा कि शादी की तैयारी में लोगों को कितनी परेशानी होती है।
            अलग-अलग वेंडर ढूंढना, दाम तय करना, सब कुछ मैनेज करना — यह सब बहुत थका देने वाला था।
          </p>
          <p style={{ fontSize: 17, color: "#555", lineHeight: 1.9, marginBottom: 20 }}>
            हमने एक ऐसा प्लेटफॉर्म बनाया जहां डेकोरेशन, कैटरिंग, DJ/बैंड — सब कुछ एक जगह मिले।
            भरोसेमंद वेंडर, पारदर्शी दाम, और WhatsApp पर तुरंत सपोर्ट।
          </p>
          <p style={{ fontSize: 17, color: "#555", lineHeight: 1.9 }}>
            आज हम 500+ सफल इवेंट कर चुके हैं और 1000+ परिवारों का भरोसा जीत चुके हैं।
          </p>
        </div>
      </section>

      <section style={{ padding: "64px 20px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 34, fontWeight: 800, color: "#111", marginBottom: 48 }}>हमारी टीम</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 28 }}>
            {team.map((t, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "36px 24px", textAlign: "center", border: "1.5px solid #eee" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>{t.emoji}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 6 }}>{t.name}</h3>
                <p style={{ fontSize: 15, color: "#777" }}>{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "64px 20px", background: "#b5451b", textAlign: "center" }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#fff", marginBottom: 16 }}>
          अपनी शादी की तैयारी शुरू करें
        </h2>
        <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-block", background: "#fff", color: "#b5451b", padding: "14px 36px", borderRadius: 10, fontWeight: 800, fontSize: 18, textDecoration: "none" }}>
          💬 WhatsApp पर बात करें
        </a>
      </section>

      <div style={{ textAlign: "center", padding: "24px 20px", background: "#fff" }}>
        <Link href="/" style={{ color: "#b5451b", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>← होम पर वापस जाएं</Link>
      </div>
    </div>
  );
}
