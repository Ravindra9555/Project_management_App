'use client'
import React from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";


const Navbar = () => {
    const [isAuthPage , setIsAuthPage] = React.useState(false);
    // Hide login and get started buttons if path is /auth/*
    React.useEffect(() => {
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/auth")) {
        setIsAuthPage(true);
      } else {
        setIsAuthPage(false);
      }
    }, []);
  return (
    <div>
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
                  ProjectFlow
                </span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/#features"
                  className="text-neutral-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Features
                </Link>
                <Link
                  href="/#pricing"
                  className="text-neutral-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Pricing
                </Link>
                <Link
                  href="/#testimonials"
                  className="text-neutral-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Testimonials
                </Link>
              </div>
            </div>
            { !isAuthPage &&(

            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-300 hover:text-white"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900">
                  Get Started
                </Button>
              </Link>
            </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
