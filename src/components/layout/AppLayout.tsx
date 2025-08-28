import { useState, type ReactNode } from "react";
import {
  Home,
  ListChecks,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";

type Props = { children: ReactNode };

function NavLink({
  to,
  icon: Icon,
  label,
  collapsed,
  onClick,
  active,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group flex items-center gap-2 rounded-md px-2 py-2 transition-colors
        ${
          active
            ? "bg-primary-50 text-primary-700"
            : "hover:bg-gray-100 text-gray-700"
        }`}
      title={collapsed ? label : undefined}
    >
      <Icon
        size={18}
        className={
          active
            ? "text-primary-700"
            : "text-gray-600 group-hover:text-gray-800"
        }
      />
      <span
        className={`whitespace-nowrap transition-opacity duration-200 ${
          collapsed ? "opacity-0 pointer-events-none w-0" : "opacity-100 w-auto"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

export default function AppLayout({ children }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout, user } = useAuthStore();

  // Desktop collapse, Mobile drawer
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const signout = () => {
    logout();
    navigate("/login");
  };

  // Close mobile drawer when route changes
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex bg-white shadow-md flex-col transition-[width] duration-300
          ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Brand + collapse toggle */}
        <div className="flex items-center justify-between p-4 shadow-sm shadow-indigo-50">
          <div
            className={`font-bold text-lg text-primary-600 transition-opacity ${
              collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            Quiz App
          </div>
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((c) => !c)}
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            to="/"
            icon={Home}
            label="Dashboard"
            collapsed={collapsed}
            active={pathname === "/"}
          />
          <NavLink
            to="/quiz"
            icon={ListChecks}
            label="Take Quiz"
            collapsed={collapsed}
            active={pathname.startsWith("/quiz")}
          />
        </nav>

        <div className="p-4 border-t border-indigo-50 flex items-center justify-between">
          {!collapsed ? (
            <>
              <span className="text-sm text-gray-600 truncate">
                {user?.name}
              </span>
              <Button onClick={signout} className="flex items-center gap-1">
                <LogOut size={16} /> Logout
              </Button>
            </>
          ) : (
            <button
              type="button"
              onClick={signout}
              title="Logout"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Drawer + Scrim */}
      {/* Scrim */}
      <div
        onClick={closeMobile}
        className={`fixed inset-0 z-40 bg-black/40 md:hidden transition-opacity duration-200 ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl md:hidden
          transform transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between p-4 shadow-sm">
          <div className="font-bold text-lg text-primary-600">Quiz App</div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMobile}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            to="/"
            icon={Home}
            label="Dashboard"
            collapsed={false}
            onClick={closeMobile}
            active={pathname === "/"}
          />
          <NavLink
            to="/quiz"
            icon={ListChecks}
            label="Take Quiz"
            collapsed={false}
            onClick={closeMobile}
            active={pathname.startsWith("/quiz")}
          />
        </nav>

        <div className="p-4 border-t border-indigo-50 flex items-center justify-between">
          <span className="text-sm text-gray-600 truncate">{user?.name}</span>
          <Button onClick={signout} className="flex items-center gap-1">
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-white shadow-sm shadow-indigo-50">
          {/* Hamburger on mobile */}
          <button
            type="button"
            className="inline-flex p-4 h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100 md:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>

          <h1 className="font-semibold text-lg">Quiz Dashboard</h1>

          {/* Spacer to keep title centered on mobile */}
          <div className="h-10 w-10 md:w-0" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
