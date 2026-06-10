import Sidebar from "@/components/Sidebar";
import { deleteStudyAtom } from "@/lib/store/deleteStudyStore";
import { DeleteBannerManager } from "@/util/hook/useDeleteBanner";

// (without-sidebar)/layout.tsx
export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen flex flex-row">
      <Sidebar />
      <div className="flex-1 min-w-0">
        {deleteStudyAtom && <DeleteBannerManager />}
        {children}
      </div>
    </section>
  );
}
