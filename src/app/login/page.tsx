"use client";

import { useState } from "react";
import * as yup from "yup";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Phone,
  ArrowRight,
  Shield,
  Zap,
  Star,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Validation Schema
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const features = [
    {
      icon: Phone,
      title: "AI-Powered Calling",
      description:
        "Revolutionary voice technology that adapts to every conversation with 99.9% accuracy",
      stats: "10M+ calls",
      color: "from-red-500 to-red-600",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-level encryption with SOC 2 compliance for ultimate data protection",
      stats: "256-bit SSL",
      color: "from-red-400 to-red-500",
    },
    {
      icon: Zap,
      title: "Lightning Performance",
      description:
        "Connect instantly with sub-second response times across global networks",
      stats: "<100ms latency",
      color: "from-red-600 to-red-700",
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Validate form data
      await schema.validate({ email, password }, { abortEarly: false });

      // Simulate sign-in (replace with actual auth logic)
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
          description: error?.message || "Invalid email or password",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20 bg-gray-50">
          <div className="max-w-lg">
            {/* Brand Header */}
            <div className="flex items-center space-x-4 mb-12 animate-fade-in">
              <div className="relative">
                <Image
                  src="/lovable-uploads/e484c832-94f1-4bf4-9bc7-bd61a3a9a93a.png"
                  alt="Flaro Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
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
            <h1
              className="text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Scale Your
              <span className="block text-red-600 relative">
                Business Calls
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full transform scale-x-0 animate-[scale-x_1s_ease-out_1s_forwards] origin-left"></div>
              </span>
            </h1>

            <p
              className="text-xl text-gray-600 mb-12 animate-fade-in leading-relaxed"
              style={{ animationDelay: "0.4s" }}
            >
              Join the next generation of businesses revolutionizing their
              communications with AI-powered calling technology.
            </p>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-6 rounded-3xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-500 cursor-pointer animate-fade-in hover:transform hover:scale-105"
                  style={{ animationDelay: `${0.6 + index * 0.2}s` }}
                >
                  <div className="relative z-10 flex items-start space-x-4">
                    <div
                      className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-12">
          <Card className="w-full max-w-md bg-white shadow-2xl animate-scale-in rounded-3xl overflow-hidden border border-gray-100">
            <CardHeader className="text-center pb-8 pt-12 relative z-10">
              <div className="flex justify-center mb-6 lg:hidden">
                <Image
                  src="/lovable-uploads/e484c832-94f1-4bf4-9bc7-bd61a3a9a93a.png"
                  alt="Flaro Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>

              <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-4">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-700 text-sm font-medium">
                  Secure Login
                </span>
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-lg">
                Sign in to your Flaro workspace
              </p>
            </CardHeader>

            <CardContent className="space-y-8 pb-12 px-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-gray-700 font-medium text-sm"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-red-400 transition-all duration-300 rounded-xl h-12"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium text-sm"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-red-400 transition-all duration-300 rounded-xl h-12 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 bg-white text-red-500 focus:ring-red-500 focus:ring-offset-0 transition-all duration-300"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-red-600 hover:text-red-700 transition-colors font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-red-500/30 text-lg group ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      {/* <Loader2 className="animate-spin mr-2 w-5 h-5" /> */}
                      Signing In...
                    </>
                  ) : (
                    <>
                      <span>Sign In to Flaro</span>
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
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
                  className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-300 rounded-xl h-12 group"
                >
                  <svg
                    className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-300 rounded-xl h-12 group"
                >
                  <svg
                    className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                  Facebook
                </Button>
              </div>

              <p className="text-center text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                >
                  Create Account
                </Link>
              </p>
              <p className="text-center text-gray-600">
                Go to Dashboard
                <Link
                  href="/dashboard"
                  className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                >
                  Dashboard
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
