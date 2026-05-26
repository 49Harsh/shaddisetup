"use client";
import { useLang } from "@/lib/langContext";

export default function LangToggle() {
  const { lang, toggle } = useLang();
  const isHindi = lang === "hi";

  return (
    <div
      onClick={toggle}
      title={isHindi ? "Switch to English" : "हिंदी में देखें"}
      style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", userSelect: "none" }}
    >
      <span style={{ fontSize: 12, fontWeight: 700, color: !isHindi ? "#b5451b" : "#aaa", transition: "color 0.2s" }}>
        ENG
      </span>

      {/* Track */}
      <div style={{
        width: 44, height: 24, borderRadius: 12,
        background: isHindi ? "#b5451b" : "#ddd",
        position: "relative", transition: "background 0.25s", flexShrink: 0,
      }}>
        {/* Knob */}
        <div style={{
          position: "absolute", top: 3,
          left: isHindi ? 23 : 3,
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          transition: "left 0.25s",
        }} />
      </div>

      <span style={{ fontSize: 12, fontWeight: 700, color: isHindi ? "#b5451b" : "#aaa", transition: "color 0.2s" }}>
        हिंदी
      </span>
    </div>
  );
}
