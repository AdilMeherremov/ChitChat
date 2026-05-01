import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "ChitChat - chat with people",
  description: "Talk with new people in ChitChat",
};

const PoppinsFont = Poppins({
  weight: ['500']
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${PoppinsFont.className} antialiased`}>
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
