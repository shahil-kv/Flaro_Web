import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Phone,
  Users,
  BarChart3,
  Sparkles,
  Shield,
  Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const features = [
    {
      icon: Phone,
      title: "Smart AI Calling",
      description:
        "AI-powered calling system with advanced routing and conversation intelligence",
      gradient: "from-red-500 to-red-600",
      delay: "0s",
    },
    {
      icon: Users,
      title: "Mass Group Management",
      description:
        "Organize and manage thousands of contacts with intelligent automation",
      gradient: "from-red-400 to-red-500",
      delay: "0.1s",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description:
        "Comprehensive insights and performance tracking for your campaigns",
      gradient: "from-red-600 to-red-700",
      delay: "0.2s",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-level encryption and compliance for all your business communications",
      gradient: "from-red-500 to-red-700",
      delay: "0.3s",
    },
  ];

  const stats = [
    { number: "10M+", label: "Calls Completed", icon: Phone },
    { number: "50K+", label: "Active Users", icon: Users },
    { number: "99.9%", label: "Uptime SLA", icon: Shield },
    { number: "24/7", label: "Premium Support", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/lovable-uploads/e484c832-94f1-4bf4-9bc7-bd61a3a9a93a.png"
              alt="Flaro Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-2xl font-bold text-gray-900">Flaro</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-red-600 transition-colors"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/25">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-100 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-700">
              Trusted by 50,000+ businesses worldwide
            </span>
          </div>

          <h1 className="text-7xl font-bold mb-8 text-gray-900 animate-fade-in leading-tight">
            The Future of
            <br />
            <span className="relative text-red-600">
              B2B Communication
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full transform scale-x-0 animate-[scale-x_1s_ease-out_1s_forwards] origin-left"></div>
            </span>
          </h1>

          <p
            className="text-xl text-gray-600 mb-12 animate-fade-in max-w-3xl mx-auto leading-relaxed"
            style={{ animationDelay: "0.2s" }}
          >
            Transform your business communications with Flaro&apos;s intelligent
            mass calling platform. Reach more customers, boost conversions, and
            scale your operations effortlessly with AI-powered technology.
          </p>

          <div
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-10 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-red-500/25 text-lg font-semibold"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 px-10 py-4 rounded-xl transition-all duration-300 hover:scale-105 text-lg font-semibold bg-white"
            >
              <Phone className="mr-2 w-5 h-5" />
              Book Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for Modern Teams
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to streamline your calling operations and boost
            your team&apos;s productivity with cutting-edge technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:scale-105 transition-all duration-500 cursor-pointer border border-gray-100 shadow-lg hover:shadow-xl bg-white animate-fade-in relative overflow-hidden"
              style={{ animationDelay: feature.delay }}
            >
              <CardContent className="p-8 text-center relative z-10">
                <div
                  className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 bg-gradient-to-r from-red-500 to-red-600 py-20 my-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-white animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-red-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of businesses already using Flaro to scale their
            communications and drive unprecedented growth
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-12 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-red-500/25 text-lg font-semibold"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 px-12 py-4 rounded-xl transition-all duration-300 hover:scale-105 text-lg font-semibold bg-white"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
