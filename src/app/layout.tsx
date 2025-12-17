import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import AuthProvider from "@/context/AuthProvider";
import WishlistHydrator from "@/components/WishlistHydrator";

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
      <body>
        <AuthProvider>
          <Navbar />
          <WishlistHydrator />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
