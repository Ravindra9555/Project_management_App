"use client";
import { BackgroundBeams } from "@/app/components/ui/background-beams";
import { CardBody, CardContainer, CardItem } from "@/app/components/ui/3d-card";
import { Button } from "@/app/components/ui/button";
import { motion } from "framer-motion";
import { TypewriterEffect } from "@/app/components/ui/typewriter-effect";
// import { WavyBackground } from "@/app/components/ui/wavy-background";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import { LampContainer } from "../components/ui/lamp";
import { TextGenerateEffect } from "../components/ui/text-generate-effect";
import Link from "next/link";
import Navbar from "./Navbar/page";
import Footer from "./footer/page";

export default function LandingPage() {
  const words = [
    { text: "Manage" },
    { text: "projects" },
    { text: "as" },
    { text: "an", className: "text-emerald-500" },
    { text: "Individual" },
    { text: "or", className: "text-emerald-500" },
    { text: "Organization" },
  ];

  const testimonials = [
    {
      quote:
        "This platform transformed how our team collaborates. The organization features are incredible!",
      name: "Sarah Johnson",
      title: "CTO at TechSolutions",
    },
    {
      quote:
        "As a freelancer, the individual plan gives me everything I need to manage multiple clients.",
      name: "Michael Chen",
      title: "Freelance Developer",
    },
    {
      quote:
        "The enterprise features helped us scale our operations across multiple teams seamlessly.",
      name: "David Rodriguez",
      title: "Product Manager at ScaleCorp",
    },
    {
      quote:
        "The advanced analytics feature has been a game-changer for our team's performance tracking.",
      name: "Emily Wang",
      title: "Project Manager at InnovateTech",
    },
    {
      quote:
        "The real-time collaboration feature has been a lifesaver for our remote team.",
      name: "John Smith",
      title: "CEO at RemoteHub",
    },
  ];

  const features = [
    {
      title: "Flexible Plans",
      description:
        "Choose between individual or organization accounts with tiered features",
      icon: "💎",
    },
    {
      title: "Real-time Collaboration",
      description:
        "Work together with your team in real-time on shared projects",
      icon: "👥",
    },
    {
      title: "Advanced Analytics",
      description:
        "Get insights into your project performance and team productivity",
      icon: "📊",
    },
    {
      title: "Secure Cloud Storage",
      description:
        "All your data securely stored with enterprise-grade encryption",
      icon: "🔒",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Navigation */}

      <Navbar />

      {/* Hero Section */}
      {/* <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 h-[100vh]  flex align-middle"> */}
      <section className="h-[100vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-32 pb-20">
        <BackgroundBeams className="absolute top-0 left-0 w-full h-full z-0 " />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <TypewriterEffect words={words} className="text-center" />
            <TextGenerateEffect
              words="Streamline your workflow with our powerful project management platform designed for individuals and teams of all sizes."
              className="max-w-3xl mx-auto mt-6 text-lg text-neutral-400"
            />
            <div className="mt-10 flex justify-center gap-4">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 px-8"
                >
                  Start for Free
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-neutral-700 text-neutral-300 hover:text-white px-8"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900/50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 mb-4">
              Powerful Features
            </h2>
            <p className="max-w-2xl mx-auto text-neutral-400">
              Designed to help you work smarter, not harder. Whether you&apos;re
              a solo creator or a large team, we&apos;ve got you covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-emerald-500 transition-colors"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900/50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="max-w-2xl mx-auto text-neutral-400">
              Choose the plan that fits your needs. Scale up or down as your
              requirements change.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 hover:border-emerald-500 transition-colors"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <p className="text-neutral-400 mb-6">
                Perfect for getting started
              </p>
              <div className="text-4xl font-bold text-white mb-6">
                $0<span className="text-lg text-neutral-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  Up to 3 projects
                </li>
                <li className="flex items-center text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  5GB storage
                </li>
                <li className="flex items-center text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  Basic features
                </li>
              </ul>
              <Link href="/auth/signup">
                <Button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white">
                  Get Started
                </Button>
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-neutral-900 border-2 border-emerald-500 rounded-xl p-8 relative"
            >
              <div className="absolute top-0 right-0 bg-emerald-500 text-neutral-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-neutral-400 mb-6">
                For professionals and small teams
              </p>
              <div className="text-4xl font-bold text-white mb-6">
                $9.99<span className="text-lg text-neutral-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  Unlimited projects
                </li>
                <li className="flex items-center text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  50GB storage
                </li>
                <li className="flex items-center text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  Advanced features
                </li>
                <li className="flex items-center text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  Priority support
                </li>
              </ul>
              <Link href="/auth/signup">
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900">
                  Upgrade Now
                </Button>
              </Link>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 hover:border-emerald-500 transition-colors"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-neutral-400 mb-6">
                For organizations and large teams
              </p>
              <div className="text-4xl font-bold text-white mb-6">
                Custom<span className="text-lg text-neutral-400"></span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  Unlimited everything
                </li>
                <li className="flex items-center text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  Dedicated support
                </li>
                <li className="flex items-center text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  Custom solutions
                </li>
                <li className="flex items-center text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  SSO & advanced security
                </li>
              </ul>
              <Link href="/landingPage/contact">
                <Button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white">
                  Contact Sales
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 mb-4">
              Trusted By Professionals
            </h2>
            <p className="max-w-2xl mx-auto text-neutral-400">
              Join thousands of individuals and teams who have transformed their
              workflow.
            </p>
          </motion.div>

          <div className="rounded-lg flex flex-col antialiased items-center justify-center relative overflow-hidden">
            <InfiniteMovingCards
              items={testimonials}
              direction="right"
              speed="slow"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <LampContainer>
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-8 bg-gradient-to-br from-neutral-300 to-neutral-600 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
          >
            Ready to Transform <br /> Your Workflow?
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex justify-center mt-10"
          >
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 px-8 py-6 text-lg"
              >
                Get Started For Free
              </Button>
            </Link>
          </motion.div>
        </LampContainer>
      </section>
      {/* Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <CardContainer className="inter-var">
            <CardBody className="bg-neutral-900 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-100 mb-4"
              >
                See It In Action
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-300 text-sm max-w-sm mb-8"
              >
                Experience the intuitive interface that makes project management
                effortless.
              </CardItem>
              <CardItem translateZ="100" className="w-full">
                <div className="relative aspect-video bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-emerald-500 text-5xl mb-4">🎯</div>
                      <p className="text-neutral-400">
                        Interactive Demo Coming Soon
                      </p>
                    </div>
                  </div>
                </div>
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
