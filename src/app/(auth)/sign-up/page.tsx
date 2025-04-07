"use client";

import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="mb-6">
        <Image 
          src="/logo.svg" 
          width={150} 
          height={40} 
          alt="Levercast Logo" 
          className="dark:invert" 
        />
      </div>
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white dark:bg-neutral-950 shadow-md dark:shadow-none border border-neutral-200 dark:border-neutral-800",
            headerTitle: "text-neutral-900 dark:text-neutral-100",
            headerSubtitle: "text-neutral-600 dark:text-neutral-400",
            socialButtonsBlockButton: "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800",
            formFieldLabel: "text-neutral-700 dark:text-neutral-300",
            formFieldInput: "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100",
            formButtonPrimary: "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200",
            footerActionLink: "text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300"
          }
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        redirectUrl="/dashboard"
      />
    </div>
  );
} 