import Sidebar from "@/components/Sidebar";

// (without-sidebar)/layout.tsx
export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-gray-100 flex flex-row">
      <Sidebar />
      <div className="w-full">{children}</div>
    </section>
  );
}
