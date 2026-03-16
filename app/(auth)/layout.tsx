export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full">{children}</div>
    </div>
  );
}
