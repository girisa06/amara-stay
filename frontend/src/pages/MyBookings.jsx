import { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { getBookings } from "../api/bookings";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

const STATUS_BADGE = {
  pending: "badge-warning",
  confirmed: "badge-success",
  rejected: "badge-danger",
  cancelled: "badge-danger",
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookings()
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section container-page max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-ink mb-8">My Bookings</h1>

      {loading ? (
        <Loader />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings yet"
          description="Reserve a bed or book a visit to see your requests here."
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-mono text-sm text-primary font-semibold mb-1">
                  {booking.reference_id}
                </p>
                <p className="text-sm text-ink/70">
                  Room #{booking.room_id} • {booking.tenant_name}
                </p>
                <p className="text-xs text-ink/50">
                  {new Date(booking.booking_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={STATUS_BADGE[booking.status]}>{booking.status}</span>
                <span className="text-xs text-ink/50 capitalize">{booking.payment_status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
