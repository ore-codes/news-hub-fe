"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { register as registerApi } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/types";

const schema = yup.object({
  name: yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  password_confirmation: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

type FormData = yup.InferType<typeof schema>;

export default function RegisterPage() {
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
      await registerApi(data);
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
        <h2 className="text-3xl font-bold mb-2">Join News Hub Today!</h2>
        <p className="text-neutral-600 mb-2">Create your free account to personalize your news, save articles, and get the latest headlines delivered to you.</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg p-8 border-t border-b border-neutral-200"
        noValidate
      >
        <h3 className="text-2xl font-bold mb-6 text-center">Register</h3>
        {backendError && <div className="mb-4 text-red-600 text-sm text-center">{backendError}</div>}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-neutral-700">Name</label>
          <input
            type="text"
            placeholder="Your name"
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-600 ${errors.name ? "border-red-400" : "border-neutral-200"}`}
            autoComplete="name"
            {...register("name")}
            disabled={loading}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>
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
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-neutral-700">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-600 ${errors.password ? "border-red-400" : "border-neutral-200"}`}
            autoComplete="new-password"
            {...register("password")}
            disabled={loading}
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-neutral-700">Confirm Password</label>
          <input
            type="password"
            placeholder="Repeat your password"
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-600 ${errors.password_confirmation ? "border-red-400" : "border-neutral-200"}`}
            autoComplete="new-password"
            {...register("password_confirmation")}
            disabled={loading}
          />
          {errors.password_confirmation && <p className="mt-1 text-xs text-red-600">{errors.password_confirmation.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-neutral-600 text-white font-semibold hover:bg-neutral-700 transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="mt-6 text-center text-sm text-neutral-600">
          Already have an account?{' '}
          <Link href="/signin" className="text-neutral-600 hover:underline font-medium">Sign In</Link>
        </div>
      </form>
    </div>
  );
} 