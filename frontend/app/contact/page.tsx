const contacts = [
  { icon: "💬", title: "WhatsApp", desc: "+91 99999 99999", link: "https://wa.me/919999999999", linkText: "WhatsApp पर मैसेज करें" },
  { icon: "📞", title: "फोन कॉल", desc: "+91 99999 99999", link: "tel:+919999999999", linkText: "अभी कॉल करें" },
  { icon: "📧", title: "ईमेल", desc: "info@shaadisetup.com", link: "mailto:info@shaadisetup.com", linkText: "ईमेल भेजें" },
  { icon: "📍", title: "पता", desc: "दिल्ली, भारत", link: "https://maps.google.com", linkText: "मैप पर देखें" },
];

export default function ContactPage() {
  return (
    <div>
      <section style={{ background: "#fff", padding: "72px 20px", textAlign: "center", borderBottom: "2px solid #eee" }}>
        <div style={{ maxWidth: 650, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: "#111", marginBottom: 16 }}>
            संपर्क करें
          </h1>
          <p style={{ fontSize: 18, color: "#555", lineHeight: 1.8 }}>
            कोई भी सवाल हो, बुकिंग करनी हो — हम WhatsApp पर हमेशा उपलब्ध हैं।
          </p>
        </div>
      </section>

      <section style={{ padding: "64px 20px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 28 }}>
          {contacts.map((c, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "36px 24px", textAlign: "center", border: "1.5px solid #eee" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{c.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 8 }}>{c.title}</h3>
              <p style={{ fontSize: 16, color: "#555", marginBottom: 20 }}>{c.desc}</p>
              <a href={c.link} target="_blank" rel="noopener noreferrer"
                style={{ background: "#b5451b", color: "#fff", padding: "10px 22px", borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                {c.linkText}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#b5451b", padding: "64px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 900, color: "#fff", marginBottom: 16 }}>
          अभी WhatsApp पर बात करें
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.9)", marginBottom: 32 }}>
          सुबह 9 बजे से रात 10 बजे तक उपलब्ध
        </p>
        <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
          style={{ background: "#fff", color: "#b5451b", padding: "16px 40px", borderRadius: 10, fontWeight: 800, fontSize: 20, textDecoration: "none" }}>
          💬 WhatsApp खोलें
        </a>
      </section>
    </div>
  );
}
