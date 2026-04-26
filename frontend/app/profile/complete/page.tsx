"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CompleteProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    full_name: "", phone: "", village: "",
    block: "", district: "", pincode: "", role: "user",
    business_name: "", service_types: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const u = JSON.parse(user);
      // Agar profile already complete hai toh dashboard pe bhejo
      if (u.phone && u.phone !== u.email && u.block && u.district && u.pincode) {
        router.push("/dashboard");
        return;
      }
      setForm(f => ({ ...f, full_name: u.full_name || "" }));
    } else {
      router.push("/login");
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const body: Record<string, unknown> = {
      userId: user.id,
      full_name: form.full_name,
      phone: form.phone,
      village: form.village,
      block: form.block,
      district: form.district,
      pincode: form.pincode,
      role: form.role,
    };

    if (form.role === "vendor" || form.role === "pandit") {
      body.business_name = form.business_name;
      body.service_types = form.service_types.split(",").map(s => s.trim());
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/complete-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setMsg(data.error || "Kuch galat hua.");
      }
    } catch {
      setMsg("Server se connect nahi ho paya.");
    }
    setLoading(false);
  }

  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 16, marginBottom: 16, boxSizing: "border-box" as const };
  const labelStyle = { fontSize: 14, fontWeight: 600, color: "#444", display: "block", marginBottom: 4 };

  return (
    <div style={{ minHeight: "80vh", background: "#f5f5f5", padding: "40px 20px" }}>
      <div style={{ maxWidth: 520, margin: "0 auto", background: "#fff", borderRadius: 16, padding: "40px 32px", border: "1.5px solid #eee" }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111", marginBottom: 8 }}>प्रोफाइल पूरी करें</h1>
        <p style={{ color: "#777", fontSize: 15, marginBottom: 28 }}>एक बार भरें, हमेशा के लिए सेव</p>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>पूरा नाम *</label>
          <input style={inputStyle} value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="राम कुमार शर्मा" required />

          <label style={labelStyle}>मोबाइल नंबर *</label>
          <input style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 9999999999" required />

          <label style={labelStyle}>जिला *</label>
          <input style={inputStyle} value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} placeholder="लखनऊ" required />

          <label style={labelStyle}>ब्लॉक *</label>
          <input style={inputStyle} value={form.block} onChange={e => setForm({ ...form, block: e.target.value })} placeholder="सदर" required />

          <label style={labelStyle}>पिनकोड *</label>
          <input style={inputStyle} value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} placeholder="226001" required />

          <label style={labelStyle}>गाँव (optional)</label>
          <input style={inputStyle} value={form.village} onChange={e => setForm({ ...form, village: e.target.value })} placeholder="गाँव का नाम" />

          <label style={labelStyle}>आप कौन हैं? *</label>
          <select style={inputStyle} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="user">User — सेवाएं बुक करना है</option>
            <option value="vendor">Vendor — अपनी सेवाएं देना है (DJ, Tent etc.)</option>
            <option value="pandit">Pandit — पूजा पाठ सेवाएं देना है</option>
          </select>

          {(form.role === "vendor" || form.role === "pandit") && (
            <>
              <label style={labelStyle}>
                {form.role === "pandit" ? "पंडित का नाम / संस्था का नाम *" : "बिज़नेस का नाम *"}
              </label>
              <input 
                style={inputStyle} 
                value={form.business_name} 
                onChange={e => setForm({ ...form, business_name: e.target.value })} 
                placeholder={form.role === "pandit" ? "पंडित राम दत्त शास्त्री" : "शर्मा टेंट हाउस"} 
                required 
              />

              <label style={labelStyle}>सेवाएं (comma से अलग करें) *</label>
              <input 
                style={inputStyle} 
                value={form.service_types} 
                onChange={e => setForm({ ...form, service_types: e.target.value })} 
                placeholder={form.role === "pandit" ? "BhoomiPooja, GrihaPravesh, VastuShanti" : "Decoration, Catering, DJ"} 
                required 
              />
            </>
          )}

          {msg && <p style={{ color: "red", fontSize: 14, marginBottom: 12 }}>{msg}</p>}

          <button type="submit" disabled={loading} style={{ width: "100%", background: "#b5451b", color: "#fff", padding: "14px", borderRadius: 10, fontWeight: 800, fontSize: 17, border: "none", cursor: "pointer" }}>
            {loading ? "सेव हो रहा है..." : "प्रोफाइल सेव करें →"}
          </button>
        </form>
      </div>
    </div>
  );
}
