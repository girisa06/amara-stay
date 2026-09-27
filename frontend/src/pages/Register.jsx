import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setError("");
    try {
      await registerUser(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="section container-page max-w-md">
      <div className="text-center mb-8">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <UserPlus className="h-7 w-7 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold text-ink mb-2">Create Your Account</h1>
        <p className="text-ink/60">Register to book visits, reserve beds, and track requests.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 sm:p-8 space-y-5">
        {error && <p className="text-danger text-sm bg-danger/10 rounded-lg px-4 py-2.5">{error}</p>}

        <div>
          <label className="label-field">Full Name</label>
          <input
            className="input-field"
            placeholder="Your full name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
        </div>

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
          <label className="label-field">Phone</label>
          <input
            className="input-field"
            placeholder="10-digit phone number"
            {...register("phone", {
              required: "Phone is required",
              pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
            })}
          />
          {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="label-field">Password</label>
          <input
            type="password"
            className="input-field"
            placeholder="At least 6 characters"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
          />
          {errors.password && (
            <p className="text-danger text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="label-field">Confirm Password</label>
          <input
            type="password"
            className="input-field"
            placeholder="Re-enter your password"
            {...register("confirm_password", {
              required: "Please confirm your password",
              validate: (value) => value === watch("password") || "Passwords do not match",
            })}
          />
          {errors.confirm_password && (
            <p className="text-danger text-xs mt-1">{errors.confirm_password.message}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
          {isSubmitting ? "Creating account..." : "Register"}
        </button>

        <p className="text-center text-sm text-ink/60">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
