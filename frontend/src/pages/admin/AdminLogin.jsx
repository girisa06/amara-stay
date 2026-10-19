import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { login, logout, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (isAdmin) navigate("/admin/dashboard", { replace: true });
  }, [isAdmin, navigate]);

  const submit = async (credentials) => {
    setError("");
    try {
      const user = await login(credentials);
      if (user.role !== "admin") {
        logout();
        setError("Access denied. This account is not an administrator.");
        return;
      }
      const destination = location.state?.from?.pathname;
      navigate(destination?.startsWith("/admin") && destination !== "/admin/login" ? destination : "/admin/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to sign in. Check your email and password.");
    }
  };

  if (loading) return <div className="section container-page"><p className="text-center text-ink/60">Checking your session…</p></div>;
  if (isAdmin) return null;

  return (
    <section className="section container-page max-w-md">
      <div className="card p-6 sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">AMARA Stay</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink">Admin Portal</h1>
          <p className="mt-2 text-sm text-ink/60">Sign in with an administrator account.</p>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-5">
          {error && <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}
          <div>
            <label className="label-field" htmlFor="admin-email">Email</label>
            <input id="admin-email" type="email" autoComplete="username" className="input-field" {...register("email", { required: "Email is required" })} />
            {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label-field" htmlFor="admin-password">Password</label>
            <input id="admin-password" type="password" autoComplete="current-password" className="input-field" {...register("password", { required: "Password is required" })} />
            {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
            {isSubmitting ? "Signing in…" : "Sign in to Admin Portal"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-ink/60">
          Resident? <Link to="/login" className="font-medium text-primary">Use resident login</Link>
        </p>
      </div>
    </section>
  );
}
