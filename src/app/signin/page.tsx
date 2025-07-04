"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { login } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/types";

const schema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function SignInPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [backendError, setBackendError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setBackendError("");
    setLoading(true);
    try {
      await login(data);
      await queryClient.refetchQueries({ queryKey: [QueryKeys.Me] });
      router.push("/");
    } catch (err: any) {
      if (err?.error) {
        setBackendError(err.error);
      } else if (err?.message) {
        setBackendError(err.message);
      } else if (typeof err === "string") {
        setBackendError(err);
      } else {
        setBackendError("An unknown error occurred");
      }
      if (err?.errors) {
        Object.entries(err.errors).forEach(([field, messages]) => {
          setError(field as keyof FormData, { type: "server", message: Array.isArray(messages) ? messages[0] : messages });
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center py-12">
      <div className="w-full max-w-3xl mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Welcome Back to News Hub!</h2>
        <p className="text-neutral-600 mb-2">Sign in to unlock personalized news and stay ahead with the latest headlines tailored just for you.</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg p-8 border-t border-b border-neutral-200"
        noValidate
      >
        <h3 className="text-2xl font-bold mb-6 text-center">Sign In</h3>
        {backendError && <div className="mb-4 text-red-600 text-sm text-center">{backendError}</div>}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-neutral-700">Email</label>
          <input
            type="email"
            placeholder="you@email.com"
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-600 ${errors.email ? "border-red-400" : "border-neutral-200"}`}
            autoComplete="email"
            {...register("email")}
            disabled={loading}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-neutral-700">Password</label>
          <input
            type="password"
            placeholder="Your password"
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-600 ${errors.password ? "border-red-400" : "border-neutral-200"}`}
            autoComplete="current-password"
            {...register("password")}
            disabled={loading}
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-neutral-600 text-white font-semibold hover:bg-neutral-700 transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <div className="mt-6 text-center text-sm text-neutral-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-neutral-600 hover:underline font-medium">Register</Link>
        </div>
      </form>
    </div>
  );
} 