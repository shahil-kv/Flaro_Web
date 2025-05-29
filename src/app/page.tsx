"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronRight,
  Headphones,
  Phone,
  Smartphone,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import ModernHeader from "@/components/ModernHeader";
import ModernDashboard from "@/components/ModernDashboard";
import ModernHero from "@/components/ModernHero";

export default function Home() {
  const features = [
    {
      icon: Phone,
      title: "Enterprise Calling",
      description:
        "Scale your communication with advanced calling features designed for modern businesses.",
      image: "/placeholder.svg",
      stats: "300% faster outreach",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      icon: Users,
      title: "Smart Management",
      description:
        "Organize contacts, manage campaigns, and track engagement across all segments seamlessly.",
      image: "/placeholder.svg",
      stats: "99% organized data",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Get detailed insights with real-time performance metrics and conversion tracking.",
      image: "/placeholder.svg",
      stats: "Real-time insights",
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      icon: Bot,
      title: "AI Integration",
      description:
        "AI-powered assistant handles calls, analyzes conversations, and provides intelligent insights.",
      image: "/placeholder.svg",
      stats: "Coming Soon",
      gradient: "from-gray-500 to-gray-600",
    },
  ];

  const useCases = [
    {
      title: "Marketing Teams",
      description:
        "Launch comprehensive marketing campaigns and track performance across thousands of leads.",
      icon: Target,
      stats: "10x more reach",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "Enterprise Sales",
      description:
        "Connect with prospects at scale while maintaining personalized communication strategies.",
      icon: TrendingUp,
      stats: "3x more conversions",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Customer Success",
      description:
        "Manage customer relationships and provide exceptional support at enterprise scale.",
      icon: Users,
      stats: "95% satisfaction rate",
      gradient: "from-indigo-500 to-indigo-600",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "VP of Marketing",
      company: "TechCorp Enterprise",
      content:
        "Flaro transformed our enterprise outreach strategy. We now reach 10,000+ leads daily with incredible efficiency and precision.",
      rating: 5,
      avatar: "/placeholder.svg",
    },
    {
      name: "Michael Chen",
      role: "Head of Sales",
      company: "Global Solutions Inc",
      content:
        "The professional dashboard and analytics give us insights we never had before. Our ROI increased by 400% in just three months.",
      rating: 5,
      avatar: "/placeholder.svg",
    },
    {
      name: "Lisa Rodriguez",
      role: "Customer Success Director",
      company: "Enterprise Pro",
      content:
        "The AI integration and professional tools saved us hundreds of hours. Customer satisfaction improved dramatically.",
      rating: 5,
      avatar: "/placeholder.svg",
    },
  ];

  const pricingPlans = [
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "Perfect for growing businesses",
      features: [
        "Up to 5,000 calls/month",
        "Advanced analytics dashboard",
        "Priority support",
        "Contact segmentation",
        "Custom campaigns",
      ],
      popular: false,
      gradient: "from-gray-500 to-gray-600",
    },
    {
      name: "Enterprise",
      price: "$299",
      period: "/month",
      description: "Best for large organizations",
      features: [
        "Unlimited calls",
        "Full analytics suite",
        "24/7 dedicated support",
        "API access",
        "Custom integrations",
        "White-label options",
      ],
      popular: true,
      gradient: "from-orange-500 to-orange-600",
    },
    {
      name: "Custom",
      price: "Contact",
      period: "us",
      description: "Tailored enterprise solutions",
      features: [
        "Custom deployment",
        "Dedicated infrastructure",
        "SLA guarantees",
        "Custom features",
        "Training & onboarding",
        "Compliance & security",
      ],
      popular: false,
      gradient: "from-blue-500 to-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 overflow-x-hidden">
      <ModernHeader />
      <ModernHero />
      <ModernDashboard />

      {/* Enhanced Features Section */}
      <section
        id="features"
        className="md:py-24 md:px-6 bg-gradient-to-br from-gray-50/30 to-orange-50/30 dark:from-gray-900/30 dark:to-blue-950/30"
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Enterprise{" "}
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Professional-grade tools designed for modern enterprises
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full transition-all duration-500 border-0 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 cursor-pointer relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>
                  <CardContent className="md:p-8 px-2 py-4 text-center relative z-10">
                    <div
                      className={`rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 transition-all duration-500 transform group-hover:scale-110 bg-gradient-to-r ${feature.gradient}`}
                    >
                      <feature.icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`bg-gradient-to-r ${feature.gradient} text-white border-0 text-sm px-4 py-2`}
                    >
                      {feature.stats}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Use Cases Section */}
      <section id="use-cases" className="md:py-20 py-10 md:px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Perfect for{" "}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600/70 bg-clip-text text-transparent">
                Every Team
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              See how different teams use Flaro to achieve their goals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
                  <CardContent className="md:p-8 px-1 py-4">
                    <div
                      className={`rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 bg-gradient-to-r ${useCase.gradient}`}
                    >
                      <useCase.icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">
                      {useCase.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {useCase.description}
                    </p>
                    <Badge
                      className={`bg-gradient-to-r ${useCase.gradient} text-white border-0 text-lg px-4 py-2`}
                    >
                      {useCase.stats}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section
        id="testimonials"
        className="md:py-20 py-10 md:px-4 bg-gradient-to-br from-gray-50/30 to-gray-100/30 dark:from-gray-900/30 dark:to-gray-800/30"
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              What Our{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Customers Say
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of teams already using Flaro
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-current text-yellow-500"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">
                      &quot;{testimonial.content}&quot;
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section id="pricing" className="md:py-20 py-10 md:px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Simple,{" "}
              <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                Transparent Pricing
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your team&apos;s needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`h-full relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:ring-2
                  ${
                    plan.popular
                      ? " ring-blue-500 shadow-blue-500/20 scale-105"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mx-auto mb-4`}
                    >
                      <span className="text-2xl text-white font-bold">
                        {plan.name[0]}
                      </span>
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold">
                      {plan.price}
                      <span className="text-lg text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full  transition-all duration-300 hover:bg-gradient-to-t from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700  shadow-lg ${
                        plan.popular
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                          : "border-2 hover:bg-accent/10"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 md:px-6 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Join thousands of enterprises already using Flaro to revolutionize
              their operations. Start your enterprise trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="text-xl px-12 py-8 border-white text-primary hover:bg-white/10 shadow-xl rounded-2xl"
              >
                <Sparkles className="mr-3 h-6 w-6" />
                Start Enterprise Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-xl px-12 py-8 border-white text-primary hover:bg-white/10 shadow-xl rounded-2xl"
              >
                <Headphones className="mr-3 h-6 w-6" />
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-16 md:px-6 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Image
                  src="/images/flaro-logo.svg"
                  alt="Flaro"
                  className="h-10 w-10"
                  width={40}
                  height={40}
                />
                <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
                  Flaro
                </span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Enterprise-grade communication platform for modern businesses.
              </p>
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center hover:bg-orange-700 transition-colors cursor-pointer">
                  <span className="text-lg font-bold">f</span>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <span className="text-lg font-bold">t</span>
                </div>
                <div className="w-12 h-12 bg-blue-700 rounded-2xl flex items-center justify-center hover:bg-blue-800 transition-colors cursor-pointer">
                  <span className="text-lg font-bold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-xl">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-xl">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-xl">Enterprise</h4>
              <div className="space-y-4">
                <Button className="w-full justify-start bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl">
                  <Smartphone className="mr-3 h-5 w-5" />
                  Enterprise App
                </Button>
                <Button className="w-full justify-start bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl">
                  <Headphones className="mr-3 h-5 w-5" />
                  24/7 Support
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Flaro Enterprise. All rights
              reserved. Built for professional excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
