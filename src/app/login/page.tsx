"use client";

import * as yup from "yup";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Phone,
  Shield,
  Zap,
  Star,
  ArrowRight,
  Loader2,
  Twitter,
  Github,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DynamicForm, FormField } from "@/components/DynamicForm";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

// Validation schema for form inputs
const schema = yup.object({
  phoneNumber: yup.string().required("Phone number is required"),
  password: yup.string().required("Password is required"),
});

// Form fields configuration
const formFields: FormField[] = [
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

// Feature data for display
const features = [
  {
    icon: Phone,
    title: "AI-Powered Calling",
    description: "Revolutionary voice technology with 99.9% accuracy",
    stats: "10M+ calls",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption with SOC 2 compliance",
    stats: "256-bit SSL",
    color: "from-red-400 to-red-500",
  },
  {
    icon: Zap,
    title: "Lightning Performance",
    description: "Sub-second response times across global networks",
    stats: "<100ms latency",
    color: "from-red-600 to-red-700",
  },
];

// Framer Motion variants for animations
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const featureVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: index * 0.2, duration: 0.4, ease: "easeOut" },
  }),
};

export default function LoginPage() {
  const { signIn, isLoading } = useAuth();
  const router = useRouter();

  // Handle form submission
  const onSubmit = async (data: any) => {
    try {
      await signIn(data.phoneNumber, data.password);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Login Failed", {
        description: error?.message || "Invalid phone number or password",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Features */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20 bg-gray-50"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-lg">
            {/* Brand Header */}
            <div className="flex items-center space-x-4 mb-12">
              <div className="relative">
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-bold text-gray-900">Flaro</span>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-gray-600 text-sm">
                    Trusted by 50,000+ teams
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Content */}
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Scale Your
              <span className="block text-red-600 relative">
                Business Calls
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full" />
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Join businesses revolutionizing communications with AI-powered
              calling technology.
            </p>

            {/* Feature Cards */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="group p-6 rounded-3xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  variants={featureVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-900 font-bold text-lg">
                          {feature.title}
                        </h3>
                        <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs px-3 py-1 rounded-full font-medium">
                          {feature.stats}
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="w-full max-w-md bg-white shadow-2xl rounded-3xl border border-gray-100">
            <CardHeader className="text-center pb-8 pt-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-lg">
                Sign in to your Flaro workspace
              </p>
            </CardHeader>

            <CardContent className="space-y-8 pb-12 px-8">
              <DynamicForm
                fields={formFields}
                onSubmit={onSubmit}
                validationSchema={schema}
                renderButton={(handleSubmit) => (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    onClick={handleSubmit}
                    className={`w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 text-lg group ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="flex items-center"
                      >
                        <Loader2 className="w-5 h-5 mr-2" />
                        Signing In...
                      </motion.div>
                    ) : (
                      <>
                        <span>Sign In to Flaro</span>
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </Button>
                )}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 bg-white text-red-500 focus:ring-red-500 transition-all duration-300"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12 group"
                >
                  <Twitter className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12 group"
                >
                  <Github className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Github
                </Button>
              </div>

              <p className="text-center text-gray-600">
                Don’t have an account?{" "}
                <Link
                  href="/register"
                  className="text-red-600 hover:text-red-700 font-semibold"
                >
                  Create Account
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
