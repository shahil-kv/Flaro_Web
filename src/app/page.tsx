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
  Check,
  ChevronRight,
  Clock,
  Facebook,
  Headphones,
  Instagram,
  Languages,
  Linkedin,
  MessageSquare,
  Mic,
  MousePointer,
  Smartphone,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Upload,
  Users,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import LPHeader from "@/components/LPHeader";
import LPHero from "@/components/LPHero";
import LPDashboard from "@/components/LPDashboard";

export default function Home() {
  const features = [
    {
      icon: Upload,
      title: "Smart Contact Management",
      description: "Import thousands of contacts instantly from Excel, CSV, or your phone. Organize with intelligent grouping and advanced filtering for precise targeting.",
      image: "/placeholder.svg",
      stats: "Instant import",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Mic,
      title: "AI Voice Campaign Builder",
      description: "Create engaging voice messages with our AI-powered text-to-speech or record your own voice. Perfect quality, natural delivery, every time.",
      image: "/placeholder.svg",
      stats: "Human-like quality",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: MousePointer,
      title: "One-Click Mass Campaigns",
      description: "Launch sophisticated campaigns to thousands of contacts instantly. Smart scheduling, automated retry logic, and real-time progress tracking.",
      image: "/placeholder.svg",
      stats: "5000+ calls/hour",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Languages,
      title: "AI Voice Agent (Coming Soon!)",
      description: "Revolutionary AI voice agent that handles conversations like a human with native language support. Perfect for customer service, surveys, and interactive campaigns.",
      image: "/placeholder.svg",
      stats: "Multi-language support",
      gradient: "from-orange-500 to-red-600",
      comingSoon: true
    }
  ];

  const useCases = [
    {
      title: "Marketing & Sales Teams",
      description: "Launch high-converting campaigns, nurture leads, and drive sales with personalized voice outreach that cuts through the noise of digital marketing.",
      icon: Target,
      stats: "3x higher conversion",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Event Organizers",
      description: "Boost attendance with personal invitations, send timely reminders, and manage RSVPs efficiently. Perfect for conferences, webinars, and community events.",
      icon: TrendingUp,
      stats: "85% attendance rate",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Community Managers",
      description: "Keep your community engaged with important announcements, gather feedback, and strengthen relationships through authentic voice communication.",
      icon: Users,
      stats: "92% engagement rate",
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechFlow Solutions",
      content: "Flaro revolutionized our lead generation. We're now reaching 15,000+ prospects weekly with personalized voice messages. Our conversion rate increased by 340%.",
      rating: 5,
      avatar: "/placeholder.svg"
    },
    {
      name: "Marcus Rodriguez",
      role: "Event Manager",
      company: "Global Events Network",
      content: "The IVR workflows are game-changing. We automated our entire RSVP process and increased event attendance by 85%. The AI voice quality amazes our attendees.",
      rating: 5,
      avatar: "/placeholder.svg"
    },
    {
      name: "Jennifer Park",
      role: "Community Lead",
      company: "Innovation Hub",
      content: "Managing 25,000+ community members became effortless with Flaro. The real-time analytics help us understand engagement patterns and optimize our outreach strategy.",
      rating: 5,
      avatar: "/placeholder.svg"
    }
  ];


  const pricingPlans = [
    {
      name: "Growth",
      price: "$149",
      period: "/month",
      description: "Perfect for growing teams",
      features: [
        "Up to 10,000 calls/month",
        "AI voice generation",
        "Basic IVR workflows",
        "Real-time analytics",
        "Email & chat support",
        "Contact management tools"
      ],
      popular: false,
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      name: "Professional",
      price: "$399",
      period: "/month",
      description: "Best for scaling businesses",
      features: [
        "Unlimited voice calls",
        "Advanced AI voice cloning",
        "Complex IVR automation",
        "Advanced analytics & insights",
        "24/7 priority support",
        "API access & integrations",
        "Custom voice training"
      ],
      popular: true,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "Tailored enterprise solutions",
      features: [
        "White-label deployment",
        "Dedicated infrastructure",
        "SLA guarantees",
        "Custom AI development",
        "Advanced security compliance",
        "Dedicated success manager",
        "Custom integrations"
      ],
      popular: false,
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  const howItWorksSteps = [
    {
      step: "1",
      title: "Import & Organize",
      description: "Upload your contact lists from any source. Our AI automatically cleans and organizes data, removing duplicates and invalid numbers.",
      icon: Upload
    },
    {
      step: "2",
      title: "Create & Customize",
      description: "Build your voice campaign with AI-generated speech or record your own message. Set up smart IVR flows for interactive responses.",
      icon: Mic
    },
    {
      step: "3",
      title: "Launch & Track",
      description: "Deploy your campaign with one click and monitor real-time performance. Get detailed analytics on delivery, engagement, and conversions.",
      icon: BarChart3
    }
  ];

  return (
    <div className="min-h-full scroll-smooth bg-background dark:bg-gray-950 overflow-x-hidden">
      <LPHeader />
      <LPHero />
      {/* <ModernDashboard /> */}
      <LPDashboard />

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24 px-6 ">

        <div className="absolute inset-0 overflow-hidden">

          {/* Medium Gradient Orbs */}
          <div
            className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-orange-500/15 via-red-500/12 to-red-600/8 rounded-full blur-3xl"
          // animate={{
          //   x: [0, 80, 0],
          //   y: [0, -60, 0],
          //   scale: [1, 1.2, 1],
          // }}
          // transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          />

          <div
            className="absolute bottom-1/4 right-1/5 w-[550px] h-[550px] bg-gradient-to-bl from-red-400/20 via-orange-600/15 to-red-500/12 rounded-full blur-3xl"
          // animate={{
          //   x: [0, -100, 0],
          //   y: [0, 80, 0],
          //   scale: [1, 1.1, 1],
          // }}
          // transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 8 }}
          />


        </div>

        <div className="container px-2 md:px-8 mx-auto">
          <div
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              How Flaro <span className="bg-gradient-to-r from-orange-600 to-red-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Transform your outreach in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 ">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className="text-center glass-effect-dark p-4 rounded-md"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 glass-effect  text-primary rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="container px-2 md:px-8 mx-auto">


          <div className="absolute inset-0 overflow-hidden">
            {/* Large Pink/Purple Gradient Orbs */}
            <div
              className="absolute -top-40 -left-40 w-[900px] h-[900px] bg-gradient-to-br from-pink-500/22 via-purple-500/18 to-pink-600/14 rounded-full blur-3xl"
            // animate={{
            //   x: [0, 160, 0],
            //   y: [0, -120, 0],
            //   scale: [1, 1.6, 1],
            //   rotate: [0, 180, 360],
            // }}
            // transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
            />

            <div
              className="absolute -bottom-52 -right-52 w-[1100px] h-[1100px] bg-gradient-to-tl from-purple-600/25 via-pink-500/20 to-purple-400/16 rounded-full blur-3xl"
            // animate={{
            //   x: [0, -200, 0],
            //   y: [0, 140, 0],
            //   scale: [1, 1.4, 1],
            //   rotate: [0, -270, 0],
            // }}
            // transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />

            {/* Medium Gradient Orbs */}
            <div
              className="absolute top-1/3 right-1/5 w-[600px] h-[600px] bg-gradient-to-l from-pink-400/20 via-purple-500/16 to-pink-600/12 rounded-full blur-3xl"
            // animate={{
            //   x: [0, -100, 0],
            //   y: [0, 80, 0],
            //   scale: [1, 1.3, 1],
            // }}
            // transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            />

            <div
              className="absolute bottom-1/4 left-1/4 w-[550px] h-[550px] bg-gradient-to-r from-purple-500/24 via-pink-400/19 to-purple-600/15 rounded-full blur-3xl"
            // animate={{
            //   x: [0, 130, 0],
            //   y: [0, -70, 0],
            //   scale: [1, 1.25, 1],
            // }}
            // transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            {/* Small Accent Orbs */}
            <div
              className="absolute top-1/5 left-1/3 w-[350px] h-[350px] bg-gradient-to-br from-pink-300/28 to-purple-400/22 rounded-full blur-2xl"
            // animate={{
            //   x: [0, 70, 0],
            //   y: [0, -55, 0],
            //   scale: [1, 1.35, 1],
            // }}
            // transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />

            <div
              className="absolute bottom-1/6 right-1/6 w-[320px] h-[320px] bg-gradient-to-tl from-purple-300/26 to-pink-400/20 rounded-full blur-2xl"
            // animate={{
            //   x: [0, -85, 0],
            //   y: [0, 60, 0],
            //   scale: [1, 1.3, 1],
            // }}
            // transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 8 }}
            />
          </div>

          <div
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Powerful <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">AI Features</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need for successful AI-powered voice campaigns, including our upcoming AI voice agent
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group"
              >
                <Card className={`h-full transition-all duration-500 border-0 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 cursor-pointer relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ${feature.comingSoon ? 'ring-2 ring-orange-500/50 shadow-orange-500/20' : ''
                  }`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  {feature.comingSoon && (
                    <div className="absolute top-4 right-4 z-20">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 text-xs px-3 py-1">
                        <Clock className="w-3 h-3 mr-1" />
                        Coming Soon
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-8 text-center relative z-10">
                    <div className={`rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 transition-all duration-500 transform group-hover:scale-110 bg-gradient-to-r ${feature.gradient}`}>
                      <feature.icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
                    <Badge variant="secondary" className={`bg-gradient-to-r ${feature.gradient} text-white border-0 text-sm px-4 py-2`}>
                      {feature.stats}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Use Cases Section */}
      <section id="use-cases" className="py-20 px-4 bg-gradient-to-br from-gray-50/30 to-blue-50/30 dark:from-gray-900/30 dark:to-blue-950/30">
        <div className="container px-2 md:px-8 mx-auto">
          <div
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Built for <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Every Team</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              See how different teams use Flaro&apos;s AI voice platform to achieve breakthrough results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
              >
                <Card className="h-full text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className={`rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 bg-gradient-to-r ${useCase.gradient}`}>
                      <useCase.icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">{useCase.title}</h3>
                    <p className="text-muted-foreground mb-6">{useCase.description}</p>
                    <Badge className={`bg-gradient-to-r ${useCase.gradient} text-white border-0 text-lg px-4 py-2`}>
                      {useCase.stats}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section with Blur Effect and Coming Soon */}
      <section id="testimonials" className="py-20 px-4 relative">
        <div className="container px-2 md:px-8 mx-auto">
          <div
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Customer <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Stories</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Real results from teams transforming their outreach
            </p>
          </div>

          {/* Blurred Testimonials Cards with Coming Soon Overlay */}
          <div className="relative ">
            <div className="flex overflow-x-auto gap-8 md:grid md:grid-cols-3 md:overflow-x-visible filter opacity-60">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                >
                  <Card className="h-full min-w-[20rem] border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
                    <CardContent className="p-6 blur-sm">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current text-yellow-500" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-6 italic">&quot;{testimonial.content}&quot;</p>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
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
                </div>
              ))}
            </div>

            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl md:p-12 p-8 text-center shadow-2xl border border-red-500/30"
              >
                <div className="flex items-center justify-center mb-6">
                  <MessageSquare className="w-16 h-16 text-red-500 mr-4" />
                  <div>
                    <h3 className="md:text-3xl text-xl font-bold text-gray-900 dark:text-white mb-2">Stories Coming Soon!</h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      We&apos;re collecting amazing success stories
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                  Join our growing community of teams already achieving incredible results with Flaro&apos;s AI voice platform.
                </p>
                <Button className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white md:px-8 px-4 py-4 text-lg">
                  <Users className="mr-3 h-5 w-5" />
                  Be Our First Story
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section with Blur Effect and Coming Soon */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-gray-50/30 to-purple-50/30 dark:from-gray-900/30 dark:to-purple-950/30 relative">
        <div className="container px-2 md:px-8 mx-auto">
          <div
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Pricing <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Coming Soon</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              We&apos;re finalizing our pricing plans to offer you the best value
            </p>
          </div>

          {/* Blurred Pricing Cards with Coming Soon Overlay */}
          <div className="relative">
            <div className="flex overflow-x-auto gap-8 md:grid blur-md md:grid-cols-3 md:overflow-x-visible filter opacity-60">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                >
                  <Card className={`h-full min-w-[20rem]  relative border-0 shadow-xl transition-all duration-300
                    ${plan.popular ? 'ring-2 ring-blue-500 shadow-blue-500/20 scale-105' : ''}`}>
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                        Most Popular
                      </Badge>
                    )}
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mx-auto mb-4`}>
                        <span className="text-2xl text-white font-bold">{plan.name[0]}</span>
                      </div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="text-4xl font-bold">
                        {plan.price}<span className="text-lg text-muted-foreground">{plan.period}</span>
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
                        className={`w-full transition-all duration-300 ${plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                          : 'border-2 hover:bg-accent/10'
                          }`}
                        variant={plan.popular ? "default" : "outline"}
                        disabled
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl md:p-12 p-8 text-center shadow-2xl border border-orange-500/30"
              >
                <div className="flex items-center justify-center mb-6">
                  <Clock className="w-16 h-16 text-orange-500 mr-4" />
                  <div>
                    <h3 className="md:text-3xl text-xl font-bold text-gray-900 dark:text-white mb-2">Pricing Coming Soon!</h3>
                    <p className="md:text-lg text-base text-gray-600 dark:text-gray-400">
                      We&apos;re working on competitive pricing plans
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                  Get notified when our pricing plans go live. Start building your voice campaigns for free during our beta period.
                </p>
                <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white md:px-8 px-4 py-4 text-lg">
                  <Sparkles className="mr-3 h-5 w-5" />
                  Join Beta (Free)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-gradient-to-r from-[#cc0000] via-[#ff0000] to-[#990000] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container px-2 md:px-8 mx-auto text-center relative z-10">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">Ready to Transform Your Outreach?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Join thousands of teams using Flaro&apos;s AI voice platform to reach more people,
              drive better engagement, and achieve remarkable results. Plus, get early access to our AI voice agent!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="text-base md:text-xl px-12 py-8 bg-white text-gray-900 hover:bg-gray-200 dark:bg-white/80 shadow-2xl rounded-2xl">
                <Sparkles className="mr-3 h-6 w-6" />
                Start Free Beta
              </Button>
              <Button size="lg" variant="outline" className="text-base md:text-xl px-12 py-8 border-white bg-orange-600 hover:bg-white/10 shadow-xl rounded-2xl">
                <Languages className="mr-3 h-6 w-6" />
                Preview AI Agent (Soon)
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-16 md:px-6 bg-gray-900 text-white">
        <div className="container px-2 md:px-8 mx-auto">
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
                  flaro
                </span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Enterprise-grade communication platform for modern businesses.
              </p>
              <div className="flex space-x-4">
                {/* Facebook */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>

                {/* X (Twitter) */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-white" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/flaro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-700 rounded-2xl flex items-center justify-center hover:bg-blue-800 transition-colors cursor-pointer"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/flaro.co?igsh=ejFkMTRpMW1jdXY3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-2xl flex items-center justify-center hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-all cursor-pointer"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
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
                <Button className="w-full justify-start bg-gray-800 dark:bg-orange-700 hover:bg-gray-700 border border-gray-700 rounded-xl">
                  <Smartphone className="mr-3 h-5 w-5" />
                  Enterprise App
                </Button>
                <Button className="w-full justify-start bg-gray-800 dark:bg-orange-700 hover:bg-gray-700 border border-gray-700 rounded-xl">
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
