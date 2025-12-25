import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import CheckoutForm from "./CheckoutForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata = {
  title: "Checkout",
  description: "Complete your order",
};

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <CheckoutForm />
      </div>
    </div>
  );
}
