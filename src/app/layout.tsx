import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import AuthProvider from "@/context/AuthProvider";
import { CartProvider } from "@/context/CartProvider";
import WishlistHydrator from "@/components/WishlistHydrator";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "My Shop",
  description: "E-commerce app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <NextTopLoader
              color="#2563eb"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #2563eb,0 0 5px #2563eb"
            />
            <Toaster position="bottom-right" />
            <Navbar />
            <WishlistHydrator />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
