import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck, CheckCircle2, Clock } from "lucide-react";
import { createVisitRequest } from "../api/visits";

const TIME_SLOTS = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
];

export default function BookVisit() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const [confirmation, setConfirmation] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const selectedSlot = watch("time_slot");

  const today = new Date().toISOString().split("T")[0];

  const onSubmit = async (data) => {
    setSubmitError("");
    try {
      const visit = await createVisitRequest(data);
      setConfirmation(visit);
    } catch (err) {
      setSubmitError(
        err.response?.data?.detail || "Something went wrong. Please try again."
      );
    }
  };

  if (confirmation) {
    return (
      <div className="section container-page max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 text-center"
        >
          <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink mb-2">Visit Requested!</h2>
          <p className="text-ink/60 mb-5">
            We've received your visit request. Our team will confirm shortly.
          </p>
          <div className="bg-secondary/30 rounded-lg p-4 mb-6">
            <p className="text-xs text-ink/50 mb-1">Booking Reference ID</p>
            <p className="font-mono text-lg font-semibold text-primary">
              {confirmation.reference_id}
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="btn-outline">Back to Home</Link>
            <Link to="/rooms" className="btn-primary">Explore Rooms</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="section container-page max-w-2xl">
      <div className="text-center mb-10">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <CalendarCheck className="h-7 w-7 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold text-ink mb-2">Book a Visit</h1>
        <p className="text-ink/60">
          Schedule a convenient time to tour AMARA Ladies PG in person.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 sm:p-8 space-y-5">
        {submitError && (
          <p className="text-danger text-sm bg-danger/10 rounded-lg px-4 py-2.5">{submitError}</p>
        )}

        <div>
          <label className="label-field">Full Name</label>
          <input
            className="input-field"
            placeholder="Enter your full name"
            {...register("full_name", { required: "Full name is required" })}
          />
          {errors.full_name && (
            <p className="text-danger text-xs mt-1">{errors.full_name.message}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label-field">Mobile Number</label>
            <input
              className="input-field"
              placeholder="10-digit mobile number"
              {...register("mobile_number", {
                required: "Mobile number is required",
                pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
              })}
            />
            {errors.mobile_number && (
              <p className="text-danger text-xs mt-1">{errors.mobile_number.message}</p>
            )}
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
        </div>

        <div>
          <label className="label-field">Preferred Date</label>
          <input
            type="date"
            min={today}
            className="input-field"
            {...register("visit_date", { required: "Preferred date is required" })}
          />
          {errors.visit_date && (
            <p className="text-danger text-xs mt-1">{errors.visit_date.message}</p>
          )}
        </div>

        <div>
          <label className="label-field">Preferred Time Slot</label>
          <div className="grid sm:grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                type="button"
                key={slot}
                onClick={() => setValue("time_slot", slot, { shouldValidate: true })}
                className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors ${
                  selectedSlot === slot
                    ? "bg-primary text-white border-primary"
                    : "border-secondary text-ink/70 hover:border-primary"
                }`}
              >
                <Clock className="h-3.5 w-3.5" /> {slot}
              </button>
            ))}
          </div>
          <input type="hidden" {...register("time_slot", { required: "Select a time slot" })} />
          {errors.time_slot && (
            <p className="text-danger text-xs mt-1">{errors.time_slot.message}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
          {isSubmitting ? "Submitting..." : "Confirm Visit Request"}
        </button>
      </form>
    </div>
  );
}
