import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Check } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Levercast</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/sign-in" 
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            >
              Sign In
            </Link>
            <Link 
              href="/sign-up" 
              className="px-4 py-2 text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Transform Ideas into Engaging Content</h1>
            <p className="text-xl md:text-2xl mb-12 text-neutral-700 dark:text-neutral-300 max-w-3xl mx-auto">
              Levercast helps you create, manage, and optimize your social media content with the power of AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/sign-up" 
                className="px-8 py-3 font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200"
              >
                Get Started Free
              </Link>
              <Link 
                href="/sign-in" 
                className="px-8 py-3 font-medium border border-neutral-300 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-neutral-100 dark:bg-neutral-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg">
                <div className="w-12 h-12 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Input Your Ideas</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Start with a rough concept, bullet points, or a draft of what you want to communicate.</p>
              </div>
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg">
                <div className="w-12 h-12 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">AI Transformation</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Our AI transforms your ideas into polished content optimized for different platforms.</p>
              </div>
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg">
                <div className="w-12 h-12 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Publish & Analyze</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Schedule posts, publish directly, and track performance across platforms.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
          &copy; {new Date().getFullYear()} Levercast. All rights reserved.
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
