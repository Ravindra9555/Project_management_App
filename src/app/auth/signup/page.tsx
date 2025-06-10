"use client";
import React, { useState } from "react";
import { BackgroundBeams } from "../../components/ui/background-beams";
import Link from "next/link";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { motion } from "framer-motion";
import Navbar from "@/app/landingPage/Navbar/page";

const SignupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    setError("");
    try {
      const res = await axios.post("/api/auth/signup", { email, password });
      if (res.status === 201) {
        toast.success("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Error creating account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="relative min-h-screen w-full bg-neutral-950 flex items-center justify-center p-4">
      <BackgroundBeams className="absolute top-0 left-0 w-full h-full z-0" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="p-8 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 mb-2">
              Create Your Account
            </h1>
            <p className="text-neutral-400">Join us to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-neutral-800 border-neutral-700 hover:border-emerald-500 focus:border-emerald-500 text-white"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-neutral-800 border-neutral-700 hover:border-emerald-500 focus:border-emerald-500 text-white"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-neutral-300">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="bg-neutral-800 border-neutral-700 hover:border-emerald-500 focus:border-emerald-500 text-white"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm py-2 px-3 bg-red-500/10 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-semibold py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>

            <div className="text-center text-sm text-neutral-400 mt-4">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
              >
                Log in
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
      
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #2e2e2e'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff'
            }
          }
        }}
      />
    </div>
    </div>
  );
};

export default SignupPage;