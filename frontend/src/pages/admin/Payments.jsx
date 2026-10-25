import { useCallback, useEffect, useState } from "react";
import { fetchPaymentProof, getAdminPayments, getPaymentSettings, rejectPayment, savePaymentSettings, verifyPayment } from "../../api/payments";
import Loader from "../../components/common/Loader";

const STATUS = { pending: "Pending Verification", verified: "Verified", rejected: "Rejected" };
const BADGE = { pending: "badge-warning", verified: "badge-success", rejected: "badge-danger" };

export default function Payments() {
  const [rows, setRows] = useState([]); const [settings, setSettings] = useState({ upi_id: "" });
  const [status, setStatus] = useState(""); const [month, setMonth] = useState(""); const [selected, setSelected] = useState(null);
  const [proof, setProof] = useState(""); const [error, setError] = useState(""); const [message, setMessage] = useState(""); const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { setError(""); try { const [payments, config] = await Promise.all([getAdminPayments({ ...(status ? { status } : {}), ...(month ? { month } : {}) }), getPaymentSettings()]); setRows(payments); setSettings({ upi_id: config.upi_id || "" }); } catch (e) { setError(e.response?.data?.detail || "Unable to load payment submissions."); } finally { setLoading(false); } }, [month, status]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { let current = ""; if (selected) fetchPaymentProof(selected.id).then((url) => { current = url; setProof(url); }).catch((e) => setError(e.response?.data?.detail || "Unable to load payment proof.")); else setProof(""); return () => { if (current) URL.revokeObjectURL(current); }; }, [selected]);
  const review = async (action) => {
    if (!selected) return;
    if (action === "verify" && !window.confirm("Confirm you checked the UPI or bank records and received this payment?")) return;
    let reason;
    if (action === "reject") { reason = window.prompt("Enter the reason for rejecting this payment:"); if (reason === null) return; if (!reason.trim()) { setError("A rejection reason is required."); return; } }
    setBusy(true); setError("");
    try { if (action === "verify") await verifyPayment(selected.id); else await rejectPayment(selected.id, reason.trim()); setMessage(`Payment marked ${action === "verify" ? "verified" : "rejected"}.`); setSelected(null); await load(); }
    catch (e) { setError(e.response?.data?.detail || "Unable to review payment."); }
    finally { setBusy(false); }
  };
  const saveUpi = async (e) => { e.preventDefault(); setError(""); try { await savePaymentSettings(settings.upi_id.trim() || null); setMessage("UPI details saved."); } catch (e2) { setError(e2.response?.data?.detail || "Unable to save UPI details."); } };
  if (loading) return <Loader label="Loading payment verification…" />;
  return <div className="space-y-6">
    <div><h1 className="mb-1 font-display text-2xl font-bold text-ink">Payment Verification</h1><p className="text-sm text-ink/60">Review submitted proof against your UPI or bank records before verifying receipt.</p></div>
    {error && <p role="alert" className="rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</p>}{message && <p role="status" className="rounded-lg bg-success/10 p-3 text-sm text-success">{message}</p>}
    <form onSubmit={saveUpi} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-end"><label className="flex-1 text-sm">Resident payment UPI ID<input className="input-field mt-1" maxLength="120" placeholder="Set the actual UPI ID" value={settings.upi_id} onChange={(e) => setSettings({ upi_id: e.target.value })} /></label><button className="btn-primary px-4 py-3">Save UPI ID</button></form>
    <section className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary/50 p-4"><p className="font-semibold">Submissions <span className="badge-warning ml-2">{rows.filter((r) => r.status === "pending").length} pending</span></p><div className="flex gap-2"><select aria-label="Status filter" className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option><option value="pending">Pending verification</option><option value="verified">Verified</option><option value="rejected">Rejected</option></select><input aria-label="Month filter" className="input-field" type="month" value={month} onChange={(e) => setMonth(e.target.value)} /></div></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-secondary/30 text-xs uppercase text-ink/60"><tr>{["Resident", "Room", "Month", "Amount", "Paid on", "UPI reference", "Submitted", "Status", "Proof", "Review"].map((h) => <th key={h} className="px-3 py-3">{h}</th>)}</tr></thead><tbody className="divide-y divide-secondary/40">{rows.map((r) => <tr key={r.id}><td className="px-3 py-3"><strong>{r.resident_name}</strong><br /><span className="text-xs text-ink/50">{r.resident_email} · #{r.user_id}</span></td><td className="px-3 py-3">{r.room_number || "—"}</td><td className="px-3 py-3">{r.billing_period}</td><td className="px-3 py-3">₹{r.amount.toLocaleString("en-IN")}</td><td className="px-3 py-3">{r.payment_date || "—"}</td><td className="px-3 py-3">{r.transaction_reference || "—"}</td><td className="px-3 py-3">{new Date(r.submitted_at).toLocaleDateString("en-IN")}</td><td className="px-3 py-3"><span className={BADGE[r.status]}>{STATUS[r.status]}</span></td><td className="px-3 py-3"><button className="text-primary underline" onClick={() => setSelected(r)}>View</button></td><td className="px-3 py-3">{r.status === "pending" ? <button onClick={() => setSelected(r)} className="text-primary underline">Review</button> : <span className="text-xs text-ink/50">{r.reviewer_id ? `Admin #${r.reviewer_id}` : "—"}</span>}</td></tr>)}</tbody></table></div>
      {rows.length === 0 && <p className="p-8 text-center text-sm text-ink/50">No submissions match these filters.</p>}
    </section>
    {selected && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Payment proof review"><div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-5"><div className="mb-4 flex justify-between"><div><h2 className="font-display text-xl font-semibold">{selected.resident_name} · {selected.billing_period}</h2><p className="text-sm text-ink/60">Claimed ₹{selected.amount.toLocaleString("en-IN")} · Ref {selected.transaction_reference || "—"}</p></div><button className="text-ink/60" onClick={() => setSelected(null)}>Close</button></div>{proof ? <img src={proof} alt="Resident uploaded payment proof" className="mx-auto max-h-[55vh] max-w-full rounded border object-contain" /> : <p className="p-12 text-center text-sm text-ink/50">Loading proof…</p>}{selected.status === "pending" && <div className="mt-5 flex justify-end gap-3"><button disabled={busy} className="btn-light px-4 py-2 text-danger" onClick={() => review("reject")}>Reject</button><button disabled={busy} className="btn-primary px-4 py-2" onClick={() => review("verify")}>Verify payment</button></div>}</div></div>}
  </div>;
}
