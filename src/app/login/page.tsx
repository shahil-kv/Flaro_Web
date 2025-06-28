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
import Image from "next/image";

const schema = yup.object({
  phoneNumber: yup.string().required("Phone number is required"),
  password: yup.string().required("Password is required"),
});

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
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-600/10 dark:bg-red-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-red-600/10 dark:bg-red-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        <motion.div
          className="lg:w-1/2 flex flex-col justify-center px-6 xl:px-20 bg-gray-50 dark:bg-gray-900"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-xl mx-auto">
            <div className="flex items-center space-x-4 mb-12">
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

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Scale Your
              <span className="block text-red-600 relative">
                Business Calls
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full" />
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
              Join businesses revolutionizing communications with AI-powered calling technology.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="group p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                  variants={featureVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-900 dark:text-white font-bold text-lg">
                          {feature.title}
                        </h3>
                        <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs px-3 py-1 rounded-full font-medium">
                          {feature.stats}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-12 py-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl rounded-3xl border border-gray-100 dark:border-gray-800">
            <CardHeader className="text-center pb-8 pt-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to your Flaro workspace
              </p>
            </CardHeader>

            <CardContent className="space-y-8 pb-12 px-6">
              <DynamicForm
                fields={formFields}
                onSubmit={onSubmit}
                validationSchema={schema}
                renderButton={(handleSubmit) => (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 rounded-xl transition-all duration-300 text-lg"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="flex items-center"
                      >
                        <Loader2 className="w-5 h-5 mr-2" /> Signing In...
                      </motion.div>
                    ) : (
                      <>
                        <span>Sign In to Flaro</span>
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                )}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="accent-red-600" />
                  <span className="text-gray-600 dark:text-gray-300">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="rounded-xl h-12">
                  <Twitter className="w-5 h-5 mr-2" /> Twitter
                </Button>
                <Button variant="outline" className="rounded-xl h-12">
                  <Github className="w-5 h-5 mr-2" /> Github
                </Button>
              </div>

              <p className="text-center text-gray-600 dark:text-gray-400">
                Don’t have an account?{' '}
                <Link href="/register" className="text-red-600 hover:text-red-700 font-semibold">
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
