"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Linkedin, Twitter } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Simple validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    
    // For prototype, we'll just redirect to dashboard after a small delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  const handleSocialRegister = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <>
      <form onSubmit={handleRegister} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-neutral-500 dark:focus:border-neutral-400 focus:outline-none"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-neutral-500 dark:focus:border-neutral-400 focus:outline-none"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-neutral-500 dark:focus:border-neutral-400 focus:outline-none"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-neutral-500 dark:focus:border-neutral-400 focus:outline-none"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-neutral-500 dark:focus:ring-neutral-400"
          />
          <label
            htmlFor="terms"
            className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300"
          >
            I agree to the <a href="#" className="font-medium underline">Terms of Service</a> and <a href="#" className="font-medium underline">Privacy Policy</a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white dark:text-neutral-900 bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300 dark:border-neutral-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={handleSocialRegister}
            className="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <span className="sr-only">Sign up with LinkedIn</span>
            <Linkedin className="h-5 w-5 text-[#0A66C2]" />
          </button>

          <button
            onClick={handleSocialRegister}
            className="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <span className="sr-only">Sign up with Twitter</span>
            <Twitter className="h-5 w-5 text-[#1DA1F2]" />
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
        >
          Sign in
        </Link>
      </div>
    </>
  );
} 