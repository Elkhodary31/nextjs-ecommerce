"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from "@/lib/services/auth.service";
import {
  emailSchema,
  resetCodeSchema,
  newPasswordSchema,
  EmailFormData,
  ResetCodeFormData,
  NewPasswordFormData,
} from "@/lib/validations/forgotPassword.schema";
import toast from "react-hot-toast";
import { X } from "lucide-react";

type Step = "email" | "code" | "password";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: "onBlur",
  });

  const codeForm = useForm<ResetCodeFormData>({
    resolver: zodResolver(resetCodeSchema),
    mode: "onBlur",
  });

  const passwordForm = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    mode: "onBlur",
  });

  const handleClose = () => {
    setStep("email");
    setEmail("");
    emailForm.reset();
    codeForm.reset();
    passwordForm.reset();
    onClose();
  };

  // Step 1: Send reset code
  const handleSendCode = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      setEmail(data.email);
      setStep("code");
      toast.success("Reset code sent to your email!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset code");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (data: ResetCodeFormData) => {
    setIsLoading(true);
    try {
      await verifyResetCode(data.resetCode);
      setStep("password");
      toast.success("Code verified successfully!");
    } catch (error: any) {
      toast.error(error.message || "Invalid reset code");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (data: NewPasswordFormData) => {
    setIsLoading(true);
    try {
      await resetPassword(email, data.newPassword);
      toast.success("Password reset successfully! Please login.");
      handleClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === "email" && "Forgot Password?"}
            {step === "code" && "Enter Reset Code"}
            {step === "password" && "Reset Password"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {step === "email" && "Enter your email to receive a reset code"}
            {step === "code" && "Check your email for the 6-digit code"}
            {step === "password" && "Enter your new password"}
          </p>
        </div>

        {/* Step 1: Email */}
        {step === "email" && (
          <form
            onSubmit={emailForm.handleSubmit(handleSendCode)}
            className="space-y-4"
          >
            <div>
              <input
                type="email"
                placeholder="Email address"
                {...emailForm.register("email")}
                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {emailForm.formState.errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-lg bg-gradient-to-r from-yellow-400 to-red-500 text-white font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {isLoading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {/* Step 2: Code */}
        {step === "code" && (
          <form
            onSubmit={codeForm.handleSubmit(handleVerifyCode)}
            className="space-y-4"
          >
            <div>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                {...codeForm.register("resetCode")}
                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-center text-2xl tracking-widest"
              />
              {codeForm.formState.errors.resetCode && (
                <p className="mt-1 text-xs text-red-500">
                  {codeForm.formState.errors.resetCode.message}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="flex-1 h-12 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-12 rounded-lg bg-gradient-to-r from-yellow-400 to-red-500 text-white font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === "password" && (
          <form
            onSubmit={passwordForm.handleSubmit(handleResetPassword)}
            className="space-y-4"
          >
            <div>
              <input
                type="password"
                placeholder="New password"
                {...passwordForm.register("newPassword")}
                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Confirm password"
                {...passwordForm.register("confirmPassword")}
                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-lg bg-gradient-to-r from-yellow-400 to-red-500 text-white font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
