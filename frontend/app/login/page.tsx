"use client";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"options" | "manual" | "otp">("options");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" });
  const [otp, setOtp] = useState("");

  // Google Login
  async function loginWithGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setMsg("Error: " + error.message);
    setLoading(false);
  }

  // Manual - Step 1: Send Magic Link
  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.phone) {
      setMsg("सभी fields भरें।"); return;
    }
    setLoading(true); setMsg("");
    const { error } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: {
        data: { full_name: form.full_name, phone: form.phone },
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) { setMsg("Error: " + error.message); }
    else { setMode("otp"); setMsg(""); }
    setLoading(false);
  }

  // Manual - Step 2: Verify OTP
  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg("");
    const { data, error } = await supabase.auth.verifyOtp({
      email: form.email,
      token: otp,
      type: "email",
    });
    if (error) { setMsg("OTP गलत है या expire हो गया।"); setLoading(false); return; }

    // Backend ko bhejo
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: data.session?.access_token }),
      });
      const result = await res.json();
      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        window.location.href = result.user.profileComplete ? "/dashboard" : "/profile/complete";
      } else {
        setMsg(result.error || "Kuch galat hua.");
      }
    } catch { setMsg("Backend se connect nahi ho paya."); }
    setLoading(false);
  }

  const inputStyle = {
    width: "100%", padding: "13px 14px", borderRadius: 8,
    border: "1.5px solid #ddd", fontSize: 16, marginBottom: 14,
    boxSizing: "border-box" as const, outline: "none",
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "40px 36px", border: "1.5px solid #eee", width: "100%", maxWidth: 420 }}>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🎊</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111", marginBottom: 6 }}>ShaadiSetup में आपका स्वागत है</h1>
          <p style={{ fontSize: 15, color: "#888" }}>लॉगिन करें और सेवाएं बुक करें</p>
        </div>

        {/* OPTIONS */}
        {mode === "options" && (
          <>
            {/* Google Button */}
            <button onClick={loginWithGoogle} disabled={loading}
              style={{ width: "100%", background: "#fff", border: "2px solid #ddd", borderRadius: 10, padding: "13px 20px", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "#333", marginBottom: 14 }}>
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.8 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
              </svg>
              {loading ? "लोड हो रहा है..." : "Google से Continue करें"}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: "#eee" }} />
              <span style={{ color: "#aaa", fontSize: 13 }}>या</span>
              <div style={{ flex: 1, height: 1, background: "#eee" }} />
            </div>

            {/* Manual Button */}
            <button onClick={() => setMode("manual")}
              style={{ width: "100%", background: "#b5451b", color: "#fff", border: "none", borderRadius: 10, padding: "13px 20px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              📧 Email से Register / Login करें
            </button>

            {msg && <p style={{ color: "red", fontSize: 13, marginTop: 12, textAlign: "center" }}>{msg}</p>}
          </>
        )}

        {/* MANUAL FORM */}
        {mode === "manual" && (
          <form onSubmit={sendOtp}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>पूरा नाम *</label>
            <input style={inputStyle} placeholder="राम कुमार शर्मा" value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })} required />

            <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>Gmail / Email *</label>
            <input style={inputStyle} type="email" placeholder="example@gmail.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />

            <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>मोबाइल नंबर *</label>
            <input style={inputStyle} placeholder="+91 9999999999" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })} required />

            {msg && <p style={{ color: "red", fontSize: 13, marginBottom: 10 }}>{msg}</p>}

            <button type="submit" disabled={loading}
              style={{ width: "100%", background: "#b5451b", color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
              {loading ? "भेज रहे हैं..." : "OTP भेजें →"}
            </button>
            <button type="button" onClick={() => { setMode("options"); setMsg(""); }}
              style={{ width: "100%", background: "none", border: "none", color: "#888", fontSize: 14, cursor: "pointer" }}>
              ← वापस जाएं
            </button>
          </form>
        )}

        {/* OTP VERIFY */}
        {mode === "otp" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 10 }}>
              Email चेक करें
            </h2>
            <p style={{ fontSize: 15, color: "#555", marginBottom: 8 }}>
              <strong>{form.email}</strong> पर एक Login Link भेजा गया है
            </p>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>
              Email में <strong>"Log In"</strong> button पर click करें — आप automatically login हो जाएंगे
            </p>
            <div style={{ background: "#f5f5f5", borderRadius: 10, padding: "16px", marginBottom: 20, fontSize: 14, color: "#666" }}>
              💡 Spam/Junk folder भी check करें
            </div>
            <button type="button" onClick={() => { setMode("manual"); setMsg(""); setOtp(""); }}
              style={{ background: "none", border: "none", color: "#b5451b", fontSize: 14, cursor: "pointer", fontWeight: 700 }}>
              ← दोबारा भेजें
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
