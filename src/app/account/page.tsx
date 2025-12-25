"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getTokenAction } from "@/app/utilities/getTokenAction";
import AddressManager from "@/components/AddressManager";
import { User, Mail, Phone } from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please login to view your account");
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchToken();
    }
  }, [status, router]);

  const fetchToken = async () => {
    try {
      const userToken = await getTokenAction();
      if (userToken) {
        setToken(userToken);
      } else {
        toast.error("Failed to load user data");
        router.push("/login");
      }
    } catch (error) {
      console.error("Token error:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="my-container pt-28 md:pt-32 pb-20">
      {/* User Info Section */}
      <section className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* User Details Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm border border-blue-200">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <User className="h-6 w-6 text-blue-600" />
              Personal Information
            </h2>

            <div className="space-y-4">
              <div className="pb-4 border-b border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {session?.user?.name || "N/A"}
                </p>
              </div>

              <div className="pb-4 border-b border-blue-200">
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {session?.user?.email || "N/A"}
                </p>
              </div>

              {session?.user?.phone && (
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {session.user.phone}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Account Status Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-sm border border-green-200">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <svg
                className="h-6 w-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Account Details
            </h2>

            <div className="space-y-4">
              <div className="pb-4 border-b border-green-200">
                <p className="text-sm text-gray-600 mb-1">Role</p>
                <p className="text-lg font-semibold text-green-600 capitalize">
                  {session?.user?.role || "user"}
                </p>
              </div>

              <div className="pb-4 border-b border-green-200">
                <p className="text-sm text-gray-600 mb-1">Account Status</p>
                <p className="text-lg font-semibold text-green-600">✓ Active</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Verification</p>
                <p className="text-lg font-semibold text-green-600">
                  ✓ Verified
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Address Management Section */}
      {token && <AddressManager token={token} />}
    </div>
  );
}
