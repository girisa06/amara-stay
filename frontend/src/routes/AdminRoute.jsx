import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";

export default function AdminRoute() {
  const { isAuthenticated, isAdmin, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  if (!isAdmin) {
    return (
      <main className="section container-page max-w-xl text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-danger">403 · Access denied</p>
        <h1 className="font-display text-3xl font-bold text-ink">Administrator access required</h1>
        <p className="my-4 text-ink/60">This account does not have permission to open the admin portal.</p>
        <div className="flex justify-center gap-3">
          <Link to="/" className="btn-light">Return to AMARA Stay</Link>
          <button type="button" className="btn-outline" onClick={logout}>Sign out</button>
        </div>
      </main>
    );
  }
  return <Outlet />;
}
