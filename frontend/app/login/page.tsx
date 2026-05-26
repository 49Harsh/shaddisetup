"use client";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useLang } from "@/lib/langContext";
import { tr } from "@/lib/translations";

export default function LoginPage() {
  const { lang } = useLang();
  const t = (k: { en: string; hi: string }) => k[lang];

  const [mode, setMode] = useState<"options" | "manual" | "otp">("options");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ full_name: "", email: "" });

  async function loginWithGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setMsg("Error: " + error.message);
    setLoading(false);
  }

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email) { setMsg(lang === "en" ? "Please enter email." : "Email भरें।"); return; }
    setLoading(true); setMsg("");
    const { error } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: { data: { full_name: form.full_name }, shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setMsg("Error: " + error.message);
    else setMode("otp");
    setLoading(false);
  }

  const inputStyle = { width: "100%", padding: "13px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 16, marginBottom: 14, boxSizing: "border-box" as const, outline: "none" };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "40px 36px", border: "1.5px solid #eee", width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🎊</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111", marginBottom: 6 }}>{t(tr.loginWelcome)}</h1>
          <p style={{ fontSize: 15, color: "#888" }}>{t(tr.loginSub)}</p>
        </div>

        {mode === "options" && (
          <>
            <button onClick={loginWithGoogle} disabled={loading}
              style={{ width: "100%", background: "#fff", border: "2px solid #ddd", borderRadius: 10, padding: "13px 20px", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "#333", marginBottom: 14 }}>
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.8 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
              </svg>
              {loading ? t(tr.loading) : t(tr.googleLogin)}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: "#eee" }} />
              <span style={{ color: "#aaa", fontSize: 13 }}>{t(tr.or)}</span>
              <div style={{ flex: 1, height: 1, background: "#eee" }} />
            </div>
            <button onClick={() => setMode("manual")}
              style={{ width: "100%", background: "#b5451b", color: "#fff", border: "none", borderRadius: 10, padding: "13px 20px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              {t(tr.emailLogin)}
            </button>
            {msg && <p style={{ color: "red", fontSize: 13, marginTop: 12, textAlign: "center" }}>{msg}</p>}
          </>
        )}

        {mode === "manual" && (
          <form onSubmit={sendOtp}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>{t(tr.fullName)}</label>
            <input style={inputStyle} placeholder={lang === "en" ? "Ram Kumar Sharma" : "राम कुमार शर्मा"} value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })} />
            <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>Gmail / Email *</label>
            <input style={inputStyle} type="email" placeholder="example@gmail.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
            {msg && <p style={{ color: "red", fontSize: 13, marginBottom: 10 }}>{msg}</p>}
            <button type="submit" disabled={loading}
              style={{ width: "100%", background: "#b5451b", color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
              {loading ? t(tr.loading) : t(tr.sendLink)}
            </button>
            <button type="button" onClick={() => { setMode("options"); setMsg(""); }}
              style={{ width: "100%", background: "none", border: "none", color: "#888", fontSize: 14, cursor: "pointer" }}>
              {t(tr.goBack)}
            </button>
          </form>
        )}

        {mode === "otp" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 10 }}>{t(tr.checkEmail)}</h2>
            <p style={{ fontSize: 15, color: "#555", marginBottom: 8 }}><strong>{form.email}</strong> {t(tr.emailSent)}</p>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>{t(tr.clickLogin)}</p>
            <div style={{ background: "#f5f5f5", borderRadius: 10, padding: "16px", marginBottom: 20, fontSize: 14, color: "#666" }}>{t(tr.checkSpam)}</div>
            <button type="button" onClick={() => { setMode("manual"); setMsg(""); }}
              style={{ background: "none", border: "none", color: "#b5451b", fontSize: 14, cursor: "pointer", fontWeight: 700 }}>
              {t(tr.resend)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
