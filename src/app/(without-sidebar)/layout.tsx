// (without-sidebar)/layout.tsx
export default function WithoutSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen">
      <div className="w-full">{children}</div>
    </section>
  );
}
