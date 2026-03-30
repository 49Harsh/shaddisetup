import Link from "next/link";

const packages = [
  { name: "बेसिक कैटरिंग", price: "₹350/व्यक्ति", items: ["वेज मेनू", "50-100 लोग", "सर्विस स्टाफ", "बर्तन सेटअप"] },
  { name: "स्टैंडर्ड पैकेज", price: "₹550/व्यक्ति", items: ["वेज + नॉन-वेज", "100-300 लोग", "चेयर-टेबल", "लाइव काउंटर", "डेजर्ट"] },
  { name: "प्रीमियम बैंक्वेट", price: "₹900/व्यक्ति", items: ["फुल बुफे", "300+ लोग", "5 स्टार मेनू", "वेटर सर्विस", "डेकोरेटेड टेबल", "वेलकम ड्रिंक"] },
];

export default function CateringPage() {
  return (
    <div>
      <section style={{ background: "#fff", padding: "72px 20px", textAlign: "center", borderBottom: "2px solid #eee" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🍽️</div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: "#111", marginBottom: 16 }}>
            कैटरिंग सेवाएं
          </h1>
          <p style={{ fontSize: 18, color: "#555", lineHeight: 1.8, marginBottom: 32 }}>
            स्वादिष्ट खाना, चेयर-टेबल सेटअप, पूरा इवेंट मैनेजमेंट। 50 से 1000+ लोगों के लिए।
          </p>
          <a href="https://wa.me/919999999999?text=मुझे कैटरिंग के बारे में जानकारी चाहिए" target="_blank" rel="noopener noreferrer"
            style={{ background: "#25D366", color: "#fff", padding: "14px 32px", borderRadius: 10, fontWeight: 800, fontSize: 18, textDecoration: "none" }}>
            💬 WhatsApp पर बुकिंग करें
          </a>
        </div>
      </section>

      <section style={{ padding: "48px 20px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32, color: "#111" }}>हम क्या देते हैं?</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            {["🪑 चेयर-टेबल", "🍛 खाना", "🥗 सलाद बार", "🍰 डेजर्ट", "🧑‍🍳 शेफ", "🚚 होम डिलीवरी"].map((item, i) => (
              <span key={i} style={{ background: "#fff", border: "1.5px solid #ddd", borderRadius: 30, padding: "10px 22px", fontSize: 16, fontWeight: 600, color: "#333" }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "64px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 34, fontWeight: 800, marginBottom: 48, color: "#111" }}>हमारे पैकेज</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
            {packages.map((p, i) => (
              <div key={i} style={{ border: i === 1 ? "2px solid #b5451b" : "1.5px solid #eee", borderRadius: 16, padding: "32px 24px", background: "#fff", position: "relative" }}>
                {i === 1 && (
                  <span style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#b5451b", color: "#fff", padding: "4px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                    सबसे लोकप्रिय
                  </span>
                )}
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#111", marginBottom: 8 }}>{p.name}</h3>
                <p style={{ fontSize: 26, fontWeight: 900, color: "#b5451b", marginBottom: 20 }}>{p.price}</p>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {p.items.map((item, j) => (
                    <li key={j} style={{ fontSize: 16, color: "#444", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "#b5451b", fontWeight: 700 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <a href="https://wa.me/919999999999?text=मुझे कैटरिंग बुक करना है" target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", marginTop: 24, background: "#b5451b", color: "#fff", padding: "12px", borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: "none", textAlign: "center" }}>
                  बुकिंग करें
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ textAlign: "center", padding: "32px 20px", background: "#f5f5f5" }}>
        <Link href="/" style={{ color: "#b5451b", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>← होम पर वापस जाएं</Link>
      </div>
    </div>
  );
}
