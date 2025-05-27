"use client";

import { useState, useEffect } from "react";
import * as yup from "yup";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

// Validation Schema
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const cards = [
  { id: 1, content: "AI-Powered Calling. 99.9% Accuracy.", color: "gradient" },
  { id: 2, content: "Enterprise Security. 256-bit SSL.", color: "#F9FAFB" },
  {
    id: 3,
    content: "Lightning Performance. <100ms Latency.",
    color: "#F9FAFB",
  },
  { id: 4, content: "AI-Powered Calling. 99.9% Accuracy.", color: "gradient" },
  { id: 5, content: "Enterprise Security. 256-bit SSL.", color: "#F9FAFB" },
  { id: 6, content: "Enterprise Security. 256-bit SSL.", color: "#F9FAFB" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [items, setItems] = useState(cards);

  // Fix hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation for swapping cards
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const shuffled = [...prev];
        const moved = shuffled.shift();
        console.log(moved);

        shuffled.push(moved as any);
        return shuffled;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await schema.validate({ email }, { abortEarly: false });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Login Successful", {
        description: "Welcome back to Flaro!",
      });
      router.push("/dashboard");
    } catch (error: any) {
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((err: any) => {
          toast.error("Validation Error", {
            description: err.message,
          });
        });
      } else {
        toast.error("Login Failed", {
          description: error?.message || "Invalid email",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-row bg-white p-4 ">
      {/* Left Side - Animated Boxes with Isolated Dark Background */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden  lg:flex lg:w-3/5 flex-col rounded-lg overflow-hidden  justify-center px-16 xl:px-24 relative"
      >
        {/* Isolated Dark Background for Boxes Section */}
        <div className="absolute inset-0 bg-gradient-to-br from-black to-[#4A0E0D]">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" fill="none">
              <pattern
                id="hex-pattern"
                x="0"
                y="0"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M12.5 0L25 7.5V22.5L12.5 30L0 22.5V7.5L12.5 0Z"
                  stroke="#F9FAFB"
                  strokeWidth="0.5"
                  fill="none"
                />
              </pattern>
              <rect width="100%" height="100%" fill="url(#hex-pattern)" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-3 grid-rows-3 gap-6  w-[700px] h-[580px] relative z-10">
          <AnimatePresence>
            {items.map((card, index) => (
              <motion.div
                key={card.id}
                layout={true}
                initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`p-6 rounded-xl font-semibold shadow-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300 animate-border ${
                  card.color === "gradient"
                    ? "bg-gradient-to-br from-[#DC2625] to-[#B91C1C] text-white"
                    : card.color === "white"
                    ? "bg-white text-black"
                    : "bg-[#F9FAFB]/80 text-black"
                }`}
                style={{
                  gridColumn: index === 0 ? "span 2" : "span 1",
                  gridRow: index === 0 ? "span 2" : "span 1",
                }}
              >
                {card.content}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Right Side - Login Form with Updated Styling */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-2/5 flex items-center justify-center px-6 lg:px-12"
      >
        <div className="w-full max-w-md bg-gradient-to-br from-[#F9FAFB] to-white text-black border border-gray-200 rounded-3xl shadow-lg">
          <div className="text-center pb-8 pt-12">
            <h2 className="text-3xl font-bold mb-2 text-black">Sign Up</h2>
            <p className="text-gray-600 text-sm">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            </p>
          </div>

          <div className="space-y-6 pb-12 px-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="first-name"
                  type="text"
                  placeholder="First Name"
                  className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-[#DC2625] rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="last-name"
                  type="text"
                  placeholder="Last Name"
                  className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-[#DC2625] rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-[#DC2625] rounded-xl h-12"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#DC2625] text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:bg-[#B91C1C] text-lg"
              >
                {isLoading ? "Signing In..." : "Log In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#F9FAFB] text-gray-600">Or</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="bg-white border-gray-300 text-black hover:bg-gray-100 rounded-xl h-12"
              >
                Google
              </Button>
              <Button
                variant="outline"
                className="bg-white border-gray-300 text-black hover:bg-gray-100 rounded-xl h-12"
              >
                Facebook
              </Button>
            </div>

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#DC2625] hover:text-[#B91C1C] font-semibold"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
