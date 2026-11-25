import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";


export const metadata: Metadata = {
  title: "MarketPlace - Practica Endterm",
  description: "Catálogo e interfaz de productos con Next.js",
};

export default function RootLayout({ 
  children,
}: Readonly<{ children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
