import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Levercast",
  description: "AI-powered social media content creation for entrepreneurs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
