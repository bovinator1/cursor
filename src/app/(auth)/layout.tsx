export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen flex items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-900">
      <div className="w-full max-w-md">
        {children}
      </div>
    </main>
  );
} 