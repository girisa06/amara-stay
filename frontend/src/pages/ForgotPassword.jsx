import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { KeyRound, CheckCircle2 } from "lucide-react";
import { forgotPassword } from "../api/auth";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setError("");
    try {
      await forgotPassword(data);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.detail || "No account found with this email.");
    }
  };

  return (
    <div className="section container-page max-w-md">
      <div className="text-center mb-8">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <KeyRound className="h-7 w-7 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold text-ink mb-2">Reset Password</h1>
        <p className="text-ink/60">
          Enter your registered email and we'll send you reset instructions.
        </p>
      </div>

      <div className="card p-6 sm:p-8">
        {sent ? (
          <div className="text-center py-6">
            <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="font-semibold text-lg text-ink mb-2">Check Your Email</h3>
            <p className="text-ink/60 mb-5">
              If an account exists for that email, password reset instructions have been sent.
            </p>
            <Link to="/login" className="btn-outline">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <p className="text-danger text-sm bg-danger/10 rounded-lg px-4 py-2.5">{error}</p>
            )}
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
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
              {isSubmitting ? "Sending..." : "Send Reset Instructions"}
            </button>
            <p className="text-center text-sm text-ink/60">
              <Link to="/login" className="text-primary font-medium">
                Back to Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
