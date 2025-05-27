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
  ArrowRight,
  Check,
  Users,
  BarChart3,
  Shield,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Validation Schema
const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  company: yup.string().required("Company name is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const benefits = [
    {
      icon: Users,
      title: "Mass Calling Power",
      description: "Reach thousands of prospects with intelligent automation",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track performance with detailed insights and reporting",
    },
    {
      icon: Shield,
      title: "Enterprise Grade",
      description: "Built for scale with security and compliance in mind",
    },
  ];

  const features = [
    "AI-powered conversation intelligence",
    "Advanced call routing and distribution",
    "Real-time performance dashboards",
    "CRM integrations and automations",
    "24/7 premium support included",
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Validate form data
      await schema.validate(formData, { abortEarly: false });

      // Simulate registration (replace with actual auth logic)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Registration Successful", {
        description: "Welcome to Flaro! Redirecting to your dashboard...",
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
        toast.error("Registration Failed", {
          description:
            error?.message || "An error occurred during registration",
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
        <div className="absolute top-10 left-10 w-80 h-80 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-red-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Benefits */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20 bg-gray-50">
          <div className="max-w-lg">
            <div className="flex items-center space-x-3 mb-8 animate-fade-in">
              <Image
                src="/lovable-uploads/e484c832-94f1-4bf4-9bc7-bd61a3a9a93a.png"
                alt="Flaro Logo"
                width={48}
                height={48}
                className="object-contain"
              />
              <span className="text-2xl font-bold text-gray-900">Flaro</span>
            </div>

            <h1
              className="text-5xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Scale Your
              <span className="block text-red-600">Business Today</span>
            </h1>

            <p
              className="text-xl text-gray-600 mb-8 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              Join the next generation of businesses revolutionizing their
              communications with AI.
            </p>

            {/* Key Benefits */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 animate-fade-in hover:transform hover:scale-105"
                  style={{ animationDelay: `${0.6 + index * 0.15}s` }}
                >
                  <div className="w-10 h-10 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature List */}
            <div
              className="space-y-3 animate-fade-in"
              style={{ animationDelay: "1.2s" }}
            >
              <h3 className="text-gray-900 font-semibold mb-4">
                Whats included:
              </h3>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-600 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-12 py-12">
          <Card className="w-full max-w-md bg-white shadow-2xl animate-scale-in border border-gray-100 rounded-3xl">
            <CardHeader className="text-center pb-6 pt-8">
              <div className="flex justify-center mb-4 lg:hidden">
                <Image
                  src="/lovable-uploads/e484c832-94f1-4bf4-9bc7-bd61a3a9a93a.png"
                  alt="Flaro Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">Start your free trial today</p>
            </CardHeader>

            <CardContent className="space-y-5 pb-8">
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-gray-700 font-medium"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-red-400 transition-all duration-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-gray-700 font-medium"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-red-400 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Work Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-red-400 transition-all duration-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="company"
                    className="text-gray-700 font-medium"
                  >
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Your Company Inc."
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-red-400 transition-all duration-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-red-400 transition-all duration-300 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-gray-700 font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-red-400 transition-all duration-300 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

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
                    I agree to the{" "}
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
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/25 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 w-5 h-5" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or sign up with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="bg-white border-gray-200 text mascot-gray-700 hover:bg-gray-50 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                  className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                  Facebook
                </Button>
              </div>

              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
