import type { Metadata } from "next";
import { Inter } from "next/font/google"; 
import "./globals.css";
import Header from "@/components/Header"; 
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lumex Topluluk Sistemi",
  description: "İzmir Demokrasi Üniversitesi Öğrenci Toplulukları Yönetim Platformu",
  icons: {
    icon: '/logo.png', // public klasörüne attığımız logoyu ikon olarak çekiyor
    apple: '/logo.png', // Apple cihazlarda ana ekrana eklenirse bu görünür
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <main className="grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}