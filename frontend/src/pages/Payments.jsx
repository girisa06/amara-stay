import { useEffect, useState } from "react";
import { getMyPayments, getPaymentSettings, getPaymentSummary, fetchPaymentProof, submitPayment } from "../api/payments";
import Loader from "../components/common/Loader";

const label = { pending: "Pending Verification", verified: "Verified", rejected: "Rejected — Resubmission Required" };
const badge = { pending: "badge-warning", verified: "badge-success", rejected: "badge-danger" };

function requestErrorMessage(error, fallback) {
  const detail = error.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((item) => item.msg || "Invalid payment details").join(". ");
  return error.message || fallback;
}

export default function Payments() {
  const now = new Date();
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({ billing_period: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`, amount: "", payment_date: "", transaction_reference: "", proof: null });
  const refresh = async () => { const [rows, config, nextSummary] = await Promise.all([getMyPayments(), getPaymentSettings(), getPaymentSummary()]); setPayments(rows); setSettings(config); setSummary(nextSummary); setForm((old) => ({ ...old, billing_period: nextSummary.billing_period, amount: old.amount || (nextSummary.current_rent ? String(nextSummary.current_rent) : "") })); };
  useEffect(() => { refresh().catch((e) => setError(requestErrorMessage(e, "Unable to load payments."))).finally(() => setLoading(false)); }, []);
  const chooseFile = (file) => {
    if (preview) URL.revokeObjectURL(preview);
    setForm((old) => ({ ...old, proof: file }));
    setPreview(file ? URL.createObjectURL(file) : "");
  };
  const submit = async (event) => {
    event.preventDefault(); setError(""); setMessage("");
    if (!form.proof) { setError("Choose a screenshot of your UPI transaction."); return; }
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => { if (value !== null && value !== "" && key !== "proof") data.append(key, value); });
    data.append("proof", form.proof);
    setBusy(true);
    try {
      await submitPayment(data);
      setMessage("Your payment proof was submitted and is awaiting admin review.");
      setForm((old) => ({ ...old, transaction_reference: "", payment_date: "", proof: null }));
      chooseFile(null);
      try { await refresh(); }
      catch (refreshError) { setError(`Payment was submitted, but the history could not refresh: ${requestErrorMessage(refreshError, "Please reload the page.")}`); }
    }
    catch (submitError) { setError(requestErrorMessage(submitError, "Unable to submit payment proof.")); }
    finally { setBusy(false); }
  };
  if (loading) return <div className="section container-page"><Loader label="Loading payment details…" /></div>;
  const existing = payments.find((p) => p.billing_period === form.billing_period);
  const blocked = existing?.status === "pending" || existing?.status === "verified";
  const currentStatus = existing ? label[existing.status] : "Not Submitted";
  return <div className="section container-page max-w-4xl">
    <h1 className="mb-2 font-display text-3xl font-bold text-ink">Rent Payment</h1>
    <p className="mb-8 text-sm text-ink/60">Pay using your UPI app, then submit your transaction screenshot for review.</p>
    {error && <p role="alert" className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</p>}
    {message && <p role="status" className="mb-4 rounded-lg bg-success/10 p-3 text-sm text-success">{message}</p>}
    <section className="card mb-8 p-6">
      <div className="mb-3 flex flex-wrap justify-between gap-2"><h2 className="font-display text-xl font-semibold">Pay by UPI</h2><span className="badge">{summary?.billing_period || form.billing_period}</span></div>
      <p className="mb-3 text-sm text-ink/70">Current rent: {summary?.current_rent ? `₹${Number(summary.current_rent).toLocaleString("en-IN")}` : "Not available from a confirmed room booking"} · Due date: {summary?.due_date || "Not configured"}</p>
      <p className="mb-3 text-sm">This month’s status: <span className={existing ? badge[existing.status] : "badge"}>{currentStatus}</span></p>
      {settings.upi_id ? <p className="text-ink/70">UPI ID: <strong className="select-all text-primary">{settings.upi_id}</strong></p> : <p className="text-sm text-ink/60">UPI details have not been configured. Please contact the property administrator.</p>}
      <p className="mt-2 text-xs text-ink/50">Complete payment in your preferred UPI app. An uploaded screenshot is supporting evidence and does not itself confirm receipt.</p>
    </section>
    <form onSubmit={submit} className="card mb-10 space-y-4 p-6">
      <h2 className="font-display text-xl font-semibold">I’ve Paid</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">Payment month<input className="input-field mt-1" type="month" required value={form.billing_period} onChange={(e) => setForm({ ...form, billing_period: e.target.value })} /></label>
        <label className="text-sm">Amount claimed (₹)<input className="input-field mt-1" type="number" min="1" step="0.01" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></label>
        <label className="text-sm">Payment date (optional)<input className="input-field mt-1" type="date" value={form.payment_date} onChange={(e) => setForm({ ...form, payment_date: e.target.value })} /></label>
        <label className="text-sm">UPI transaction/reference ID (optional)<input className="input-field mt-1" maxLength="120" value={form.transaction_reference} onChange={(e) => setForm({ ...form, transaction_reference: e.target.value })} /></label>
      </div>
      {existing?.status === "rejected" && <p className="rounded-lg bg-danger/5 p-3 text-sm text-danger">Previous submission rejected: {existing.rejection_reason}. Upload corrected proof to resubmit.</p>}
      {blocked && <p className="text-sm text-ink/60">A submission for this month is already {existing.status}.</p>}
      <label className="block text-sm">UPI screenshot (JPEG, PNG, or WebP; max 5 MB)
        <input className="input-field mt-1" type="file" accept="image/jpeg,image/png,image/webp" required={!blocked} disabled={blocked} onChange={(e) => chooseFile(e.target.files?.[0] || null)} />
      </label>
      {preview && <img src={preview} alt="Payment proof preview" className="max-h-64 rounded-lg border border-secondary object-contain" />}
      <button className="btn-primary px-5 py-3" type="submit" disabled={busy || blocked}>{busy ? "Submitting..." : (existing?.status === "rejected" ? "Resubmit Payment Proof" : "Submit Payment Proof")}</button>
    </form>
    <section>
      <h2 className="mb-4 font-display text-2xl font-semibold">Payment History</h2>
      {payments.length === 0 ? <p className="card p-5 text-sm text-ink/60">No payment submissions yet.</p> : <div className="space-y-3">{payments.map((payment) => <PaymentRow key={payment.id} payment={payment} />)}</div>}
    </section>
  </div>;
}

function PaymentRow({ payment }) {
  const [proof, setProof] = useState("");
  useEffect(() => { let current = ""; fetchPaymentProof(payment.id).then((url) => { current = url; setProof(url); }).catch(() => {}); return () => { if (current) URL.revokeObjectURL(current); }; }, [payment.id]);
  return <article className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
    <div><p className="font-semibold">{payment.billing_period} · ₹{payment.amount.toLocaleString("en-IN")}</p><p className="text-xs text-ink/50">Submitted {new Date(payment.submitted_at).toLocaleString("en-IN")}{payment.transaction_reference ? ` · Ref ${payment.transaction_reference}` : ""}</p>{payment.rejection_reason && <p className="mt-1 text-sm text-danger">Reason: {payment.rejection_reason}</p>}</div>
    <div className="flex items-center gap-3"><span className={badge[payment.status]}>{label[payment.status]}</span>{proof && <a href={proof} target="_blank" rel="noreferrer" className="text-sm text-primary underline">View proof</a>}</div>
  </article>;
}
