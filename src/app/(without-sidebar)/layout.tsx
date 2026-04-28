// (without-sidebar)/layout.tsx
export default function WithoutSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-(--background-beige)">
      <div className="w-full">{children}</div>
    </section>
  );
}
