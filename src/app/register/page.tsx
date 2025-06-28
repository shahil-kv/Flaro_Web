"use client";

import { useState } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import CustomOTPInput from "@/components/CustomOTPInput";
import Image from "next/image";
import { usePost } from "@/lib/useApi";

// Validation schema for form inputs
const schema = yup.object({
  fullName: yup
    .string()
    .max(20, "Full name cannot exceed 20 characters")
    .required("Full name is required"),
  gmail: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(10, "Password cannot exceed 10 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

type FormData = yup.InferType<typeof schema>;

// Form fields configuration
const formFields: FormField[] = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    maxLength: 20,
  },
  {
    name: "gmail",
    label: "Gmail",
    type: "email",
    placeholder: "Enter your gmail",
  },
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
    placeholder: "Create password",
    maxLength: 10,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm password",
    maxLength: 10,
  },
];

// Feature data for display
const features = [
  {
    icon: Phone,
    title: "AI-Powered Calling",
    description: "Revolutionary voice technology with 99.9% accuracy",
    stats: "10M+ calls",
    color: "from-red-600 to-red-700",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption with SOC 2 compliance",
    stats: "256-bit SSL",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Zap,
    title: "Lightning Performance",
    description: "Sub-second response times across global networks",
    stats: "<100ms latency",
    color: "from-red-700 to-red-800",
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

export default function RegisterPage() {
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const router = useRouter();

  const { mutateAsync: signup, isPending: isSignupLoading } = usePost(
    "/user/register",
    {
      invalidateQueriesOnSuccess: ["users", "auth"],
      showErrorToast: true,
      showSuccessToast: true,
      showLoader: true,
    }
  );

  const { mutateAsync: verifyOTP, isPending: isVerifyLoading } = usePost(
    "/user/verify-phone",
    {
      invalidateQueriesOnSuccess: ["users", "auth"],
      showErrorToast: true,
      showSuccessToast: true,
    }
  );

  const handleSignup = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        opsMode: "INSERT",
        role: "USER",
      };

      await signup(payload);
      setPhoneNumber(data.phoneNumber);
      setPassword(data.password);
      setShowOTP(true);
    } catch (error: any) {
      console.error("Signup process error:", error);
      toast.error("Signup Failed", {
        description: error.message || "Please try again",
      });
    }
  };

  const handleOTPSubmit = async () => {
    try {
      const phoneNumberCleaned = phoneNumber.replace(/\s+/g, "");

      await verifyOTP({
        phoneNumber: phoneNumberCleaned,
        otp,
      });
      await signIn(phoneNumberCleaned, password);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error("Verification Failed", {
        description: error.message || "Please try again",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden" data-theme="light">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-600/10 dark:bg-red-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-red-600/10 dark:bg-red-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Features */}
        <motion.div
          className="lg:w-1/2 flex flex-col justify-center px-6 xl:px-12 backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 lg:shadow-xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                </div>
                <Image
                  src="/images/flaro-logo.svg"
                  alt="Flaro Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">Flaro</span>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    Trusted by 50,000+ teams
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Scale Your
              <span className="block text-red-600 dark:text-red-400 relative">
                Business Calls
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full" />
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Join businesses revolutionizing communications with AI-powered calling technology.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="group p-4 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                  variants={featureVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-gray-900 dark:text-white font-bold text-lg">
                          {feature.title}
                        </h3>
                        <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {feature.stats}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Registration Form */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl rounded-3xl border border-gray-100 dark:border-gray-800">
            <CardHeader className="text-center pb-6 pt-6">
              <div className="flex justify-center mb-2 mt-2 lg:hidden">
                <Image
                  src="/images/flaro-logo.svg"
                  alt="Flaro Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {showOTP ? "Verify Your Phone" : "Create Account"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {showOTP
                  ? "Enter the OTP sent to your phone"
                  : "Start your free trial today"}
              </p>
            </CardHeader>

            <CardContent className="space-y-6 pb-6 px-4">
              {!showOTP ? (
                <>
                  <DynamicForm
                    fields={formFields}
                    onSubmit={handleSignup}
                    validationSchema={schema}
                    renderButton={(handleSubmit) => (
                      <Button
                        type="submit"
                        disabled={isSignupLoading}
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 text-lg"
                      >
                        {isSignupLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="flex items-center"
                          >
                            <Loader2 className="w-5 h-5 mr-2" /> Creating Account...
                          </motion.div>
                        ) : (
                          <>
                            <span>Create Account</span>
                            <ArrowRight className="ml-2 w-5 h-5" />
                          </>
                        )}
                      </Button>
                    )}
                  />
                  <div className="flex items-start space-x-2 text-sm">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 rounded accent-red-600 dark:accent-red-400"
                      required
                    />
                    <label
                      htmlFor="terms"
                      className="text-gray-600 dark:text-gray-400 leading-relaxed"
                    >
                      By signing up, you agree to our{" "}
                      <Link
                        href="/terms"
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                      >
                        Privacy Policy
                      </Link>
                      , including consent for automated calls.
                    </label>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <CustomOTPInput
                    value={otp}
                    onChange={setOtp}
                    label="Enter OTP"
                    length={6}
                  />
                  <Button
                    type="button"
                    disabled={isVerifyLoading}
                    onClick={handleOTPSubmit}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 text-lg"
                  >
                    {isVerifyLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="flex items-center"
                      >
                        <Loader2 className="w-5 h-5 mr-2" /> Verifying OTP...
                      </motion.div>
                    ) : (
                      <>
                        <span>Verify OTP</span>
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
              )}

              {!showOTP && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                        Or sign up with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="rounded-xl h-10">
                      <Twitter className="w-5 h-5 mr-2" /> Twitter
                    </Button>
                    <Button variant="outline" className="rounded-xl h-10">
                      <Github className="w-5 h-5 mr-2" /> Github
                    </Button>
                  </div>

                  <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold">
                      Sign In
                    </Link>
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}