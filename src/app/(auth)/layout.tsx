export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-900 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Levercast</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            AI-powered social media content creation
          </p>
        </div>
        {children}
      </div>
    </div>
  );
} 