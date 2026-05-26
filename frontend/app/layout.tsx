import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { LangProvider } from "@/lib/langContext";

export const metadata: Metadata = {
  title: "ShaadiSetup.com - Wedding & Event Services",
  description: "Book decoration, catering, DJ/band and more for your wedding and events",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LangProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </LangProvider>
      </body>
    </html>
  );
}
