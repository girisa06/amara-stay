import { useCallback, useEffect, useState } from "react";
import { CalendarClock, Check, ClipboardList, RefreshCw, X } from "lucide-react";
import { getVisitRequests, updateVisitStatus } from "../../api/visits";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const STATUS_BADGE = {
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-danger",
  rescheduled: "badge-warning",
};

const messageFrom = (error) => error.response?.data?.detail || "Unable to update visit request. Please try again.";

export default function AdminVisitRequests() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [rescheduling, setRescheduling] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setVisits(await getVisitRequests());
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to load visit requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const process = async (visit, status, extra = {}) => {
    const action = status === "approved" ? "approve" : status === "rejected" ? "reject" : "reschedule";
    if (!window.confirm(`Are you sure you want to ${action} visit request ${visit.reference_id}?`)) return;
    setUpdatingId(visit.id);
    setError("");
    setNotice("");
    try {
      await updateVisitStatus(visit.id, { status, ...extra });
      setNotice(`Visit request ${visit.reference_id} was ${status}.`);
      setRescheduling(null);
      await load();
    } catch (requestError) {
      const updateError = messageFrom(requestError);
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
          <h1 className="mb-1 font-display text-2xl font-bold text-ink">Visit Requests</h1>
          <p className="text-sm text-ink/60">Review contact details and process each pending request once.</p>
        </div>
        <button type="button" onClick={load} disabled={loading} className="btn-light px-4 py-2 text-sm"><RefreshCw className="h-4 w-4" /> Refresh</button>
      </div>

      {error && <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}
      {notice && <p role="status" className="rounded-lg bg-success/10 px-4 py-3 text-sm text-success">{notice}</p>}
      {loading ? <Loader label="Loading visit requests…" /> : visits.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No visit requests yet" description="New requests will appear here." />
      ) : (
        <div className="grid gap-4">
          {visits.map((visit) => (
            <article key={visit.id} className="card p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-primary">{visit.reference_id}</span>
                    <span className={STATUS_BADGE[visit.status] || "badge"}>{visit.status}</span>
                  </div>
                  <p className="font-medium text-ink">{visit.full_name}</p>
                  <p className="text-sm text-ink/60">{visit.mobile_number} · {visit.email}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/60">
                    <CalendarClock className="h-4 w-4" />
                    {new Date(`${visit.visit_date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {visit.time_slot}
                  </p>
                  <p className="mt-1 text-xs text-ink/40">Submitted {new Date(visit.created_at).toLocaleString("en-IN")}</p>
                </div>

                {visit.status === "pending" && (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => process(visit, "approved")} disabled={updatingId === visit.id} className="btn bg-success px-4 py-2 text-sm text-white hover:bg-success/90"><Check className="h-4 w-4" /> Approve</button>
                    <button type="button" onClick={() => { setRescheduling(visit.id); setNewDate(visit.visit_date); setNewSlot(visit.time_slot); }} disabled={updatingId === visit.id} className="btn-outline px-4 py-2 text-sm">Reschedule</button>
                    <button type="button" onClick={() => process(visit, "rejected")} disabled={updatingId === visit.id} className="btn bg-danger px-4 py-2 text-sm text-white hover:bg-danger/90"><X className="h-4 w-4" /> Reject</button>
                  </div>
                )}
              </div>

              {rescheduling === visit.id && (
                <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-secondary pt-4">
                  <div><label className="label-field" htmlFor={`visit-date-${visit.id}`}>New date</label><input id={`visit-date-${visit.id}`} type="date" className="input-field" value={newDate} onChange={(event) => setNewDate(event.target.value)} /></div>
                  <div><label className="label-field" htmlFor={`visit-slot-${visit.id}`}>New time slot</label><input id={`visit-slot-${visit.id}`} className="input-field" value={newSlot} onChange={(event) => setNewSlot(event.target.value)} /></div>
                  <button type="button" onClick={() => process(visit, "rescheduled", { visit_date: newDate, time_slot: newSlot })} disabled={!newDate || !newSlot || updatingId === visit.id} className="btn-primary px-4 py-2">Save</button>
                  <button type="button" onClick={() => setRescheduling(null)} className="btn-light px-4 py-2">Cancel</button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
