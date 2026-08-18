import { auth } from "@/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ProfileDropdown } from "@/components/dashboard/ProfileDropdown";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Protect the dashboard
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col md:flex-row relative">
      {/* Background blurs for aurora feel */}
      <div className="fixed top-0 left-1/4 w-[50%] h-[30%] bg-aurora-gradient-subtle blur-[140px] rounded-full pointer-events-none z-0" />

      {/* Sidebar Navigation */}
      <div className="z-10">
        <DashboardSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen z-10 relative">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-end px-8">
          <ProfileDropdown user={session.user} />
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
