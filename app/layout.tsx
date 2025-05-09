import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./api/auth/AuthProvider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Langner",
  description: " A language learning app that uses video chat ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <AuthProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
        </AuthProvider>
  );
}
