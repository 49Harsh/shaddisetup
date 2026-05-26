"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), phone: form.phone.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("storage"));
      router.push("/admin");
    } catch {
      setError("Server se connect nahi ho paya.");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "40px 36px", width: "100%", maxWidth: 420, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>⚙️</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#111", marginBottom: 6 }}>Admin Login</h1>
          <p style={{ fontSize: 14, color: "#888" }}>ShaadiSetup Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#555", marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 15, outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#555", marginBottom: 6 }}>
              Mobile Number
            </label>
            <input
              type="tel"
              required
              placeholder="9999999999"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 15, outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {error && (
            <div style={{ background: "#fee2e2", color: "#ef4444", padding: "10px 14px", borderRadius: 8, fontSize: 14, marginBottom: 16, fontWeight: 600 }}>
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "13px", background: loading ? "#ccc" : "#b5451b", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Verifying..." : "Login करें"}
          </button>
        </form>
      </div>
    </div>
  );
}
