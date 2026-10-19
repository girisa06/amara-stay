import { useCallback, useEffect, useState } from "react";
import { BedDouble, CalendarClock, ClipboardList, DoorClosed, DoorOpen, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { getOverview, getRecentActivity } from "../../api/dashboard";
import StatCard from "../../components/admin/StatCard";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const VISIT_STATUS = {
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-danger",
  rescheduled: "badge-warning",
};
const BOOKING_STATUS = {
  pending: "badge-warning",
  confirmed: "badge-success",
  rejected: "badge-danger",
  cancelled: "badge-danger",
};

function ActivityCard({ title, href, empty, items, children }) {
  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
        <Link to={href} className="text-sm font-medium text-primary hover:underline">View all</Link>
      </div>
      {items.length === 0 ? <p className="py-5 text-center text-sm text-ink/50">{empty}</p> : children}
    </section>
  );
}

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [activity, setActivity] = useState({ visits: [], reservations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [nextOverview, nextActivity] = await Promise.all([getOverview(), getRecentActivity()]);
      setOverview(nextOverview);
      setActivity(nextActivity);
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading && !overview) return <Loader label="Loading dashboard…" />;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="mb-1 font-display text-2xl font-bold text-ink">Dashboard Overview</h1>
          <p className="text-sm text-ink/60">Current room availability and recent resident activity.</p>
        </div>
        <button type="button" onClick={load} disabled={loading} className="btn-light px-4 py-2 text-sm">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {error && <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}

      {overview && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard icon={BedDouble} label="Total Rooms" value={overview.total_rooms} />
            <StatCard icon={DoorOpen} label="Available Rooms" value={overview.available_rooms} accent="success" />
            <StatCard icon={DoorClosed} label="Occupied / Unavailable Rooms" value={overview.occupied_unavailable_rooms} accent="warning" />
            <StatCard icon={CalendarClock} label="Pending Visit Requests" value={overview.pending_visits} accent="warning" />
            <StatCard icon={ClipboardList} label="Pending Reservations" value={overview.pending_reservations} accent="warning" />
            <StatCard icon={BedDouble} label="Available Beds" value={`${overview.available_beds} / ${overview.total_beds}`} accent="success" />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <ActivityCard title="Recent Visit Requests" href="/admin/visits" items={activity.visits} empty="No visit requests yet.">
              <ul className="divide-y divide-secondary/50">
                {activity.visits.map((visit) => (
                  <li key={visit.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{visit.name}</p>
                      <p className="text-xs text-ink/50">{visit.reference_id} · {visit.date} · {visit.time_slot}</p>
                    </div>
                    <span className={VISIT_STATUS[visit.status] || "badge"}>{visit.status}</span>
                  </li>
                ))}
              </ul>
            </ActivityCard>

            <ActivityCard title="Recent Reservations" href="/admin/bookings" items={activity.reservations} empty="No reservations yet.">
              <ul className="divide-y divide-secondary/50">
                {activity.reservations.map((booking) => (
                  <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{booking.name}</p>
                      <p className="text-xs text-ink/50">{booking.reference_id} · Room {booking.room_number || "—"} · {new Date(booking.created_at).toLocaleDateString("en-IN")}</p>
                    </div>
                    <span className={BOOKING_STATUS[booking.status] || "badge"}>{booking.status}</span>
                  </li>
                ))}
              </ul>
            </ActivityCard>
          </div>
        </>
      )}

      {!overview && !loading && <EmptyState icon={RefreshCw} title="Dashboard data unavailable" description="Refresh the page to try again." />}
    </div>
  );
}
