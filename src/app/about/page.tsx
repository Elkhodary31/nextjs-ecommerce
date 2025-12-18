import Image from "next/image";
import type { ReactNode } from "react";
import { getMytoken } from "@/app/utilities/getMyToken";
import {
  ShoppingBag,
  TrendingUp,
  Users,
  DollarSign,
  Truck,
  Headset,
  ShieldCheck,
} from "lucide-react";

export const revalidate = 60;

async function getOrdersCount(): Promise<number> {
  try {
    const token = await getMytoken();
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/orders", {
      method: "GET",
      headers: token
        ? ({ token: String(token) } as HeadersInit)
        : ({} as HeadersInit),
      // Keep it fresh-ish but cacheable on the server
      next: { revalidate: 60 },
    });

    // if (!res.ok) return 0;
    const data = (await res.json()) as { orders: any[] };
    return data.results;
  } catch {
    return 0;
  }
}

export default async function Page() {
  const ordersCount = await getOrdersCount();
  console.log("ordersCount", ordersCount);
  // Fake KPIs (can be wired up later)
  const monthlySales = 1280; // products/month
  const activeCustomers = 3420; // users active
  const annualGross = 124_500; // USD

  return (
    <div className="my-container pt-28 md:pt-32 pb-20">
      {/* Story */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Our Story
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            We started with a simple idea: make shopping delightful, fast, and
            reliable. From carefully curated products to a seamless checkout,
            our focus is your experience. Thanks for being part of our journey.
          </p>
        </div>
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl shadow-md group">
          {/* Replace the src below with your real photo later */}
          <Image
            src="/images/profile.png"
            alt="Founder photo"
            fill
            className="object-contain  transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            priority
          />
        </div>
      </section>

      {/* Stats */}
      <section className="mt-16 md:mt-20">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          By The Numbers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            icon={<ShoppingBag className="h-6 w-6" />}
            label="Total Orders"
            value={ordersCount.toLocaleString()}
            accent="from-emerald-500/15 to-emerald-500/5"
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6" />}
            label="Monthly Product Sales"
            value={`${monthlySales.toLocaleString()}`}
            accent="from-indigo-500/15 to-indigo-500/5"
          />
          <StatCard
            icon={<Users className="h-6 w-6" />}
            label="Active Customers"
            value={activeCustomers.toLocaleString()}
            accent="from-amber-500/15 to-amber-500/5"
          />
          <StatCard
            icon={<DollarSign className="h-6 w-6" />}
            label="Annual Gross Sales"
            value={`$${annualGross.toLocaleString()}`}
            accent="from-pink-500/15 to-pink-500/5"
          />
        </div>
      </section>

      {/* Perks */}
      <section className="mt-16 md:mt-20">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          Why Shop With Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <PerkCard
            icon={<Truck className="h-6 w-6" />}
            title="Free & Fast Delivery"
            desc="Get your orders quickly with tracked shipping on us."
          />
          <PerkCard
            icon={<Headset className="h-6 w-6" />}
            title="24/7 Customer Service"
            desc="We’re here around the clock whenever you need help."
          />
          <PerkCard
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Money-Back Guarantee"
            desc="Shop with confidence with easy, no-hassle returns."
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent = "from-emerald-500/15 to-emerald-500/5",
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="relative rounded-xl border bg-gradient-to-b p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-b ${accent} pointer-events-none`}
      />
      <div className="relative flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/70 border transition-transform duration-300 group-hover:scale-105">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

function PerkCard({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group rounded-xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold leading-none mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}
