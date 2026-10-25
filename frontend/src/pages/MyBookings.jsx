import { useEffect, useState } from "react";
import { CalendarCheck, ClipboardList } from "lucide-react";
import { getBookings } from "../api/bookings";
import { getMyVisitRequests } from "../api/visits";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

const BOOKING_STATUS = {
  pending: "badge-warning",
  confirmed: "badge-success",
  rejected: "badge-danger",
  cancelled: "badge-danger",
};
const VISIT_STATUS = {
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-danger",
  rescheduled: "badge-warning",
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getBookings(), getMyVisitRequests()])
      .then(([nextBookings, nextVisits]) => {
        setBookings(nextBookings);
        setVisits(nextVisits);
      })
      .catch((requestError) => setError(requestError.response?.data?.detail || "Unable to load your activity. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section container-page max-w-3xl">
      <h1 className="mb-8 font-display text-3xl font-bold text-ink">My Activity</h1>
      {error && <p role="alert" className="mb-6 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}
      {loading ? <Loader label="Loading your bookings and visits…" /> : (
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 font-display text-2xl font-semibold text-ink">Reservations</h2>
            {bookings.length === 0 ? (
              <EmptyState icon={CalendarCheck} title="No reservations yet" description="Your bed reservations will appear here." />
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <article key={booking.id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="mb-1 font-mono text-sm font-semibold text-primary">{booking.reference_id}</p>
                      <p className="text-sm text-ink/70">Room #{booking.room_id} · {booking.tenant_name}</p>
                      <p className="text-xs text-ink/50">{new Date(booking.booking_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={BOOKING_STATUS[booking.status]}>{booking.status}</span>
                      <span className="text-xs capitalize text-ink/50">{booking.payment_status}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 font-display text-2xl font-semibold text-ink">Visit Requests</h2>
            {visits.length === 0 ? (
              <EmptyState icon={ClipboardList} title="No account-linked visits yet" description="Visit requests submitted while signed in will appear here." />
            ) : (
              <div className="space-y-4">
                {visits.map((visit) => (
                  <article key={visit.id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="mb-1 font-mono text-sm font-semibold text-primary">{visit.reference_id}</p>
                      <p className="text-sm text-ink/70">{new Date(`${visit.visit_date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {visit.time_slot}</p>
                      <p className="text-xs text-ink/50">Submitted {new Date(visit.created_at).toLocaleDateString("en-IN")}</p>
                    </div>
                    <span className={VISIT_STATUS[visit.status] || "badge"}>{visit.status}</span>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
