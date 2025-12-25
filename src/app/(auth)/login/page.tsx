"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import loginImage from "@/../public/images/login.svg";
import { ILoginRequest } from "@/lib/interfaces/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";

export default function LoginPage() {
  const [errorCount, setErrorCount] = useState(0);
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      toast.success("You are already logged in!");
      router.push("/");
    }
  }, [status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginRequest>({
    mode: "onBlur",
  });

  // Prevent hydration mismatch by not rendering until session is checked
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // If authenticated, don't render the form (will redirect via useEffect)
  if (status === "authenticated") {
    return null;
  }

  async function handleLogin(data: ILoginRequest) {
    const x = await signIn("credentials", {
      redirect: false,
      ...data,
    });
    if (x?.ok) {
      router.push("/");
    } else {
      setErrorCount((prev) => prev + 1);
      setError(x?.error || "Login failed");
    }
  }
  return (
    <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-yellow-400 to-red-500">
      {/* IMAGE */}
      <div className="hidden md:flex items-center justify-center p-10">
        <Image src={loginImage} alt="Login" width={400} height={400} priority />
      </div>
      {/* FORM */}
      <div className="flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8 rounded-2xl shadow-xl">
          <Link href="/" className="block text-center text-3xl font-bold mb-2">
            Techne<span className="text-red-500">Store</span>
          </Link>

          <p className="text-sm text-gray-500 text-center mb-6">
            Login to your account
          </p>

          {error && (
            <div className="mb-4 p-3 text-sm bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit(handleLogin)}
            className="space-y-4"
            noValidate
          >
            {/* EMAIL */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                })}
                className={`w-full h-12 px-4 rounded-lg border
                  ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 focus:border-yellow-400"
                  }
                  focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              <p className="mt-1 min-h-[16px] text-xs text-red-500">
                {errors.email?.message ?? "\u00A0"}
              </p>
            </div>

            {/* PASSWORD */}
            <div>
              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
                className={`w-full h-12 px-4 rounded-lg border
                  ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300 focus:border-yellow-400"
                  }
                  focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              <p className="mt-1 min-h-[16px] text-xs text-red-500">
                {errors.password?.message ?? "\u00A0"}
              </p>
            </div>

            {/* FORGOT PASSWORD HINT */}
            {errorCount >= 2 && (
              <p className="text-sm text-red-600">
                Forgot your password?{" "}
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="underline font-medium hover:text-red-700"
                >
                  Reset it here
                </button>
              </p>
            )}

            {/* FORGOT PASSWORD LINK - Always visible */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Forgot password?
              </button>
            </div>

            {/* SUBMIT */}
            <button
              disabled={isSubmitting}
              className="w-full h-12 rounded-lg bg-gradient-to-r
                         from-yellow-400 to-red-500 text-white font-medium
                         hover:opacity-90 transition
                         disabled:opacity-60"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* GOOGLE (UI ONLY) */}
          <button
            type="button"
            className="mt-4 w-full h-12 rounded-lg border flex
                       items-center justify-center gap-2 text-sm
                       hover:bg-gray-50 transition"
          >
            <span className="text-red-500 font-bold ">G</span>
            Continue with Google
          </button>

          {/* FOOTER */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <Link href="/register" className="text-red-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      {/* FORGOT PASSWORD MODAL */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />{" "}
    </section>
  );
}
