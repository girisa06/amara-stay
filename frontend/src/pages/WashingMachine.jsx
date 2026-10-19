import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Clock3, RefreshCw, ShieldCheck, WashingMachine } from "lucide-react";
import {
  endWashingMachineSession,
  getWashingMachineHistory,
  getWashingMachineStatus,
  releaseReportedWashingMachineSession,
  reportWashingMachineSession,
  startWashingMachineSession,
} from "../api/washingMachine";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";

const POLL_INTERVAL_MS = 7000;
const FORGOTTEN_AFTER_MS = 2 * 60 * 60 * 1000;

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatElapsed(startedAt, now) {
  const seconds = Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
}

function errorMessage(error) {
  return error.response?.data?.detail || "We couldn't update the washing machine status. Please try again.";
}

export default function WashingMachinePage() {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshError, setRefreshError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());

  const refresh = useCallback(async (initial = false) => {
    if (initial) setLoading(true);
    try {
      const [nextStatus, nextHistory] = await Promise.all([
        getWashingMachineStatus(),
        getWashingMachineHistory(),
      ]);
      setStatus(nextStatus);
      setHistory(nextHistory);
      setRefreshError("");
    } catch (error) {
      setRefreshError(errorMessage(error));
    } finally {
      if (initial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let timer;
    let active = true;
    const poll = async (initial = false) => {
      if (active) await refresh(initial);
      if (active) timer = window.setTimeout(poll, POLL_INTERVAL_MS);
    };
    poll(true);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [refresh]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const activeSession = status?.active_session;
  const elapsedMs = useMemo(
    () => (activeSession ? now - new Date(activeSession.started_at).getTime() : 0),
    [activeSession, now],
  );
  const shouldOfferReport = activeSession && !activeSession.is_mine && elapsedMs >= FORGOTTEN_AFTER_MS;

  const performAction = async (action, successText) => {
    setBusy(true);
    setActionError("");
    setNotice("");
    try {
      await action();
      setNotice(successText);
      await refresh();
    } catch (error) {
      setActionError(errorMessage(error));
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  if (loading && !status) {
    return <div className="section container-page"><Loader label="Checking the shared washing machine…" /></div>;
  }

  if (!status) {
    return (
      <section className="section container-page max-w-3xl">
        <EmptyState icon={WashingMachine} title="Status is unavailable" description={refreshError || "Please try again."} />
        <div className="mt-5 text-center">
          <button onClick={() => refresh(true)} className="btn-outline" type="button">
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section container-page max-w-4xl">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">Resident Facilities</p>
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Washing Machine</h1>
        <p className="mt-2 text-ink/60">Check the shared machine and keep your neighbours up to date.</p>
      </div>

      <div className="card overflow-hidden">
        <div className={`flex items-center gap-4 border-b border-secondary/50 p-5 sm:p-7 ${activeSession ? "bg-amber-50/70" : "bg-green-50/70"}`}>
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${activeSession ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>
            {activeSession ? <Clock3 className="h-7 w-7" /> : <CheckCircle2 className="h-7 w-7" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink/60">{status.machine_name}</p>
            <h2 className={`font-display text-2xl font-semibold ${activeSession ? "text-amber-900" : "text-green-900"}`}>
              {activeSession ? "In Use" : "Available"}
            </h2>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${activeSession ? "bg-amber-100 text-amber-900" : "bg-green-100 text-green-900"}`}>
            Resident reported
          </span>
        </div>

        <div className="p-5 sm:p-7">
          {activeSession ? (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-background p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink/50">Currently using</p>
                  <p className="mt-1 truncate font-semibold text-ink">
                    {activeSession.is_mine ? `${activeSession.user_name} (you)` : activeSession.user_name}
                  </p>
                </div>
                <div className="rounded-xl bg-background p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink/50">Started</p>
                  <p className="mt-1 font-semibold text-ink">{formatDate(activeSession.started_at)}</p>
                </div>
                <div className="rounded-xl bg-background p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink/50">Elapsed time</p>
                  <p className="mt-1 font-semibold text-ink">{formatElapsed(activeSession.started_at, now)}</p>
                </div>
              </div>

              <p className="flex items-start gap-2 text-sm text-ink/60">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                This status is reported by residents; it is not connected to a machine sensor. No finish estimate is available.
              </p>

              {activeSession.reported_at && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                  This long-running session was reported for staff review. It stays marked in use until the resident ends it or an admin reviews the report.
                </div>
              )}

              {activeSession.is_mine ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => performAction(() => endWashingMachineSession(activeSession.id), "Your washing session has ended. The machine is available.")}
                  className="btn-primary w-full sm:w-auto"
                >
                  {busy ? "Updating…" : "Finish Using Machine"}
                </button>
              ) : shouldOfferReport && !activeSession.reported_at ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => performAction(() => reportWashingMachineSession(activeSession.id), "The session was reported to staff for review.")}
                  className="btn-outline w-full sm:w-auto"
                >
                  {busy ? "Sending report…" : "Report as Possibly Forgotten"}
                </button>
              ) : null}

              {activeSession.reported_at && user?.role === "admin" && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => performAction(() => releaseReportedWashingMachineSession(activeSession.id), "The reported session was released after staff review.")}
                  className="btn-primary w-full sm:w-auto"
                >
                  {busy ? "Updating…" : "Release After Review"}
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-ink">Ready for use</h3>
                <p className="mt-1 max-w-xl text-sm text-ink/60">Start a resident-reported session when you begin. Please finish it when you are done.</p>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => performAction(() => startWashingMachineSession(), "Your session has started.")}
                className="btn-primary w-full sm:w-auto"
              >
                <WashingMachine className="h-4 w-4" />
                {busy ? "Starting…" : "Start Using Machine"}
              </button>
            </div>
          )}
        </div>
      </div>

      {actionError && <p role="alert" className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{actionError}</p>}
      {notice && <p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-900">{notice}</p>}
      {refreshError && status && <p role="alert" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Live refresh failed. Showing the last known status. {refreshError}</p>}

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">Recent Usage</h2>
          <button type="button" onClick={() => refresh()} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
        {history.length === 0 ? (
          <div className="rounded-xl border border-dashed border-secondary bg-white/70 px-5 py-8 text-center text-sm text-ink/60">No completed sessions have been recorded yet.</div>
        ) : (
          <ul className="space-y-3">
            {history.map((item) => (
              <li key={item.id} className="card flex flex-col gap-2 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                <span className="font-medium text-ink">{formatDate(item.started_at)}</span>
                <span className="text-ink/60">Finished {formatDate(item.ended_at)}</span>
                {item.was_reported && <span className="text-xs font-medium text-amber-800">Staff reviewed report</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
