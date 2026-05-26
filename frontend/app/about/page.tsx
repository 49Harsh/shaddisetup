"use client";
import Link from "next/link";
import { useLang } from "@/lib/langContext";
import { tr } from "@/lib/translations";

export default function AboutPage() {
  const { lang } = useLang();
  const t = (k: { en: string; hi: string }) => k[lang];

  const stats = [
    { num: "500+", label: t(tr.stats.events) },
    { num: "1000+", label: t(tr.stats.families) },
    { num: "50+", label: t(tr.stats.vendors) },
    { num: lang === "en" ? "5 Years" : "5 साल", label: t(tr.stats.years) },
  ];

  const team = [
    { name: lang === "en" ? "Rahul Sharma" : "राहुल शर्मा", role: t(tr.team.founder), emoji: "👨‍💼" },
    { name: lang === "en" ? "Priya Gupta" : "प्रिया गुप्ता", role: t(tr.team.event), emoji: "👩‍💼" },
    { name: lang === "en" ? "Amit Verma" : "अमित वर्मा", role: t(tr.team.deco), emoji: "🎨" },
  ];

  return (
    <div>
      <section style={{ background: "#fff", padding: "72px 20px", textAlign: "center", borderBottom: "2px solid #eee" }}>
        <div style={{ maxWidth: 750, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: "#111", marginBottom: 20 }}>
            {t(tr.aboutTitle)}
          </h1>
          <p style={{ fontSize: 18, color: "#555", lineHeight: 1.9 }}>{t(tr.aboutDesc)}</p>
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
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "#111", marginBottom: 24 }}>{t(tr.ourStory)}</h2>
          <p style={{ fontSize: 17, color: "#555", lineHeight: 1.9, marginBottom: 20 }}>{t(tr.story1)}</p>
          <p style={{ fontSize: 17, color: "#555", lineHeight: 1.9, marginBottom: 20 }}>{t(tr.story2)}</p>
          <p style={{ fontSize: 17, color: "#555", lineHeight: 1.9 }}>{t(tr.story3)}</p>
        </div>
      </section>

      <section style={{ padding: "64px 20px", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 34, fontWeight: 800, color: "#111", marginBottom: 48 }}>{t(tr.ourTeam)}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 28 }}>
            {team.map((m, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "36px 24px", textAlign: "center", border: "1.5px solid #eee" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>{m.emoji}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 6 }}>{m.name}</h3>
                <p style={{ fontSize: 15, color: "#777" }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "64px 20px", background: "#b5451b", textAlign: "center" }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#fff", marginBottom: 16 }}>{t(tr.startPlanning)}</h2>
        <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-block", background: "#fff", color: "#b5451b", padding: "14px 36px", borderRadius: 10, fontWeight: 800, fontSize: 18, textDecoration: "none" }}>
          {t(tr.chatWA)}
        </a>
      </section>

      <div style={{ textAlign: "center", padding: "24px 20px", background: "#fff" }}>
        <Link href="/" style={{ color: "#b5451b", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>{t(tr.backHome)}</Link>
      </div>
    </div>
  );
}
