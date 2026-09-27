import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:block flex-shrink-0">
        <AdminSidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="lg:hidden flex items-center justify-between px-5 py-4 bg-white border-b border-secondary/60">
          <p className="font-display font-semibold text-primary">AMARA Stay Admin</p>
          <button onClick={() => setMobileOpen(true)} className="p-1">
            <Menu className="h-6 w-6 text-ink" />
          </button>
        </div>
        <div className="flex-1 p-5 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
