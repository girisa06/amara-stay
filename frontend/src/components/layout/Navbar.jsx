import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Home, LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/rooms", label: "Rooms" },
  { to: "/enquiry", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-secondary/60">
      <div className="container-page flex items-center justify-between h-18 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-display font-semibold text-lg">
            A
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-primary leading-tight">
              AMARA Stay
            </p>
            <p className="text-[11px] text-ink/50 leading-tight tracking-wide">
              Comfort. Safety. Convenience.
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-primary" : "text-ink/70 hover:text-primary"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <>
                  <Link to="/washing-machine" className="btn-light text-sm px-4 py-2">
                    Washing Machine
                  </Link>
                  <Link to="/admin" className="btn-outline text-sm px-4 py-2">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/washing-machine" className="btn-outline text-sm px-4 py-2">
                    <span className="sr-only">Open </span>Washing Machine
                  </Link>
                  <Link to="/my-bookings" className="btn-light text-sm px-4 py-2">
                    <UserIcon className="h-4 w-4" /> {user?.name?.split(" ")[0]}
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="btn-light text-sm px-4 py-2">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink/70 hover:text-primary">
                Login
              </Link>
              <Link to="/book-visit" className="btn-primary text-sm px-5 py-2.5">
                Book a Visit
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-secondary/60 bg-background">
          <div className="container-page py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-ink/80 py-2 text-sm font-medium"
              >
                <Home className="h-4 w-4" /> {link.label}
              </NavLink>
            ))}
            <div className="border-t border-secondary/60 pt-3 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <>
                      <Link to="/washing-machine" onClick={() => setOpen(false)} className="btn-light w-full">
                        Washing Machine
                      </Link>
                      <Link to="/admin" onClick={() => setOpen(false)} className="btn-outline w-full">
                        Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/washing-machine" onClick={() => setOpen(false)} className="btn-outline w-full">
                        Washing Machine
                      </Link>
                      <Link to="/my-bookings" onClick={() => setOpen(false)} className="btn-light w-full">
                        My Bookings
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="btn-light w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-light w-full">
                    Login
                  </Link>
                  <Link
                    to="/book-visit"
                    onClick={() => setOpen(false)}
                    className="btn-primary w-full"
                  >
                    Book a Visit
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
