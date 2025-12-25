"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/contact#faq" },
  { label: "Privacy Policy", href: "/contact#privacy" },
];

const accountLinks = [
  { label: "Login / Register", href: "/login" },
  { label: "My Account", href: "/account" },
  { label: "Cart", href: "/cart" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Shop", href: "/products" },
];

const social = [
  { label: "Facebook", icon: Facebook, color: "#1877F2" },
  { label: "Instagram", icon: Instagram, color: "#E4405F" },
  { label: "Twitter", icon: Twitter, color: "#1DA1F2" },
  { label: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white">
      <div className="my-container py-14 md:py-16">
        <div className="grid gap-10 md:gap-12 lg:gap-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h4 className="text-3xl font-bold">Exclusive</h4>
            <p className="text-sm text-white/70 leading-relaxed">
              Premium products, fast delivery, and a seamless experience crafted
              for you.
            </p>
            <div className="mt-4 space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide">
                Subscribe
              </p>
              <p className="text-sm text-white/70">
                Get 10% off your first order
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white"
                />
                <Button
                  variant="secondary"
                  className="bg-white text-black hover:bg-white/90"
                >
                  Join
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              {social.map(({ label, icon: Icon, color }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:-translate-y-0.5 hover:opacity-90"
                  style={{ backgroundColor: color }}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold">Support</h4>
            <p className="text-sm text-white/70 leading-relaxed">
              Alexandria, Egypt.
            </p>
            <p className="text-sm text-white/80">
              mohammed.aashraf31@gmail.com
            </p>
            <p className="text-sm text-white/80">+201017072893</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold">My Account</h4>
            <div className="flex flex-col gap-2 text-sm text-white/80">
              {accountLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-white/80">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/60 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TechneStore. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/about" className="hover:text-white transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-white transition">
              Contact
            </Link>
            <Link href="/products" className="hover:text-white transition">
              Products
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
