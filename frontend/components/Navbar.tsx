"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "होम" },
  { href: "/browse", label: "Services देखें" },
  { href: "/pooja", label: "🙏 Pooja" },
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
  const pathname = usePathname();

  // Re-check user on every route change — fixes navbar not updating after login
  useEffect(() => {
    const u = localStorage.getItem("user");
    setUser(u ? JSON.parse(u) : null);
  }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    // Also listen for storage changes (cross-tab)
    function handleStorage() {
      const u = localStorage.getItem("user");
      setUser(u ? JSON.parse(u) : null);
    }
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("storage", handleStorage);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("storage", handleStorage);
    };
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
        <ul style={{ display: "flex", gap: 20, listStyle: "none", margin: 0 }} className="desktop-nav">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} style={{ textDecoration: "none", color: pathname === l.href ? "#b5451b" : "#333", fontSize: 15, fontWeight: 600 }}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }} className="desktop-nav">
          {user ? (
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ background: "#f5f5f5", border: "1.5px solid #eee", borderRadius: 10, padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 700, color: "#333" }}>
                <span style={{ background: "#b5451b", color: "#fff", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>
                  {displayName.charAt(0).toUpperCase()}
                </span>
                {displayName.split(" ")[0]}
                <span style={{ fontSize: 11, color: "#888" }}>{dropdownOpen ? "▲" : "▼"}</span>
              </button>

              {dropdownOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", border: "1.5px solid #eee", borderRadius: 12, minWidth: 210, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", overflow: "hidden", zIndex: 200 }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: "#111", marginBottom: 2 }}>{displayName}</p>
                    <span style={{ fontSize: 12, background: "#b5451b", color: "#fff", padding: "2px 10px", borderRadius: 20, fontWeight: 700 }}>
                      {user.role === "vendor" ? "🏪 Vendor" : user.role === "admin" ? "⚙️ Admin" : "👤 User"}
                    </span>
                  </div>
                  <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", textDecoration: "none", color: "#333", fontSize: 15, fontWeight: 600, borderBottom: "1px solid #f0f0f0" }}>
                    👤 मेरा Dashboard
                  </Link>
                  <Link href="/my-orders" onClick={() => setDropdownOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", textDecoration: "none", color: "#333", fontSize: 15, fontWeight: 600, borderBottom: "1px solid #f0f0f0" }}>
                    📋 मेरे Orders
                  </Link>
                  {user.role === "vendor" && (
                    <Link href="/vendor/orders" onClick={() => setDropdownOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", textDecoration: "none", color: "#333", fontSize: 15, fontWeight: 600, borderBottom: "1px solid #f0f0f0" }}>
                      � Vendor Orders
                    </Link>
                  )}
                  <button onClick={logout}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "none", border: "none", color: "#e53e3e", fontSize: 15, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
                    🚪 लॉगआउट
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" style={{ background: "#b5451b", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
              Login / Sign Up
            </Link>
          )}
        </div>

        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", fontSize: 28, cursor: "pointer", display: "none" }} className="hamburger">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{ background: "#fff", borderTop: "1px solid #eee", padding: "16px 20px" }}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ display: "block", padding: "12px 0", fontSize: 17, fontWeight: 600, color: "#333", textDecoration: "none", borderBottom: "1px solid #f0f0f0" }}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}
                style={{ display: "block", padding: "12px 0", fontSize: 17, fontWeight: 600, color: "#333", textDecoration: "none", borderBottom: "1px solid #f0f0f0" }}>
                👤 Dashboard
              </Link>
              <Link href="/my-orders" onClick={() => setOpen(false)}
                style={{ display: "block", padding: "12px 0", fontSize: 17, fontWeight: 600, color: "#333", textDecoration: "none", borderBottom: "1px solid #f0f0f0" }}>
                � मेरे Orders
              </Link>
              <button onClick={logout}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 0", fontSize: 17, fontWeight: 600, color: "#e53e3e", background: "none", border: "none", cursor: "pointer" }}>
                🚪 लॉगआउट
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)}
              style={{ display: "block", marginTop: 12, background: "#b5451b", color: "#fff", padding: "12px 20px", borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: "none", textAlign: "center" }}>
              Login / Sign Up
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
