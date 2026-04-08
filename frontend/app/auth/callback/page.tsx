"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState("Google से verify ho raha hai...");

  useEffect(() => {
    async function handleCallback() {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        setStatus("Login fail hua. Dobara try karein.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      // Backend ko token bhejo
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: session.access_token }),
        });
        const data = await res.json();

        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("storage"));

          if (!data.user.profileComplete) {
            router.push("/profile/complete");
          } else {
            router.push("/dashboard");
          }
        } else {
          setStatus("Backend error: " + (data.error || "Unknown"));
        }
      } catch {
        setStatus("Backend se connect nahi ho paya.");
      }
    }

    handleCallback();
  }, [router]);

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <p style={{ fontSize: 18, color: "#555" }}>{status}</p>
      </div>
    </div>
  );
}
