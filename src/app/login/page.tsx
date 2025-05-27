"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as yup from "yup";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Bot, Lock, Zap } from "lucide-react";

// Validation Schema
const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

// Static card data with Lucide React icons
const cards = [
  {
    id: 1,
    content: "AI-Powered Calling. 99.9% Accuracy.",
    color: "gradient",
    icon: <Bot className="mb-2" />,
  },
  {
    id: 2,
    content: "Enterprise Security. 256-bit SSL.",
    color: "#F9FAFB",
    icon: <Lock className="mb-2" />,
  },
  {
    id: 3,
    content: "Lightning Performance. <100ms Latency.",
    color: "#F9FAFB",
    icon: <Zap className="mb-2" />,
  },
  {
    id: 4,
    content: "AI-Powered Calling. 99.9% Accuracy.",
    color: "gradient",
    icon: <Bot className="mb-2" />,
  },
  {
    id: 5,
    content: "Enterprise Security. 256-bit SSL.",
    color: "#F9FAFB",
    icon: <Lock className="mb-2" />,
  },
  {
    id: 6,
    content: "Enterprise Security. 256-bit SSL.",
    color: "#F9FAFB",
    icon: <Lock className="mb-2" />,
  },
];

// Left Side Component (Animated Boxes)
const LeftSide = () => {
  const [items, setItems] = useState([...cards]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const renderCountRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const [currentTime, setCurrentTime] = useState(""); // Store time for debug panel

  // Only log on the client
  useEffect(() => {
    console.log("LeftSide component rendered at", new Date().toISOString());
    renderCountRef.current += 1;
    console.log("Render count:", renderCountRef.current);
  }, []);

  const swapCards = useCallback(() => {
    if (isAnimatingRef.current) {
      console.log(
        "Animation in progress, delaying swapCards at",
        new Date().toISOString()
      );
      return;
    }

    console.log("swapCards function called at", new Date().toISOString());
    setItems((prev) => {
      console.log(
        "Before swap - items order:",
        prev.map((item) => item.id)
      );
      const newItems = [...prev];
      const firstItem = newItems.shift();
      if (firstItem) {
        newItems.push(firstItem);
      }
      console.log(
        "After swap - items order:",
        newItems.map((item) => item.id)
      );
      return newItems;
    });
  }, []);

  useEffect(() => {
    console.log("Starting interval for swapCards at", new Date().toISOString());

    const startInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        console.log(
          "Interval tick - calling swapCards at",
          new Date().toISOString()
        );
        swapCards();
      }, 3000);
    };

    startInterval();

    return () => {
      console.log("Cleaning up interval");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [swapCards]);

  useEffect(() => {
    console.log(
      "Items state changed:",
      items.map((item) => ({
        id: item.id,
        content: item.content.substring(0, 20) + "...",
      }))
    );
  }, [items]);

  // Update current time on the client only
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    updateTime(); // Initial update
    const timeInterval = setInterval(updateTime, 1000); // Update every second
    return () => clearInterval(timeInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex lg:w-3/5 flex-col rounded-lg overflow-hidden justify-center px-16 xl:px-24 relative"
    >
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

      <div className="grid grid-cols-3 grid-rows-3 gap-6 w-[700px] h-[580px] relative z-10">
        {items.map((card, index) => {
          const isLargeBox = index === 0;
          console.log(
            `Rendering card ${card.id} at index ${index} (Render ${renderCountRef.current}):`,
            {
              gridColumn: isLargeBox ? "span 2" : "span 1",
              gridRow: isLargeBox ? "span 2" : "span 1",
              content: card.content.substring(0, 30) + "...",
            }
          );

          return (
            <motion.div
              key={card.id}
              layout={true}
              initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onAnimationStart={() => {
                console.log(
                  `Animation started for card ${
                    card.id
                  } at ${new Date().toISOString()}`
                );
                isAnimatingRef.current = true;
              }}
              onAnimationComplete={() => {
                console.log(
                  `Animation completed for card ${
                    card.id
                  } at ${new Date().toISOString()}`
                );
                isAnimatingRef.current = false;
              }}
              className={`p-6 rounded-xl font-semibold shadow-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center animate-border will-change-transform ${
                card.color === "gradient"
                  ? "bg-gradient-to-br from-[#DC2625] to-[#B91C1C] text-white"
                  : `bg-[#F9FAFB]/80 text-black ${
                      isLargeBox ? "opacity-100" : "opacity-80"
                    }`
              }`}
              style={{
                gridColumn: isLargeBox ? "span 2" : "span 1",
                gridRow: isLargeBox ? "span 2" : "span 1",
              }}
              ref={(el) => {
                if (el && typeof window !== "undefined") {
                  const rect = el.getBoundingClientRect();
                  console.log(
                    `Card ${card.id} position (Render ${renderCountRef.current}):`,
                    {
                      top: rect.top,
                      left: rect.left,
                      width: rect.width,
                      height: rect.height,
                    }
                  );
                }
              }}
            >
              {card.icon && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className={isLargeBox ? "w-12 h-12" : "w-8 h-8"}
                >
                  {card.icon}
                </motion.div>
              )}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={
                  isLargeBox
                    ? "text-xl font-bold leading-tight text-center"
                    : "text-sm font-medium leading-tight text-center"
                }
              >
                {card.content}
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded text-xs z-20">
        <div>Current order: {items.map((item) => item.id).join(", ")}</div>
        <div>Render count: {renderCountRef.current}</div>
        <div>Time: {currentTime || "Loading..."}</div>
      </div>
    </motion.div>
  );
};

// Right Side Component (Login Form)
const RightSide = ({ formData, setFormData, isLoading, handleLogin }: any) => {
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (field: any, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
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
            {[
              { key: "firstName", placeholder: "First Name", type: "text" },
              { key: "lastName", placeholder: "Last Name", type: "text" },
              { key: "email", placeholder: "Email", type: "email" },
            ].map((field) => (
              <motion.div
                key={field.key}
                className="relative"
                animate={{
                  scale: focusedField === field.key ? 1.02 : 1,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-[rgba(0,0,0,0)]"
                  animate={{
                    borderColor:
                      focusedField === field.key ? "#DC2625" : "rgba(0,0,0,0)",
                    opacity: focusedField === field.key ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                <Input
                  id={field.key}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.key]}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  onFocus={() => setFocusedField(field.key as any)}
                  onBlur={() => setFocusedField(null)}
                  className="relative z-10 bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-[#DC2625] rounded-xl h-12"
                  required={field.key === "email"}
                />
              </motion.div>
            ))}

            <motion.div whileTap={{ scale: 0.95, y: 2 }}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#DC2625] text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:bg-[#B91C1C] text-lg"
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Button>
            </motion.div>
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
            <motion.div whileTap={{ scale: 0.95, y: 2 }}>
              <Button
                variant="outline"
                className="bg-white border-gray-300 text-black hover:bg-gray-100 rounded-xl h-12"
              >
                Google
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95, y: 2 }}>
              <Button
                variant="outline"
                className="bg-white border-gray-300 text-black hover:bg-gray-100 rounded-xl h-12"
              >
                Facebook
              </Button>
            </motion.div>
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
  );
};

// Main Component
export default function LoginPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await schema.validate(formData, { abortEarly: false });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Sign Up Successful", {
        description: "Welcome to Flaro!",
      });
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((err) => {
          toast.error("Validation Error", {
            description: err.message,
          });
        });
      } else {
        toast.error("Sign Up Failed", {
          description: "Invalid input",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-row bg-white p-4">
      <LeftSide />
      <RightSide
        formData={formData}
        setFormData={setFormData}
        isLoading={isLoading}
        handleLogin={handleLogin}
      />

      <style jsx>{`
        .animate-border {
          position: relative;
          overflow: hidden;
        }
        .animate-border::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 2px solid transparent;
          border-image: linear-gradient(to right, #dc2625, transparent) 1;
          animation: border-glow 3s infinite ease-in-out;
          will-change: border-image;
        }
        @keyframes border-glow {
          0%,
          100% {
            border-image: linear-gradient(to right, #dc2625, transparent) 1;
          }
          50% {
            border-image: linear-gradient(to right, transparent, #dc2625) 1;
          }
        }
        .will-change-transform {
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
