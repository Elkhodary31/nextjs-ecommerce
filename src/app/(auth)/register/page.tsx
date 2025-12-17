"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  RegisterFormData,
} from "@/lib/validations/register.schema";
import { registerService } from "@/lib/services/auth.service";
import { useState } from "react";
import { Field } from "@/components/Field/Field";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(" ");

    const { firstName, lastName, ...rest } = data;
    const name = `${firstName} ${lastName}`;
    console.log("SUBMITTING REGISTER FORM", { name, ...rest });
    try {
      await registerService({
        ...rest,
        name,
      });
      console.log("REGISTER SUCCESS");
      router.push("/");
    } catch (err: any) {
      console.log("REGISTER ERROR", err);
      setError(err?.message || "Something went wrong, please try again");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br m- from-slate-100 via-slate-200 to-slate-300 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mt-2 mb-2">
        {/* HEADER */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold block mb-2">
            Techne<span className="text-red-500">Store</span>
          </Link>

          <h1 className="text-2xl font-semibold text-gray-900">
            Create your account
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Join us today and enjoy a smooth experience ✨
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div className="flex gap-1 justify-between">
            <Field
              placeholder="First name"
              register={register("firstName")}
              error={errors.firstName?.message}
            />
            <Field
              placeholder="last name"
              register={register("lastName")}
              error={errors.lastName?.message}
            />
          </div>

          <Field
            type="email"
            placeholder="Email address"
            register={register("email")}
            error={errors.email?.message}
          />

          <Field
            placeholder="Phone number"
            register={register("phone")}
            error={errors.phone?.message}
          />

          <Field
            type="password"
            placeholder="Password"
            register={register("password")}
            error={errors.password?.message}
          />

          <Field
            type="password"
            placeholder="Confirm password"
            register={register("rePassword")}
            error={errors.rePassword?.message}
          />

          <button
            disabled={isSubmitting}
            className="w-full h-11 rounded-lg bg-black text-white font-medium
                       hover:bg-gray-700 transition cursor-pointer
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* GOOGLE LOGIN (UI ONLY) */}
        <button
          className="w-full h-11 border rounded-lg flex items-center justify-center gap-2
                     text-sm font-medium hover:bg-gray-50 transition"
        >
          <img src="/google.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        {/* FOOTER */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
