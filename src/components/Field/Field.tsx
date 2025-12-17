"use client";
import { IField } from "@/lib/interfaces/field";

export function Field({ register, error, placeholder, type = "text" }: IField) {
  return (
    <div>
      <input
        {...register}
        type={type}
        placeholder={placeholder}
        className={`w-full h-12 px-4 rounded-lg border text-sm transition 
          focus:outline-none focus:ring-2
          ${
            error
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-black focus:ring-black/10"
          }`}
      />
      <p className="mt-1 min-h-[16px] text-xs text-red-500">
        {error ?? "\u00A0"}
      </p>
    </div>
  );
}
