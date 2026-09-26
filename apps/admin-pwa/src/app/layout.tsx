import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import NetworkStatus from "@/components/NetworkStatus";

export const metadata: Metadata = {
  title: "ScanServe Platform Admin",
  description: "Platform administration for ScanServe",
  themeColor: "#0F1B2D",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "OrderMitra Admin",
    statusBarStyle: "black-translucent",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans bg-gray-50 text-gray-900 flex">
        <NetworkStatus />
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 ml-[260px]">
          <Topbar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
