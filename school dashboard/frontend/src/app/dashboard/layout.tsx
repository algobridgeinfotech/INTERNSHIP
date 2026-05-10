import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { RouteGuard } from "@/components/providers/RouteGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
            <div className="mx-auto w-full h-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}
