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
    console.log(data);

    try {
      const payload = {
        ...data,
        opsMode: "INSERT",
        role: "USER",
      };

      // Simulate API call (replace with actual API call)
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
      // Sign in after OTP verification
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
              <Image
                src="/lovable-uploads/e484c832-94f1-4bf4-9bc7-bd61a3a9a93a.png"
                alt="Flaro Logo"
                width={48}
                height={48}
                className="object-contain"
              />
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

        {/* Right Side - Registration Form */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="w-full max-w-md bg-white shadow-2xl rounded-3xl border border-gray-100">
            <CardHeader className="text-center pb-8 pt-12">
              <div className="flex justify-center mb-4 lg:hidden">
                <Image
                  src="/lovable-uploads/e484c832-94f1-4bf4-9bc7-bd61a3a9a93a.png"
                  alt="Flaro Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                {showOTP ? "Verify Your Phone" : "Create Account"}
              </h2>
              <p className="text-gray-600 text-lg">
                {showOTP
                  ? "Enter the OTP sent to your phone"
                  : "Start your free trial today"}
              </p>
            </CardHeader>

            <CardContent className="space-y-8 pb-12 px-8">
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
                        className={`w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 text-lg group ${
                          isSignupLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSignupLoading ? (
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
                            Creating Account...
                          </motion.div>
                        ) : (
                          <>
                            <span>Create Account</span>
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </Button>
                    )}
                  />
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 rounded border-gray-300 bg-white text-red-500 focus:ring-red-500 focus:ring-offset-0"
                      required
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-gray-600 leading-relaxed"
                    >
                      By signing up, you agree to our{" "}
                      <Link
                        href="/terms"
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-red-600 hover:text-red-700 transition-colors"
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
                    className={`w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 text-lg group ${
                      isVerifyLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isVerifyLoading ? (
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
                        Verifying OTP...
                      </motion.div>
                    ) : (
                      <>
                        <span>Verify OTP</span>
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </Button>
                </div>
              )}

              {!showOTP && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">
                        Or sign up with
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
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-red-600 hover:text-red-700 font-semibold"
                    >
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
