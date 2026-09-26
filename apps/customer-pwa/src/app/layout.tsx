import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

import NetworkStatus from "@/components/NetworkStatus";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "OrderMitra Menu",
  description: "Browse the menu and place your order.",
  themeColor: "#1D3557",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "OrderMitra",
    statusBarStyle: "black-translucent",
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} antialiased h-full`}>
      <body className="h-full bg-gray-50 text-gray-900 font-sans selection:bg-[#E8A93A] selection:text-white">
        <NetworkStatus />
        <Toaster position="bottom-center" richColors />
        {/* Mobile App Container */}
        <div className="mx-auto max-w-md bg-white min-h-full shadow-2xl relative overflow-x-hidden flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
