import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlameHouse | Premium Fast Food Restaurant",
  description: "FlameHouse serves the best fire-grilled pizzas, burgers, crispy Nashville chicken, and lava beverages. Order online now for hot, blazing-fast delivery!",
  keywords: "fast food, pizza, burgers, fried chicken, food delivery, FlameHouse restaurant",
  authors: [{ name: "FlameHouse Team" }],
  openGraph: {
    title: "FlameHouse | Premium Fast Food Restaurant",
    description: "Sizzling burgers, stone-oven pizzas, and fiery fried chicken delivered straight to your door.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#0f0907] text-[#f5f2f0] selection:bg-red-500/30 selection:text-white"
      >
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
