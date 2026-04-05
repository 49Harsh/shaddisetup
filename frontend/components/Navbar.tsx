"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/", label: "होम" },
  { href: "/browse", label: "Services देखें" },
  { href: "/services/decoration", label: "डेकोरेशन" },
  { href: "/services/dj-band", label: "DJ / बैंड" },
  { href: "/services/catering", label: "कैटरिंग" },
  { href: "/about", label: "हमारे बारे में" },
  { href: "/contact", label: "संपर्क करें" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ full_name?: string; email?: string; role?: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));

    // Close dropdown on outside click
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
  }

  const displayName = user?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <nav style={{ background: "#fff", borderBottom: "2px solid #e5e5e5", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#b5451b", letterSpacing: 1 }}>
            ShaadiSetup<span style={{ color: "#555" }}>.com</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul style={{ display: "flex", gap: 24, listStyle: "none", margin: 0 }} className="desktop-nav">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} style={{ textDecoration: "none", color: "#333", fontSize: 16, fontWeight: 600 }}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }} className="desktop-nav">
          {user ? (
            // Logged in — user dropdown
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ background: "#f5f5f5", border: "1.5px solid #eee", borderRadius: 10, padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 700, color: "#333" }}>
                <span style={{ background: "#b5451b", color: "#fff", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>
                  {displayName.charAt(0).toUpperCase()}
                </span>
                नमस्ते, {displayName.split(" ")[0]}
                <span style={{ fontSize: 11, color: "#888" }}>{dropdownOpen ? "▲" : "▼"}</span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", border: "1.5px solid #eee", borderRadius: 12, minWidth: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", overflow: "hidden", zIndex: 200 }}>
                  {/* User info */}
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: "#111", marginBottom: 2 }}>{displayName}</p>
                    <span style={{ fontSize: 12, background: "#b5451b", color: "#fff", padding: "2px 10px", borderRadius: 20, fontWeight: 700 }}>
                      {user.role === "vendor" ? "🏪 Vendor" : user.role === "admin" ? "⚙️ Admin" : "👤 User"}
                    </span>
                  </div>

                  {/* Profile */}
                  <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", textDecoration: "none", color: "#333", fontSize: 15, fontWeight: 600, borderBottom: "1px solid #f0f0f0" }}>
                    <span>👤</span> मेरा Dashboard
                  </Link>

                  <Link href="/my-orders" onClick={() => setDropdownOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", textDecoration: "none", color: "#333", fontSize: 15, fontWeight: 600, borderBottom: "1px solid #f0f0f0" }}>
                    <span>📋</span> मेरे Orders
                  </Link>

                  {/* Logout */}
                  <button onClick={logout}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "none", border: "none", color: "#e53e3e", fontSize: 15, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
                    <span>🚪</span> लॉगआउट
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Not logged in
            <Link href="/login" style={{ background: "#b5451b", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
              लॉगिन करें
            </Link>
          )}

          {/* <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
            style={{ background: "#25D366", color: "#fff", padding: "10px 16px", borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            💬 WhatsApp
          </a> */}
        </div>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", fontSize: 28, cursor: "pointer", display: "none" }} className="hamburger">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{ background: "#fff", borderTop: "1px solid #eee", padding: "16px 20px" }}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ display: "block", padding: "12px 0", fontSize: 18, fontWeight: 600, color: "#333", textDecoration: "none", borderBottom: "1px solid #f0f0f0" }}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}
                style={{ display: "block", padding: "12px 0", fontSize: 18, fontWeight: 600, color: "#333", textDecoration: "none", borderBottom: "1px solid #f0f0f0" }}>
                👤 Dashboard — {displayName.split(" ")[0]}
              </Link>
              <button onClick={logout}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 0", fontSize: 18, fontWeight: 600, color: "#e53e3e", background: "none", border: "none", cursor: "pointer", borderBottom: "1px solid #f0f0f0" }}>
                🚪 लॉगआउट
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)}
              style={{ display: "block", marginTop: 12, background: "#b5451b", color: "#fff", padding: "12px 20px", borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: "none", textAlign: "center" }}>
              लॉगिन करें
            </Link>
          )}
          {/* <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
            style={{ display: "block", marginTop: 12, background: "#25D366", color: "#fff", padding: "12px 20px", borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: "none", textAlign: "center" }}>
            💬 WhatsApp करें
          </a> */}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
