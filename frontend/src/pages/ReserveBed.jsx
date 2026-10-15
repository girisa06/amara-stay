import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BedDouble, CheckCircle2 } from "lucide-react";
import { getRooms } from "../api/rooms";
import { createBooking } from "../api/bookings";
import Loader from "../components/common/Loader";

export default function ReserveBed() {
  const [searchParams] = useSearchParams();
  const preselectedRoomId = searchParams.get("room");

  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [confirmation, setConfirmation] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { room_id: preselectedRoomId || "" },
  });

  const selectedRoomId = watch("room_id");
  const selectedRoom = rooms.find((r) => String(r.id) === String(selectedRoomId));
  const advanceAmount = watch("advance_amount");

  useEffect(() => {
    getRooms({ availability: "available" })
      .then(setRooms)
      .finally(() => setLoadingRooms(false));
  }, []);

  const onSubmit = async (data) => {
    setSubmitError("");
    try {
      const booking = await createBooking({ ...data, room_id: Number(data.room_id) });
      setConfirmation(booking);
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
          <h2 className="font-display text-2xl font-bold text-ink mb-2">Reservation Submitted!</h2>
          <p className="text-ink/60 mb-5">
            Your bed reservation request has been sent to the owner for approval.
          </p>
          <div className="bg-secondary/30 rounded-lg p-4 mb-6">
            <p className="text-xs text-ink/50 mb-1">Booking Reference ID</p>
            <p className="font-mono text-lg font-semibold text-primary">
              {confirmation.reference_id}
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/my-bookings" className="btn-outline">View My Bookings</Link>
            <Link to="/" className="btn-primary">Back to Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="section container-page max-w-3xl">
      <div className="text-center mb-10">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <BedDouble className="h-7 w-7 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold text-ink mb-2">Reserve a Bed</h1>
        <p className="text-ink/60">Fill in your details to reserve your bed at AMARA Ladies PG.</p>
      </div>

      {loadingRooms ? (
        <Loader label="Loading rooms..." />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 card p-6 sm:p-8 space-y-5">
            {submitError && (
              <p className="text-danger text-sm bg-danger/10 rounded-lg px-4 py-2.5">
                {submitError}
              </p>
            )}

            <div>
              <label className="label-field">Select Room</label>
              <select
                className="input-field"
                {...register("room_id", { required: "Please select a room" })}
              >
                <option value="">Choose a room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.room_number} — {room.room_type} sharing (₹
                    {Number(room.rent).toLocaleString("en-IN")}/mo)
                  </option>
                ))}
              </select>
              {errors.room_id && (
                <p className="text-danger text-xs mt-1">{errors.room_id.message}</p>
              )}
            </div>

            <p className="text-sm font-semibold text-ink pt-2">Tenant Details</p>
            <div>
              <label className="label-field">Full Name</label>
              <input
                className="input-field"
                {...register("tenant_name", { required: "Full name is required" })}
              />
              {errors.tenant_name && (
                <p className="text-danger text-xs mt-1">{errors.tenant_name.message}</p>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label-field">Phone Number</label>
                <input
                  className="input-field"
                  {...register("tenant_phone", {
                    required: "Phone is required",
                    pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
                  })}
                />
                {errors.tenant_phone && (
                  <p className="text-danger text-xs mt-1">{errors.tenant_phone.message}</p>
                )}
              </div>
              <div>
                <label className="label-field">Email</label>
                <input
                  type="email"
                  className="input-field"
                  {...register("tenant_email", { required: "Email is required" })}
                />
                {errors.tenant_email && (
                  <p className="text-danger text-xs mt-1">{errors.tenant_email.message}</p>
                )}
              </div>
            </div>

            <p className="text-sm font-semibold text-ink pt-2">Emergency Contact</p>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label-field">Contact Name</label>
                <input
                  className="input-field"
                  {...register("emergency_contact_name", { required: "Required" })}
                />
                {errors.emergency_contact_name && (
                  <p className="text-danger text-xs mt-1">Required</p>
                )}
              </div>
              <div>
                <label className="label-field">Contact Phone</label>
                <input
                  className="input-field"
                  {...register("emergency_contact_phone", {
                    required: "Required",
                    pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
                  })}
                />
                {errors.emergency_contact_phone && (
                  <p className="text-danger text-xs mt-1">
                    {errors.emergency_contact_phone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="label-field">Advance Amount (₹)</label>
              <input
                type="number"
                className="input-field"
                placeholder="Optional advance payment"
                {...register("advance_amount")}
              />
            </div>

            <div>
              <label className="label-field">Additional Notes</label>
              <textarea
                rows={3}
                className="input-field"
                placeholder="Anything else we should know?"
                {...register("notes")}
              />
            </div>
          </div>

          <div>
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-ink mb-4">Reservation Summary</h3>
              {selectedRoom ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink/60">Room</span>
                    <span className="font-medium text-ink">{selectedRoom.room_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/60">Type</span>
                    <span className="font-medium text-ink capitalize">
                      {selectedRoom.room_type} sharing
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/60">Monthly Rent</span>
                    <span className="font-medium text-ink">
                      ₹{Number(selectedRoom.rent).toLocaleString("en-IN")}
                    </span>
                  </div>
                  {Number(selectedRoom.deposit) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-ink/60">Security Deposit</span>
                      <span className="font-medium text-ink">
                        ₹{Number(selectedRoom.deposit).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-secondary pt-3">
                    <span className="text-ink/60">Advance Paid</span>
                    <span className="font-medium text-ink">
                      ₹{advanceAmount ? Number(advanceAmount).toLocaleString("en-IN") : "0"}
                    </span>
                  </div>
                  <div className="flex justify-between text-primary font-semibold border-t border-secondary pt-3">
                    <span>Payable at Check-in</span>
                    <span>
                      ₹
                      {(
                        Number(selectedRoom.rent) +
                        Number(selectedRoom.deposit) -
                        Number(advanceAmount || 0)
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-ink/50">Select a room to see the summary.</p>
              )}

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-6">
                {isSubmitting ? "Submitting..." : "Submit Reservation"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
