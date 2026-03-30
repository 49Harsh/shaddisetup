import Link from "next/link";

const packages = [
  { name: "DJ बेसिक", price: "₹8,000 से", items: ["4 घंटे DJ", "साउंड सिस्टम", "लाइट इफेक्ट"] },
  { name: "बैंड पैकेज", price: "₹20,000 से", items: ["बारात बैंड", "ढोल वाले", "5 घंटे", "यूनिफॉर्म में टीम"] },
  { name: "फुल म्यूजिक पैकेज", price: "₹40,000 से", items: ["DJ + बैंड", "संगीत नाइट", "मेहंदी फंक्शन", "LED डांस फ्लोर", "8 घंटे"] },
];

export default function DjBandPage() {
  return (
    <div>
      <section style={{ background: "#fff", padding: "72px 20px", textAlign: "center", borderBottom: "2px solid #eee" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎵</div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: "#111", marginBottom: 16 }}>
            DJ / बैंड पार्टी सेवाएं
          </h1>
          <p style={{ fontSize: 18, color: "#555", lineHeight: 1.8, marginBottom: 32 }}>
            बारात, संगीत, मेहंदी — हर फंक्शन के लिए बेस्ट म्यूजिक। प्रोफेशनल DJ और बैंड टीम।
          </p>
          <a href="https://wa.me/919999999999?text=मुझे DJ/बैंड के बारे में जानकारी चाहिए" target="_blank" rel="noopener noreferrer"
            style={{ background: "#25D366", color: "#fff", padding: "14px 32px", borderRadius: 10, fontWeight: 800, fontSize: 18, textDecoration: "none" }}>
            💬 WhatsApp पर बुकिंग करें
          </a>
        </div>
      </section>

      <section style={{ padding: "64px 20px", background: "#f5f5f5" }}>
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
                <a href="https://wa.me/919999999999?text=मुझे DJ/बैंड बुक करना है" target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", marginTop: 24, background: "#b5451b", color: "#fff", padding: "12px", borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: "none", textAlign: "center" }}>
                  बुकिंग करें
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ textAlign: "center", padding: "32px 20px", background: "#fff" }}>
        <Link href="/" style={{ color: "#b5451b", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>← होम पर वापस जाएं</Link>
      </div>
    </div>
  );
}
