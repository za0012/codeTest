import Sidebar from "@/components/Sidebar";

// (without-sidebar)/layout.tsx
export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen flex flex-row">
      <Sidebar />
      <div className="w-full">{children}</div>
    </section>
  );
}
