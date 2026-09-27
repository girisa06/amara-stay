import { useEffect, useState } from "react";
import { CalendarCheck, Check, X } from "lucide-react";
import { getBookings, updateBookingStatus } from "../../api/bookings";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const STATUS_BADGE = {
  pending: "badge-warning",
  confirmed: "badge-success",
  rejected: "badge-danger",
  cancelled: "badge-danger",
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => {
    setLoading(true);
    getBookings()
      .then(setBookings)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatus = async (id, status, payment_status) => {
    setUpdatingId(id);
    try {
      await updateBookingStatus(id, { status, payment_status });
      load();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink mb-1">Reservation Management</h1>
        <p className="text-ink/60 text-sm">Confirm or reject bed reservations and track payments.</p>
      </div>

      {loading ? (
        <Loader />
      ) : bookings.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="No reservations yet" />
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-mono text-sm text-primary font-semibold">
                    {booking.reference_id}
                  </p>
                  <span className={STATUS_BADGE[booking.status]}>{booking.status}</span>
                </div>
                <p className="text-sm font-medium text-ink">{booking.tenant_name}</p>
                <p className="text-xs text-ink/50">
                  {booking.tenant_phone} • {booking.tenant_email} • Room #{booking.room_id}
                </p>
                <p className="text-xs text-ink/50 mt-1">
                  Emergency: {booking.emergency_contact_name} ({booking.emergency_contact_phone})
                </p>
                <p className="text-xs text-ink/50 mt-1 capitalize">
                  Payment: {booking.payment_status}
                  {booking.advance_amount ? ` • Advance ₹${Number(booking.advance_amount).toLocaleString("en-IN")}` : ""}
                </p>
              </div>

              {booking.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatus(booking.id, "confirmed", "partial")}
                    disabled={updatingId === booking.id}
                    className="btn bg-success text-white px-4 py-2 text-sm hover:bg-success/90"
                  >
                    <Check className="h-4 w-4" /> Confirm
                  </button>
                  <button
                    onClick={() => handleStatus(booking.id, "rejected")}
                    disabled={updatingId === booking.id}
                    className="btn bg-danger text-white px-4 py-2 text-sm hover:bg-danger/90"
                  >
                    <X className="h-4 w-4" /> Reject
                  </button>
                </div>
              )}

              {booking.status === "confirmed" && booking.payment_status !== "paid" && (
                <button
                  onClick={() => handleStatus(booking.id, "confirmed", "paid")}
                  disabled={updatingId === booking.id}
                  className="btn-outline text-sm px-4 py-2"
                >
                  Mark Paid
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
