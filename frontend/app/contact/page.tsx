"use client";
import { useLang } from "@/lib/langContext";
import { tr } from "@/lib/translations";

export default function ContactPage() {
  const { lang } = useLang();
  const t = (k: { en: string; hi: string }) => k[lang];

  const contacts = [
    { icon: "💬", title: t(tr.contacts.wa.title), desc: "+91 80974 76088", link: "https://wa.me/918097476088", linkText: t(tr.contacts.wa.link) },
    { icon: "📞", title: t(tr.contacts.phone.title), desc: "+91 80974 76088", link: "tel:+918097476088", linkText: t(tr.contacts.phone.link) },
    { icon: "📧", title: t(tr.contacts.email.title), desc: "shaadisetup@gmail.com", link: "mailto:shaadisetup@gmail.com", linkText: t(tr.contacts.email.link) },
    { icon: "📍", title: t(tr.contacts.addr.title), desc: lang === "en" ? "Office No. 6,Plot No. 3A,  Sairama Realestate, Sector 02, Kharghar, Navi Mumbai, Maharashtra 410210" : "Office No. 6,Plot No. 3A,  Sairama Realestate, Sector 02, Kharghar, Navi Mumbai, Maharashtra 410210", link: "https://maps.google.com", linkText: t(tr.contacts.addr.link) },
  ];

  return (
    <div>
      <section style={{ background: "#fff", padding: "72px 20px", textAlign: "center", borderBottom: "2px solid #eee" }}>
        <div style={{ maxWidth: 650, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: "#111", marginBottom: 16 }}>
            {t(tr.contactTitle)}
          </h1>
          <p style={{ fontSize: 18, color: "#555", lineHeight: 1.8 }}>{t(tr.contactDesc)}</p>
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
          {t(tr.contactCTA)}
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.9)", marginBottom: 32 }}>{t(tr.contactHours)}</p>
        <a href="https://wa.me/+918097476088" target="_blank" rel="noopener noreferrer"
          style={{ background: "#fff", color: "#b5451b", padding: "16px 40px", borderRadius: 10, fontWeight: 800, fontSize: 20, textDecoration: "none" }}>
          {t(tr.openWA)}
        </a>
      </section>
    </div>
  );
}
