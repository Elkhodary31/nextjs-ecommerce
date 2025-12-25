import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import OrdersList from "./OrdersList";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata = {
  title: "My Orders",
  description: "View your order history",
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <OrdersList />
      </div>
    </div>
  );
}
