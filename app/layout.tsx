import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/ui/Navbar";
import Cursor from "@/components/ui/Cursor";
import ScrollProgress from "@/components/ui/ScrollProgress";

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.tagline,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Cursor />
        <ScrollProgress />
        <Navbar />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
