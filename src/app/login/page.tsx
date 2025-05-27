"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import * as yup from "yup";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bot, Lock, Zap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { DynamicForm } from "@/components/DynamicForm";
import { Button } from "@/components/ui/button";

// Validation Schema
const schema = yup.object({
  phoneNumber: yup.string().required("Phone number is required"),
  password: yup.string().required("Password is required"),
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
    color: "#E5E7EB",
    icon: <Lock className="mb-2" />,
  },
  {
    id: 3,
    content: "Lightning Performance. <100ms Latency.",
    color: "#E5E7EB",
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
    color: "#E5E7EB",
    icon: <Lock className="mb-2" />,
  },
  {
    id: 6,
    content: "Enterprise Security. 256-bit SSL.",
    color: "#E5E7EB",
    icon: <Lock className="mb-2" />,
  },
  {
    id: 7,
    content: "Enterprise Security. 256-bit SSL.",
    color: "#E5E7EB",
    icon: <Lock className="mb-2" />,
  },
];

// Left Side Component (Animated Boxes)
const LeftSide = () => {
  const [items, setItems] = useState([...cards]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isAnimatingRef = useRef(false);

  const swapCards = useCallback(() => {
    if (isAnimatingRef.current) return;
    setItems((prev) => {
      const newItems = [...prev];
      const firstItem = newItems.shift();
      if (firstItem) newItems.push(firstItem);
      return newItems;
    });
  }, []);

  useEffect(() => {
    const startInterval = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(swapCards, 3000);
    };
    startInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [swapCards]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="hidden lg:flex lg:w-3/5 flex-col rounded-lg overflow-hidden justify-center px-16 xl:px-24 relative"
    >
      <div className="absolute inset-0 bg-red-500"></div>
      <div className="grid grid-cols-3 grid-rows-3 gap-6 w-[700px] h-[580px] relative z-10">
        {items.map((card, index) => {
          const isLargeBox = index === 0;
          return (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onAnimationStart={() => (isAnimatingRef.current = true)}
              onAnimationComplete={() => (isAnimatingRef.current = false)}
              className={`p-6 rounded-xl font-semibold shadow-md backdrop-blur-sm hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center animate-border will-change-transform ${
                card.color === "gradient"
                  ? "bg-[#E0F2FE] text-[#1F2937] opacity-100"
                  : `bg-[#E5E7EB] text-[#1F2937] ${
                      isLargeBox ? "opacity-100" : "opacity-80"
                    }`
              }`}
              style={{
                gridColumn: isLargeBox ? "span 3" : "span 1",
                gridRow: isLargeBox ? "span 4" : "span 1",
              }}
            >
              {card.icon && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className={
                    isLargeBox
                      ? "w-12 h-12 text-[#FF6347]"
                      : "w-8 h-8 text-[#FF6347]"
                  }
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
    </motion.div>
  );
};

// Right Side Component (Login Form)
const RightSide = ({ isLoading }: { isLoading: boolean }) => {
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async (data: {
    phoneNumber: string;
    password: string;
  }) => {
    try {
      await signIn(data.phoneNumber, data.password);
      toast.success("Login Successful", { description: "Welcome to Flaro!" });
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Login Failed", {
        description: error.message || "Invalid phone number or password",
      });
    }
  };

  const formFields: {
    name: string;
    label: string;
    type: "text" | "email" | "password" | "phone";
    placeholder: string;
    defaultCode?: string;
  }[] = [
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "phone",
      placeholder: "Enter your phone number",
      defaultCode: "+91",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full lg:w-2/5 flex items-center justify-center px-6 lg:px-12"
    >
      <div className="w-full max-w-md bg-white text-[#1F2937] border border-gray-200 rounded-3xl shadow-lg">
        <div className="text-center pb-8 pt-12">
          <h2 className="text-3xl font-bold mb-2 text-[#1F2937]">Log In</h2>
          <p className="text-gray-500 text-sm">Welcome Back To Flaro.</p>
        </div>
        <div className="space-y-6 pb-12 px-8">
          <DynamicForm
            fields={formFields}
            onSubmit={handleLogin}
            validationSchema={schema}
            renderButton={(handleSubmit) => (
              <motion.div whileTap={{ scale: 0.95, y: 2 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="w-full bg-[#FF6347] text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:bg-[#FF7F50] text-lg"
                >
                  {isLoading ? "Logging In..." : "Log In"}
                </Button>
              </motion.div>
            )}
          />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="bg-white border-gray-300 text-[#1F2937] hover:bg-gray-100 rounded-xl h-12"
            >
              Google
            </Button>
            <Button
              variant="outline"
              className="bg-white border-gray-300 text-[#1F2937] hover:bg-gray-100 rounded-xl h-12"
            >
              Facebook
            </Button>
          </div>
          <p className="text-center text-gray-500">
            Dont have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-[#FF6347] hover:text-[#FF7F50] font-semibold"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
export default function LoginPage() {
  const { isLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-row bg-white p-4">
      <LeftSide />
      <RightSide isLoading={isLoading} />
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
          border-image: linear-gradient(to right, #ff6347, transparent) 1;
          animation: border-glow 3s infinite ease-in-out;
          will-change: border-image;
        }
        @keyframes border-glow {
          0%,
          100% {
            border-image: linear-gradient(to right, #ff6347, transparent) 1;
          }
          50% {
            border-image: linear-gradient(to right, transparent, #ff6347) 1;
          }
        }
        .will-change-transform {
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
