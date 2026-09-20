import type { Metadata } from "next";
import { Special_Elite } from "next/font/google";
import "./globals.css";

const specialElite = Special_Elite({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite"
});

export const metadata: Metadata = {
  title: "Deduxis — Receipt Intelligence",
  description: "Capture receipts, extract line items, categorize deductions, export for tax time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${specialElite.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
