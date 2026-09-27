import { useEffect, useState } from "react";
import { ClipboardList, Check, X, CalendarClock } from "lucide-react";
import { getVisitRequests, updateVisitStatus } from "../../api/visits";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const STATUS_BADGE = {
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-danger",
  rescheduled: "badge-warning",
};

export default function AdminVisitRequests() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [rescheduling, setRescheduling] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");

  const load = () => {
    setLoading(true);
    getVisitRequests()
      .then(setVisits)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatus = async (id, status, extra = {}) => {
    setUpdatingId(id);
    try {
      await updateVisitStatus(id, { status, ...extra });
      setRescheduling(null);
      load();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink mb-1">Visit Requests</h1>
        <p className="text-ink/60 text-sm">Approve, reject or reschedule tenant visit requests.</p>
      </div>

      {loading ? (
        <Loader />
      ) : visits.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No visit requests yet" />
      ) : (
        <div className="grid gap-4">
          {visits.map((visit) => (
            <div key={visit.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-mono text-sm text-primary font-semibold">
                      {visit.reference_id}
                    </p>
                    <span className={STATUS_BADGE[visit.status]}>{visit.status}</span>
                  </div>
                  <p className="text-sm font-medium text-ink">{visit.full_name}</p>
                  <p className="text-xs text-ink/50">
                    {visit.mobile_number} • {visit.email}
                  </p>
                  <p className="text-xs text-ink/50 mt-1">
                    {new Date(visit.visit_date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    • {visit.time_slot}
                  </p>
                </div>

                {visit.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatus(visit.id, "approved")}
                      disabled={updatingId === visit.id}
                      className="btn bg-success text-white px-4 py-2 text-sm hover:bg-success/90"
                    >
                      <Check className="h-4 w-4" /> Approve
                    </button>
                    <button
                      onClick={() => {
                        setRescheduling(visit.id);
                        setNewDate(visit.visit_date);
                        setNewSlot(visit.time_slot);
                      }}
                      className="btn-outline px-4 py-2 text-sm"
                    >
                      <CalendarClock className="h-4 w-4" /> Reschedule
                    </button>
                    <button
                      onClick={() => handleStatus(visit.id, "rejected")}
                      disabled={updatingId === visit.id}
                      className="btn bg-danger text-white px-4 py-2 text-sm hover:bg-danger/90"
                    >
                      <X className="h-4 w-4" /> Reject
                    </button>
                  </div>
                )}
              </div>

              {rescheduling === visit.id && (
                <div className="mt-4 pt-4 border-t border-secondary flex flex-wrap items-end gap-3">
                  <div>
                    <label className="label-field">New Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label-field">New Time Slot</label>
                    <input
                      className="input-field"
                      value={newSlot}
                      onChange={(e) => setNewSlot(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() =>
                      handleStatus(visit.id, "rescheduled", {
                        visit_date: newDate,
                        time_slot: newSlot,
                      })
                    }
                    className="btn-primary px-4 py-2.5 text-sm"
                  >
                    Save
                  </button>
                  <button onClick={() => setRescheduling(null)} className="btn-light px-4 py-2.5 text-sm">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
