import React from "react";
import { BackgroundBeams } from "../../components/ui/background-beams";
import Link from "next/link";
const LoginPage = () => {
  return (
    <div className="h-screen w-full  rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="flex items-center justify-center h-screen">
        <div className="flex   justify-center align-center ">
          <div className="flex flex-col items-center justify-center w-sm p-6 rounded-lg bg-neutral-950  border-zinc-100 border-2 shadow-md">
            <h1 className="relative z-10 text-xl   bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
              Sign Up to Our Platform
            </h1>
            <form className="w-full max-w-sm">
              <div className="mb-4">
                <label
                  className="block text-neutral-50 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral-50 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-neutral-50 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral-50 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password"
                />
              </div>
        
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                Sign In
              </button>
            </form>
            <h1 className="font-medium text-sm mt-2 mb-4 text-blue-700">
              Don't have an account?
            </h1>
            <Link href={"/auth/signup"}  className=" text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
              Signup
            </Link>
          </div>
        </div>
      </div>
      <BackgroundBeams className="absolute inset-0 pointer-events-none" />
    </div>
  );
};

export default LoginPage;
