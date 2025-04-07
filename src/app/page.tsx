"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Check } from "lucide-react";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold">Levercast</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isLoaded && (
                <div>
                  {isSignedIn ? (
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center rounded-md bg-neutral-900 dark:bg-white px-3 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <Link
                        href="/sign-in"
                        className="text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/sign-up"
                        className="inline-flex items-center rounded-md bg-neutral-900 dark:bg-white px-3 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200"
                      >
                        Get started
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Transform your ideas into powerful social media content
            </h1>
            <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
              Levercast helps you create engaging, platform-optimized content for your social media presence,
              powered by AI that understands your voice and brand.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href={isSignedIn ? "/dashboard" : "/sign-up"}
                className="inline-flex items-center rounded-md bg-neutral-900 dark:bg-white px-4 py-2.5 text-base font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200"
              >
                Get started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Features designed for creators and entrepreneurs
            </h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
              Everything you need to amplify your social media presence without the constant struggle of content creation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="AI-Powered Content" 
              description="Transform your ideas into platform-optimized content that resonates with your audience."
            />
            <FeatureCard 
              title="Multi-Platform Support" 
              description="Create content tailored for LinkedIn, Twitter, and more from a single source."
            />
            <FeatureCard 
              title="Content Metrics" 
              description="Track engagement and performance to understand what resonates with your audience."
            />
            <FeatureCard 
              title="Voice Consistency" 
              description="Maintain your unique brand voice across all platforms and posts."
            />
            <FeatureCard 
              title="Quick Drafts" 
              description="Save ideas and come back to them later when you're ready to publish."
            />
            <FeatureCard 
              title="One-Click Publishing" 
              description="Publish directly to your connected platforms with a single click."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
              No hidden fees, no complicated tiers. Just the tools you need to succeed.
            </p>
          </div>
          
          {/* Pricing card */}
          <div className="max-w-lg mx-auto rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="px-6 py-8 bg-white dark:bg-neutral-950 sm:p-10 sm:pb-6">
              <div className="flex justify-between items-baseline">
                <h3 className="text-2xl font-bold">Pro Plan</h3>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Monthly</span>
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-extrabold">$29</span>
                <span className="ml-1 text-xl font-semibold">/month</span>
              </div>
              <p className="mt-5 text-neutral-600 dark:text-neutral-400">
                All the tools you need to create professional content for your audience.
              </p>
            </div>
            <div className="px-6 pt-6 pb-8 bg-neutral-50 dark:bg-neutral-900 sm:p-10 sm:pt-6">
              <ul className="space-y-4">
                <PricingFeature>Unlimited content generation</PricingFeature>
                <PricingFeature>LinkedIn and Twitter optimization</PricingFeature>
                <PricingFeature>Performance analytics</PricingFeature>
                <PricingFeature>Content scheduling</PricingFeature>
                <PricingFeature>Priority support</PricingFeature>
              </ul>
              <div className="mt-8">
                <Link
                  href={isSignedIn ? "/dashboard" : "/sign-up"}
                  className="block w-full text-center rounded-md border border-transparent bg-neutral-900 dark:bg-white px-5 py-3 text-base font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200"
                >
                  {isSignedIn ? "Go to dashboard" : "Start free trial"}
                </Link>
              </div>
              <div className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
                No credit card required to start your 14-day trial
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8">
            <div className="text-center">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                &copy; {new Date().getFullYear()} Levercast. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

type FeatureCardProps = {
  title: string;
  description: string;
};

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
    </div>
  );
}

function PricingFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start">
      <div className="flex-shrink-0">
        <Check className="h-5 w-5 text-green-500" />
      </div>
      <p className="ml-3 text-sm text-neutral-600 dark:text-neutral-400">{children}</p>
    </li>
  );
}
