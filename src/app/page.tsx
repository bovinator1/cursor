import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col dark:bg-neutral-950">
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Levercast</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-md hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Capture ideas. Publish with impact.
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
            Transform your thoughts into professional social media content with
            AI-powered formatting across LinkedIn and Twitter.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 dark:bg-white px-6 py-3 text-base font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:ring-offset-2 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features section */}
      <section className="bg-neutral-50 dark:bg-neutral-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Capture Ideas</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Input your thoughts via text or voice with a simple,
                distraction-free interface.
              </p>
            </div>
            <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Processing</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Our AI transforms your input into platform-optimized posts for
                LinkedIn and Twitter.
              </p>
            </div>
            <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Publish</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Preview, edit, and publish your content directly to your social
                media accounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-neutral-950 py-8 border-t border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p>© 2023 Levercast. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
