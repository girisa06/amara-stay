import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  CreditCard,
  ClipboardList,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/admin/payments", label: "Payment Verification", icon: CreditCard },
  { to: "/admin/visits", label: "Visit Requests", icon: ClipboardList },
  { to: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { to: "/admin/tenants", label: "Tenants", icon: Users },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ onNavigate }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="h-full w-64 bg-primary-dark text-white flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <p className="font-display text-xl font-semibold">AMARA Stay</p>
        <p className="text-xs text-white/50 mt-0.5">Owner Dashboard</p>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white border-r-4 border-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon className="h-4.5 w-4.5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-5 border-t border-white/10">
        <p className="text-sm font-medium">{user?.name}</p>
        <p className="text-xs text-white/50 mb-3">{user?.email}</p>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
