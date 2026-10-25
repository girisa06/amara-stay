import { useCallback, useEffect, useState } from "react";
import { CalendarCheck, Check, RefreshCw, X } from "lucide-react";
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
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setBookings(await getBookings());
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to load reservations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const process = async (booking, status, payment_status) => {
    const action = payment_status === "paid" ? "mark this reservation paid" : status === "confirmed" ? "confirm this reservation and reserve a bed" : "reject this reservation";
    if (!window.confirm(`Are you sure you want to ${action} (${booking.reference_id})?`)) return;
    setUpdatingId(booking.id);
    setError("");
    setNotice("");
    try {
      await updateBookingStatus(booking.id, { status, ...(payment_status ? { payment_status } : {}) });
      setNotice(payment_status === "paid" ? "Payment status updated." : `Reservation ${booking.reference_id} was ${status}.`);
      await load();
    } catch (requestError) {
      const updateError = requestError.response?.data?.detail || "Unable to update reservation. Refresh and try again.";
      await load();
      setError(updateError);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="mb-1 font-display text-2xl font-bold text-ink">Reservation Management</h1>
          <p className="text-sm text-ink/60">Confirming a reservation locks one available bed for that resident.</p>
        </div>
        <button type="button" onClick={load} disabled={loading} className="btn-light px-4 py-2 text-sm"><RefreshCw className="h-4 w-4" /> Refresh</button>
      </div>

      {error && <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}
      {notice && <p role="status" className="rounded-lg bg-success/10 px-4 py-3 text-sm text-success">{notice}</p>}
      {loading ? <Loader label="Loading reservations…" /> : bookings.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="No reservations yet" description="New resident reservations will appear here." />
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <article key={booking.id} className="card flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-primary">{booking.reference_id}</span>
                  <span className={STATUS_BADGE[booking.status]}>{booking.status}</span>
                  <span className="rounded-full bg-background px-3 py-1 text-xs text-ink/60">Payment: {booking.payment_status}</span>
                </div>
                <p className="font-medium text-ink">{booking.tenant_name}</p>
                <p className="text-sm text-ink/60">{booking.tenant_phone} · {booking.tenant_email} · Room #{booking.room_id}</p>
                <p className="mt-1 text-xs text-ink/50">Emergency contact: {booking.emergency_contact_name} · {booking.emergency_contact_phone}</p>
                <p className="mt-1 text-xs text-ink/50">Requested {new Date(booking.booking_date).toLocaleString("en-IN")}{booking.advance_amount ? ` · Advance ₹${Number(booking.advance_amount).toLocaleString("en-IN")}` : ""}</p>
              </div>

              {booking.status === "pending" && (
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => process(booking, "confirmed", "partial")} disabled={updatingId === booking.id} className="btn bg-success px-4 py-2 text-sm text-white hover:bg-success/90"><Check className="h-4 w-4" /> Confirm</button>
                  <button type="button" onClick={() => process(booking, "rejected")} disabled={updatingId === booking.id} className="btn bg-danger px-4 py-2 text-sm text-white hover:bg-danger/90"><X className="h-4 w-4" /> Reject</button>
                </div>
              )}

              {booking.status === "confirmed" && booking.payment_status !== "paid" && (
                <button type="button" onClick={() => process(booking, "confirmed", "paid")} disabled={updatingId === booking.id} className="btn-outline px-4 py-2 text-sm">
                  {updatingId === booking.id ? "Updating…" : "Mark paid"}
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
