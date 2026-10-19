import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setError("");
    try {
      const user = await login(data);
      const redirectTo = location.state?.from?.pathname;
      if (user.role === "admin") navigate("/admin/dashboard");
      else navigate(redirectTo || "/");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    }
  };

  return (
    <div className="section container-page max-w-md">
      <div className="text-center mb-8">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <LogIn className="h-7 w-7 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold text-ink mb-2">Welcome Back</h1>
        <p className="text-ink/60">Login to manage your bookings and visits.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 sm:p-8 space-y-5">
        {error && <p className="text-danger text-sm bg-danger/10 rounded-lg px-4 py-2.5">{error}</p>}

        <div>
          <label className="label-field">Email</label>
          <input
            type="email"
            className="input-field"
            placeholder="you@example.com"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label className="label-field">Password</label>
            <Link to="/forgot-password" className="text-xs text-primary font-medium">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            className="input-field"
            placeholder="••••••••"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-danger text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-ink/60">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
