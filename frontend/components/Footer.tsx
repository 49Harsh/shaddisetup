import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#1a1a1a", color: "#ccc", padding: "48px 20px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40 }}>
        {/* Brand */}
        <div>
          <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
            ShaadiSetup<span style={{ color: "#b5451b" }}>.com</span>
          </h3>
          <p style={{ fontSize: 15, lineHeight: 1.7 }}>
            शादी और इवेंट को यादगार बनाने के लिए हम हैं। डेकोरेशन, कैटरिंग, DJ/बैंड — सब कुछ एक जगह।
          </p>
          <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", marginTop: 16, background: "#25D366", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
            💬 WhatsApp करें
          </a>
        </div>

        {/* Services */}
        <div>
          <h4 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 14 }}>हमारी सेवाएं</h4>
          {[
            { href: "/services/decoration", label: "डेकोरेशन" },
            { href: "/services/dj-band", label: "DJ / बैंड पार्टी" },
            { href: "/services/catering", label: "कैटरिंग" },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{ display: "block", color: "#bbb", textDecoration: "none", marginBottom: 10, fontSize: 15 }}>
              → {l.label}
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 14 }}>त्वरित लिंक</h4>
          {[
            { href: "/", label: "होम" },
            { href: "/about", label: "हमारे बारे में" },
            { href: "/contact", label: "संपर्क करें" },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{ display: "block", color: "#bbb", textDecoration: "none", marginBottom: 10, fontSize: 15 }}>
              → {l.label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 14 }}>संपर्क</h4>
          <p style={{ fontSize: 15, marginBottom: 8 }}>📞 +91 99999 99999</p>
          <p style={{ fontSize: 15, marginBottom: 8 }}>📧 info@shaadisetup.com</p>
          <p style={{ fontSize: 15 }}>📍 दिल्ली, भारत</p>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #333", marginTop: 40, paddingTop: 20, textAlign: "center", fontSize: 14, color: "#777" }}>
        © 2025 ShaadiSetup.com — सभी अधिकार सुरक्षित
      </div>
    </footer>
  );
}
